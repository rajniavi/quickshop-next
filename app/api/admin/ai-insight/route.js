import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const conn = await pool.getConnection();

    // 1️⃣ Orders this week
    const [thisWeekOrders] = await conn.query(`
      SELECT COUNT(*) as count
      FROM orders
      WHERE YEARWEEK(order_date, 1) = YEARWEEK(CURDATE(), 1)
    `);

    const [lastWeekOrders] = await conn.query(`
      SELECT COUNT(*) as count
      FROM orders
      WHERE YEARWEEK(order_date, 1) = YEARWEEK(CURDATE(), 1) - 1
    `);

    const currentCount = thisWeekOrders[0].count;
    const lastCount = lastWeekOrders[0].count;

    let growthText = "No orders comparison available";
    if (lastCount > 0) {
      const percent = (((currentCount - lastCount) / lastCount) * 100).toFixed(1);
      growthText =
        percent >= 0
          ? `Orders increased by ${percent}% compared to last week`
          : `Orders decreased by ${Math.abs(percent)}% compared to last week`;
    }

    // 2️⃣ Revenue this week
    const [revenueResult] = await conn.query(`
      SELECT IFNULL(SUM(total_amount), 0) as revenue
      FROM orders
      WHERE YEARWEEK(order_date, 1) = YEARWEEK(CURDATE(), 1)
      AND status != 'CANCELLED'
    `);

    // 3️⃣ Repeat customers
    const [repeatCustomers] = await conn.query(`
      SELECT COUNT(*) as repeatCount FROM (
        SELECT user_id
        FROM orders
        WHERE YEARWEEK(order_date, 1) = YEARWEEK(CURDATE(), 1)
        GROUP BY user_id
        HAVING COUNT(*) > 1
      ) t
    `);

    // 🔥 4️⃣ STATUS DISTRIBUTION (NEW STEP 1 FEATURE)
    const [statusRows] = await conn.query(`
      SELECT status, COUNT(*) as count
      FROM orders
      WHERE YEARWEEK(order_date, 1) = YEARWEEK(CURDATE(), 1)
      GROUP BY status
    `);

    conn.release();

    // Convert status numbers → percentage text
    const statusInsight = statusRows.map(row => {
      const percent = ((row.count / currentCount) * 100).toFixed(0);
      return `${percent}% orders are ${row.status}`;
    });

    // 🧠 Final insights array
    const insight = [
      growthText,
      `This week’s revenue is ₹${revenueResult[0].revenue}`,
      `${repeatCustomers[0].repeatCount} repeat customers placed multiple orders this week`,
      ...statusInsight // 👈 status insights added
    ];

    return NextResponse.json({
      success: true,
      insight,
      source: "database",
    });
  } catch (error) {
    console.error("INSIGHT ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}