export const dynamic = "force-dynamic";

import { pool } from "../../../../../../lib/db";
import { NextResponse } from "next/server";

/**
 * Allowed status transitions
 */
const allowedTransitions = {
  PLACED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: ["RETURNED"],
  CANCELLED: [],
  RETURNED: [],
};

export async function PUT(request, context) {
  const { id } = await context.params;

  try {
    const { status: newStatus } = await request.json();

    if (!newStatus) {
      return NextResponse.json(
        { message: "Status is required" },
        { status: 400 }
      );
    }

    // 1️⃣ Fetch current order state
    const [orders] = await pool.query(
      `
      SELECT status, stock_adjusted, returned_adjusted
      FROM orders
      WHERE order_id = ?
      `,
      [id]
    );

    if (orders.length === 0) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }

    const {
      status: currentStatus,
      stock_adjusted,
      returned_adjusted,
    } = orders[0];

    // 2️⃣ BLOCK invalid status transitions
    const allowedNext = allowedTransitions[currentStatus] || [];

    if (!allowedNext.includes(newStatus)) {
      return NextResponse.json(
        {
          message: `Invalid status change: ${currentStatus} → ${newStatus}`,
        },
        { status: 400 }
      );
    }

    // 3️⃣ Reduce stock (ONLY once): PLACED → SHIPPED
    if (
      currentStatus === "PLACED" &&
      newStatus === "SHIPPED" &&
      stock_adjusted === 0
    ) {
      const [items] = await pool.query(
        `SELECT product_id, quantity FROM order_items WHERE order_id = ?`,
        [id]
      );

      for (const item of items) {
        await pool.query(
          `
          UPDATE products
          SET stock = stock - ?
          WHERE product_id = ?
          `,
          [item.quantity, item.product_id]
        );
      }

      await pool.query(
        `UPDATE orders SET stock_adjusted = 1 WHERE order_id = ?`,
        [id]
      );
    }

    // 4️⃣ Add stock back (ONLY once): DELIVERED → RETURNED
    if (
      currentStatus === "DELIVERED" &&
      newStatus === "RETURNED" &&
      returned_adjusted === 0
    ) {
      const [items] = await pool.query(
        `SELECT product_id, quantity FROM order_items WHERE order_id = ?`,
        [id]
      );

      for (const item of items) {
        await pool.query(
          `
          UPDATE products
          SET stock = stock + ?
          WHERE product_id = ?
          `,
          [item.quantity, item.product_id]
        );
      }

      await pool.query(
        `UPDATE orders SET returned_adjusted = 1 WHERE order_id = ?`,
        [id]
      );
    }

    // 5️⃣ Update order status
    await pool.query(
      `
      UPDATE orders
      SET status = ?
      WHERE order_id = ?
      `,
      [newStatus, id]
    );

    return NextResponse.json({
      success: true,
      message: "Order status updated with rules enforced",
    });
  } catch (error) {
    console.error("ORDER STATUS RULE ERROR:", error);
    return NextResponse.json(
      { message: "Failed to update order status" },
      { status: 500 }
    );
  }
}
