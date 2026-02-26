import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req) {
  const { id } = await req.json();

  await pool.query(
    "UPDATE blogs SET is_deleted=1 WHERE id=?",
    [id]
  );

  return NextResponse.json({ success: true });
}
