import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT COUNT(*) as total FROM products");
    return NextResponse.json({
      success: true,
      total: rows[0].total,
      db: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    });
  }
}