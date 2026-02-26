import { pool } from "../../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT DATABASE() AS db");
    return NextResponse.json({
      success: true,
      database: rows[0].db,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
