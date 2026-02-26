import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT *
      FROM blogs
      WHERE status = 'PUBLISHED'
        AND is_deleted = 0
      ORDER BY created_at DESC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("PUBLIC BLOG API ERROR:", error);
    return NextResponse.json([], { status: 500 });
  }
}
