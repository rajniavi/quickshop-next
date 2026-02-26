import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/* ======================================================
   GET SINGLE PRODUCT + ALL IMAGES (PUBLIC)
   URL: /api/products/[id]
====================================================== */
export async function GET(request, context) {
  const { id } = await context.params; // ✅ FIXED

  if (!id || isNaN(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid product id" },
      { status: 400 }
    );
  }

  try {
    /* 🔹 1. Get product details */
    const [[product]] = await pool.query(
      `
      SELECT 
        p.product_id,
        p.product_name,
        p.price,
        p.stock,
        p.is_active,
        c.category_name
      FROM products p
      LEFT JOIN categories c 
        ON p.category_id = c.category_id
      WHERE p.product_id = ? AND p.is_active = 1
      `,
      [id]
    );

    if (!product) {
      return NextResponse.json(
        { success: false, product: null },
        { status: 404 }
      );
    }

    /* 🔹 2. Get ALL images of product */
    const [images] = await pool.query(
      `
      SELECT image_id, image_url
      FROM product_images
      WHERE product_id = ?
      ORDER BY image_id ASC
      `,
      [id]
    );

    /* 🔹 3. Attach images */
    product.images = images;

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
