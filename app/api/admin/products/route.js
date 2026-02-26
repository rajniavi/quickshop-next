import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/* ---------------- GET ALL PRODUCTS ---------------- */
export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.product_id,
        p.product_name,
        p.price,
        p.stock,
        p.is_active,
        p.is_on_sale,
        p.discount,
        c.category_name,
        (
          SELECT pi.image_url
          FROM product_images pi
          WHERE pi.product_id = p.product_id
          ORDER BY pi.image_id ASC
          LIMIT 1
        ) AS thumbnail_url
      FROM products p
      LEFT JOIN categories c 
        ON p.category_id = c.category_id
      ORDER BY p.product_id DESC
    `);

    return NextResponse.json({ success: true, products: rows });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/* ---------------- CREATE PRODUCT ---------------- */
export async function POST(request) {
  try {
    const {
      product_name,
      price,
      stock,
      category_id,
      is_active,
      is_on_sale,
      discount,
    } = await request.json();

    if (!product_name || !price || !category_id) {
      return NextResponse.json(
        { success: false, message: "Required fields missing" },
        { status: 400 }
      );
    }

    const [result] = await pool.query(
      `
      INSERT INTO products 
        (
          product_name,
          price,
          stock,
          category_id,
          is_active,
          is_on_sale,
          discount
        )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        product_name,
        Number(price),
        Number(stock || 0),
        Number(category_id),
        Number(is_active ?? 1),
        Number(is_on_sale ?? 0),
        Number(is_on_sale ? discount : 0),
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      product_id: result.insertId,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
