import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "weekly";

    let rows = [];

    /* =====================================================
       1️⃣ WEEKLY ORDERS (ALL 7 DAYS – ZERO SAFE)
    ===================================================== */
    if (type === "weekly") {
      [rows] = await pool.query(`
        SELECT 
          d.day AS label,
          COALESCE(o.total, 0) AS value
        FROM (
          SELECT 'Monday' day, 1 ord UNION
          SELECT 'Tuesday', 2 UNION
          SELECT 'Wednesday', 3 UNION
          SELECT 'Thursday', 4 UNION
          SELECT 'Friday', 5 UNION
          SELECT 'Saturday', 6 UNION
          SELECT 'Sunday', 7
        ) d
        LEFT JOIN (
          SELECT 
            DAYNAME(order_date) AS day,
            COUNT(*) AS total
          FROM orders
          WHERE YEARWEEK(order_date, 1) = YEARWEEK(CURDATE(), 1)
          GROUP BY DAYNAME(order_date)
        ) o ON d.day = o.day
        ORDER BY d.ord
      `);
    }

    /* =====================================================
       2️⃣ WEEKLY REVENUE (ALL 7 DAYS – ZERO SAFE)
    ===================================================== */
    if (type === "revenue") {
      [rows] = await pool.query(`
        SELECT 
          d.day AS label,
          COALESCE(o.amount, 0) AS value
        FROM (
          SELECT 'Monday' day, 1 ord UNION
          SELECT 'Tuesday', 2 UNION
          SELECT 'Wednesday', 3 UNION
          SELECT 'Thursday', 4 UNION
          SELECT 'Friday', 5 UNION
          SELECT 'Saturday', 6 UNION
          SELECT 'Sunday', 7
        ) d
        LEFT JOIN (
          SELECT 
            DAYNAME(order_date) AS day,
            SUM(total_amount) AS amount
          FROM orders
          WHERE YEARWEEK(order_date, 1) = YEARWEEK(CURDATE(), 1)
          GROUP BY DAYNAME(order_date)
        ) o ON d.day = o.day
        ORDER BY d.ord
      `);
    }

    /* =====================================================
       3️⃣ ORDER STATUS (PIE CHART)
    ===================================================== */
    if (type === "status") {
      [rows] = await pool.query(`
        SELECT 
          status AS label,
          COUNT(*) AS value
        FROM orders
        GROUP BY status
      `);
    }

    /* =====================================================
       4️⃣ MONTH-WISE TOTAL ORDERS (JAN–DEC)
    ===================================================== */
    if (type === "monthly") {
      [rows] = await pool.query(`
        SELECT 
          DATE_FORMAT(order_date, '%b') AS label,
          COUNT(*) AS value,
          MONTH(order_date) AS month_no
        FROM orders
        WHERE YEAR(order_date) = YEAR(CURDATE())
        GROUP BY MONTH(order_date)
        ORDER BY month_no
      `);
    }

    /* =====================================================
       5️⃣ MONTH-WISE STATUS (PLACED vs DELIVERED)
    ===================================================== */
    if (type === "monthly-status") {
      [rows] = await pool.query(`
        SELECT 
          DATE_FORMAT(order_date, '%b') AS month,
          status,
          COUNT(*) AS total
        FROM orders
        WHERE YEAR(order_date) = YEAR(CURDATE())
          AND status IN ('PLACED', 'DELIVERED')
        GROUP BY MONTH(order_date), status
        ORDER BY MONTH(order_date)
      `);
    }

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error("ORDERS CHART ERROR:", err);
    return NextResponse.json(
      { success: false, error: "Chart data error" },
      { status: 500 }
    );
  }
}