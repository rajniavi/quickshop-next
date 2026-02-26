export const dynamic = "force-dynamic";

import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const discount = searchParams.get("discount"); // optional (10/20/30...)

  try {
    let query = `
      SELECT 
        p.product_id,
        p.product_name,
        p.price,
        p.discount,
        p.sale_start_date,
        p.sale_end_date,
        (
          SELECT pi.image_url
          FROM product_images pi
          WHERE pi.product_id = p.product_id
          ORDER BY pi.image_id ASC
          LIMIT 1
        ) AS image_url
      FROM products p
      WHERE 
        p.is_on_sale = 1
        AND p.is_active = 1
        AND p.discount > 0
        AND p.sale_start_date IS NOT NULL
        AND p.sale_end_date IS NOT NULL
        AND CURDATE() BETWEEN p.sale_start_date AND p.sale_end_date
    `;

    const values = [];

    /* 🎯 OPTIONAL FILTER: discount */
    if (discount) {
      query += ` AND p.discount = ?`;
      values.push(Number(discount));
    }

    /* ⏳ Ending soon first, then higher discount */
    query += `
      ORDER BY 
        p.sale_end_date ASC,
        p.discount DESC
    `;

    const [rows] = await pool.query(query, values);

    return NextResponse.json({
      success: true,
      products: rows,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
