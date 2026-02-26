// export const dynamic = "force-dynamic";

// import { pool } from "../../../lib/db";
// import { NextResponse } from "next/server";

// export async function POST(request) {
//   try {
//     const body = await request.json();
//     const { customer, cart, totalAmount } = body;

//     if (!cart || cart.length === 0) {
//       return NextResponse.json(
//         { message: "Cart is empty" },
//         { status: 400 }
//       );
//     }

//     // 🔹 1. INSERT INTO orders table
//     const [orderResult] = await pool.query(
//       `
//       INSERT INTO orders (total_amount, status)
//       VALUES (?, 'PLACED')
//       `,
//       [totalAmount]
//     );

//     const orderId = orderResult.insertId;

//     // 🔹 2. INSERT INTO order_items table
//     for (const item of cart) {
//       await pool.query(
//         `
//         INSERT INTO order_items
//         (order_id, product_id, quantity, price)
//         VALUES (?, ?, ?, ?)
//         `,
//         [
//           orderId,
//           item.id,
//           item.quantity,
//           item.price,
//         ]
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       orderId,
//     });
//   } catch (error) {
//     console.error("ORDER ERROR:", error);
//     return NextResponse.json(
//       { message: "Failed to place order" },
//       { status: 500 }
//     );
//   }
// }
export const dynamic = "force-dynamic";

import { pool } from "../../../lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      customer,
      cart,
      totalAmount,
      paymentMode = "MOCK",
      paymentStatus = "PAID",
    } = body;

    // ❌ Basic validations
    if (!cart || cart.length === 0) {
      return NextResponse.json(
        { message: "Cart is empty" },
        { status: 400 }
      );
    }

    if (!customer?.name || !customer?.phone) {
      return NextResponse.json(
        { message: "Customer details missing" },
        { status: 400 }
      );
    }

    // 🔹 1. INSERT INTO orders table
    const [orderResult] = await pool.query(
      `
      INSERT INTO orders 
      (total_amount, status)
      VALUES (?, ?)
      `,
      [
        totalAmount,
        paymentStatus === "PAID" ? "PLACED" : "PENDING",
      ]
    );

    const orderId = orderResult.insertId;

    // 🔹 2. INSERT INTO order_items table
    for (const item of cart) {
      await pool.query(
        `
        INSERT INTO order_items
        (order_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?)
        `,
        [
          orderId,
          item.id,
          item.quantity,
          item.price,
        ]
      );
    }

    // ✅ SUCCESS RESPONSE
    return NextResponse.json({
      success: true,
      orderId,
      payment: {
        mode: paymentMode,
        status: paymentStatus,
      },
    });
  } catch (error) {
    console.error("ORDER ERROR:", error);
    return NextResponse.json(
      { message: "Failed to place order" },
      { status: 500 }
    );
  }
}