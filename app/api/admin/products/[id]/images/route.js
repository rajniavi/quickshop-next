import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { pool } from "@/lib/db";

/* ======================================================
   GET PRODUCT IMAGES
   URL: /api/admin/products/[id]/images
====================================================== */
export async function GET(request, context) {
  const { id } = await context.params; // ✅ REQUIRED

  if (!id || isNaN(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid product id" },
      { status: 400 }
    );
  }

  try {
    const [rows] = await pool.query(
      `
      SELECT image_id, image_url
      FROM product_images
      WHERE product_id = ?
      ORDER BY image_id ASC
      `,
      [id]
    );

    return NextResponse.json({
      success: true,
      images: rows,
    });
  } catch (error) {
    console.error("GET IMAGE ERROR:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/* ======================================================
   UPLOAD PRODUCT IMAGES
====================================================== */
export async function POST(request, context) {
  const { id } = await context.params; // ✅ REQUIRED

  if (!id || isNaN(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid product id" },
      { status: 400 }
    );
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll("images");

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "No images uploaded" },
        { status: 400 }
      );
    }

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "products",
      id.toString()
    );

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const savedImages = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, buffer);

      const imageUrl = `/uploads/products/${id}/${fileName}`;

      await pool.query(
        `INSERT INTO product_images (product_id, image_url) VALUES (?, ?)`,
        [id, imageUrl]
      );

      savedImages.push(imageUrl);
    }

    return NextResponse.json({
      success: true,
      images: savedImages,
    });
  } catch (error) {
    console.error("UPLOAD IMAGE ERROR:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
