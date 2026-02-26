import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    let query = `
      SELECT 
        p.product_id,
        p.product_name,
        p.price,
        p.stock,
        p.category_id,
        p.image_url AS image,
        p.is_on_sale,
        c.category_name
      FROM products p
      LEFT JOIN categories c 
        ON p.category_id = c.category_id
      WHERE p.is_active = 1
    `;

    const values = [];

    if (categoryId) {
      query += ` AND p.category_id = ?`;
      values.push(categoryId);
    }

    query += ` ORDER BY p.product_id DESC`;

    const [rows] = await pool.query(query, values);

    return NextResponse.json({
      success: true,
      products: rows,
    });
  } catch (error) {
    console.error("PRODUCT API ERROR:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
