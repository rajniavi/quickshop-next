import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { email, password } = await req.json();

  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email=? AND is_active=1",
    [email]
  );

  if (rows.length === 0) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const user = rows[0];
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    user: {
      user_id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      role: user.role, // ADMIN / CUSTOMER
    },
  });
}
