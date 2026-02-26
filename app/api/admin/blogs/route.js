import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import fs from "fs";
import path from "path";

// slug generator
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(req) {
  try {
    const formData = await req.formData();

    const title = formData.get("title");
    const short_description = formData.get("short_description");
    const content = formData.get("content");
    const image = formData.get("image");

    // 🔒 Force DRAFT for safety
    const status = "DRAFT";

    if (!title || !short_description || !content) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // base slug
    let slug = slugify(title);

    // 🔑 ensure unique slug
    const [existing] = await pool.query(
      "SELECT id FROM blogs WHERE slug LIKE ?",
      [`${slug}%`]
    );

    if (existing.length > 0) {
      slug = `${slug}-${existing.length + 1}`;
    }

    let imageName = null;

    // image upload
    if (image && image.name) {
      const uploadDir = path.join(
        process.cwd(),
        "public/uploads/blogs"
      );

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      imageName = `${Date.now()}-${image.name}`;
      const filePath = path.join(uploadDir, imageName);

      const buffer = Buffer.from(await image.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
    }

    // save blog
    await pool.query(
      `INSERT INTO blogs 
       (title, slug, short_description, content, image, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, slug, short_description, content, imageName, status]
    );

    return NextResponse.json({
      message: "Blog submitted successfully. Await admin approval.",
    });
  } catch (error) {
    console.error("BLOG CREATE ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM blogs
       WHERE is_deleted = 0
       ORDER BY created_at DESC`
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("BLOG LIST ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
