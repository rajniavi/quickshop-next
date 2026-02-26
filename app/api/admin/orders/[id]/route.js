export const dynamic = "force-dynamic";

import { pool } from "../../../../../lib/db";
import { NextResponse } from "next/server";

export async function GET(request, context) {
  const { id } = await context.params;

  try {
    // 🔹 Get order details
    const [orders] = await pool.query(
      `
      SELECT 
        order_id,
        total_amount,
        status,
        order_date
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

    // 🔹 Get order items
    const [items] = await pool.query(
      `
      SELECT 
        order_item_id,
        product_id,
        quantity,
        price
      FROM order_items
      WHERE order_id = ?
      `,
      [id]
    );

    return NextResponse.json({
      success: true,
      order: orders[0],
      items,
    });
  } catch (error) {
    console.error("ADMIN ORDER DETAILS ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}
