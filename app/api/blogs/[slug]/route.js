import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    // 🔑 params is a Promise
    const { slug } = await params;

    const [rows] = await pool.query(
      `
      SELECT *
      FROM blogs
      WHERE slug = ?
        AND status = 'PUBLISHED'
        AND is_deleted = 0
      LIMIT 1
      `,
      [slug]
    );

    if (rows.length === 0) {
      return NextResponse.json(null, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("BLOG DETAIL API ERROR:", error);
    return NextResponse.json(null, { status: 500 });
  }
}
