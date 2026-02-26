import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req) {
  const { id, status } = await req.json();

  await pool.query(
    "UPDATE blogs SET status=? WHERE id=?",
    [status, id]
  );

  return NextResponse.json({ success: true });
}
