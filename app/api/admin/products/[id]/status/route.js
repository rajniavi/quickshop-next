export const dynamic = "force-dynamic";

import { pool } from "../../../../../../lib/db";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const { id } = params;

  try {
    // 1️⃣ Get current status
    const [rows] = await pool.query(
      "SELECT is_active FROM products WHERE product_id = ?",
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const currentStatus = rows[0].is_active;
    const newStatus = currentStatus === 1 ? 0 : 1;

    // 2️⃣ Update status
    await pool.query(
      "UPDATE products SET is_active = ? WHERE product_id = ?",
      [newStatus, id]
    );

    return NextResponse.json({
      success: true,
      newStatus,
    });
  } catch (error) {
    console.error("PRODUCT STATUS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update product status" },
      { status: 500 }
    );
  }
}
