import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    // 👉 THIS WEEK
    const [thisWeek] = await pool.query(`
      SELECT 
        COUNT(*) as orders,
        SUM(total_amount) as revenue
      FROM orders
      WHERE YEARWEEK(order_date, 1) = YEARWEEK(CURDATE(), 1)
    `);

    // 👉 LAST WEEK
    const [lastWeek] = await pool.query(`
      SELECT 
        COUNT(*) as orders
      FROM orders
      WHERE YEARWEEK(order_date, 1) = YEARWEEK(CURDATE() - INTERVAL 1 WEEK, 1)
    `);

    const currentOrders = thisWeek[0].orders || 0;
    const previousOrders = lastWeek[0].orders || 0;
    const revenue = thisWeek[0].revenue || 0;

    // 👉 % change calculation
    let orderChange = 0;
    if (previousOrders > 0) {
      orderChange = Math.round(
        ((currentOrders - previousOrders) / previousOrders) * 100
      );
    }

    // 👉 status breakdown
    const [statusRows] = await pool.query(`
      SELECT status, COUNT(*) as count
      FROM orders
      WHERE YEARWEEK(order_date, 1) = YEARWEEK(CURDATE(), 1)
      GROUP BY status
    `);

    const statusText = statusRows
      .map((s) => `${s.count} orders are ${s.status}`)
      .join(", ");

    return NextResponse.json({
      success: true,
      insight: [
        `Orders ${orderChange >= 0 ? "increased" : "decreased"} by ${Math.abs(
          orderChange
        )}% compared to last week`,
        `This week’s revenue is ₹${revenue}`,
        statusText || "No orders placed this week",
      ],
      source: "database",
    });
  } catch (err) {
    console.error("INSIGHT ERROR:", err);
    return NextResponse.json(
      { success: false, error: "Database error" },
      { status: 500 }
    );
  }
}