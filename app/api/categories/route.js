import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT category_id, category_name, parent_id
      FROM categories
      WHERE is_active = 1
      ORDER BY parent_id, category_id
    `);

    return NextResponse.json({
      success: true,
      categories: rows,
    });
  } catch (error) {
    console.error("Categories API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
