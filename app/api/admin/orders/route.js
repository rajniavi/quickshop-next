export const dynamic = "force-dynamic";

import { pool } from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [orders] = await pool.query(`
      SELECT
        order_id,
        total_amount,
        status,
        order_date
      FROM orders
      ORDER BY order_id DESC
    `);

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("ADMIN ORDERS ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
