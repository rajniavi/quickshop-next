import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req) {
  try {
    const { message } = await req.json();
    const keyword = message.toLowerCase().trim();

    // simple greeting
    if (["hi", "hello", "hey"].includes(keyword)) {
      return NextResponse.json({
        type: "text",
        reply: "I'm here to help you with shopping 😊",
      });
    }

    // 🔍 SEARCH PRODUCTS
    const [products] = await pool.query(
      `
      SELECT 
        p.product_id,
        p.product_name,
        p.price
      FROM products p
      WHERE p.is_active = 1
      AND p.product_name LIKE ?
      `,
      [`%${keyword}%`]
    );

    if (products.length === 0) {
      return NextResponse.json({
        type: "text",
        reply: "No products found 😔",
      });
    }

    // 🔥 FETCH IMAGES FOR EACH PRODUCT
    const result = [];

    for (const p of products) {
      const [images] = await pool.query(
        `
        SELECT image_url 
        FROM product_images 
        WHERE product_id = ?
        `,
        [p.product_id]
      );

      result.push({
        id: p.product_id,
        title: p.product_name,
        price: p.price,
        images: images.map((img) => img.image_url),
      });
    }

    return NextResponse.json({
      type: "products",
      products: result,
    });
  } catch (error) {
    console.error("CHAT API ERROR:", error);

    return NextResponse.json(
      {
        type: "text",
        reply: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
