import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { pool } from "@/lib/db";

/* ======================================================
   DELETE PRODUCT IMAGE
   DELETE /api/admin/products/[id]/images/[imageId]
====================================================== */
export async function DELETE(request, context) {
  const { id, imageId } = await context.params; // ✅ MUST await

  if (!id || isNaN(id) || !imageId || isNaN(imageId)) {
    return NextResponse.json(
      { success: false, message: "Invalid product or image id" },
      { status: 400 }
    );
  }

  try {
    /* 🔎 1️⃣ Get image path from DB */
    const [[image]] = await pool.query(
      `
      SELECT image_url 
      FROM product_images 
      WHERE image_id = ? AND product_id = ?
      `,
      [imageId, id]
    );

    if (!image) {
      return NextResponse.json(
        { success: false, message: "Image not found" },
        { status: 404 }
      );
    }

    /* 🗑️ 2️⃣ Delete image file from disk */
    const filePath = path.join(
      process.cwd(),
      "public",
      image.image_url
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    /* 🗑️ 3️⃣ Delete record from DB */
    await pool.query(
      `DELETE FROM product_images WHERE image_id = ?`,
      [imageId]
    );

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("DELETE IMAGE ERROR:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
