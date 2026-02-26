import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

// ✅ GET: Fetch all users
export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        user_id,
        full_name,
        email,
        mobile,
        role,
        is_active,
        created_at
      FROM users
      ORDER BY created_at DESC
    `);

    return NextResponse.json({ users: rows });
  } catch (error) {
    console.error("ADMIN USERS FETCH ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// ✅ PUT: Activate / Deactivate user
export async function PUT(req) {
  try {
    const { user_id, is_active } = await req.json();

    await pool.query(
      "UPDATE users SET is_active = ? WHERE user_id = ?",
      [is_active, user_id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN USER UPDATE ERROR:", error);
    return NextResponse.json(
      { message: "Failed to update user" },
      { status: 500 }
    );
  }
}
