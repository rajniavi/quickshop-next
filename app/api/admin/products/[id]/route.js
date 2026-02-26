// export const dynamic = "force-dynamic";

// import { pool } from "../../../../../lib/db";
// import { NextResponse } from "next/server";

// /* ---------------- GET PRODUCT ---------------- */
// export async function GET(request, context) {
//   const { id } = await context.params; // ✅ REQUIRED in Next 15

//   if (!id || isNaN(id)) {
//     return NextResponse.json(
//       { success: false, message: "Invalid product id" },
//       { status: 400 }
//     );
//   }

//   try {
//     const [rows] = await pool.query(
//       `
//       SELECT 
//         product_id,
//         product_name,
//         price,
//         stock,
//         is_active,
//         is_on_sale,
//         discount
//       FROM products
//       WHERE product_id = ?
//       `,
//       [id]
//     );

//     if (rows.length === 0) {
//       return NextResponse.json(
//         { success: false, message: "Product not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       product: rows[0],
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }

// /* ---------------- UPDATE PRODUCT ---------------- */
// export async function PUT(request, context) {
//   const { id } = await context.params; // ✅ REQUIRED

//   const {
//     product_name,
//     price,
//     stock,
//     is_active,
//     is_on_sale,
//     discount,
//   } = await request.json();

//   if (!id || isNaN(id)) {
//     return NextResponse.json(
//       { success: false, message: "Invalid product id" },
//       { status: 400 }
//     );
//   }

//   try {
//     await pool.query(
//       `
//       UPDATE products
//       SET
//         product_name = ?,
//         price = ?,
//         stock = ?,
//         is_active = ?,
//         is_on_sale = ?,
//         discount = ?
//       WHERE product_id = ?
//       `,
//       [
//         product_name,
//         Number(price),
//         Number(stock),
//         Number(is_active),
//         Number(is_on_sale),
//         Number(is_on_sale ? discount : 0),
//         id,
//       ]
//     );

//     return NextResponse.json({
//       success: true,
//       message: "Product updated successfully",
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }

// /* ---------------- DELETE PRODUCT ---------------- */
// export async function DELETE(request, context) {
//   const { id } = await context.params; // ✅ REQUIRED

//   if (!id || isNaN(id)) {
//     return NextResponse.json(
//       { success: false, message: "Invalid product id" },
//       { status: 400 }
//     );
//   }

//   try {
//     await pool.query(
//       `
//       UPDATE products
//       SET is_active = 0
//       WHERE product_id = ?
//       `,
//       [id]
//     );

//     return NextResponse.json({
//       success: true,
//       message: "Product deleted (soft delete)",
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }
export const dynamic = "force-dynamic";

import { pool } from "../../../../../lib/db";
import { NextResponse } from "next/server";

/* ---------------- GET PRODUCT ---------------- */
export async function GET(request, context) {
  const { id } = await context.params; // ✅ Next 15 required

  if (!id || isNaN(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid product id" },
      { status: 400 }
    );
  }

  try {
    const [rows] = await pool.query(
      `
      SELECT 
        product_id,
        product_name,
        price,
        stock,
        is_active,
        is_on_sale,
        discount,
        sale_start_date,
        sale_end_date
      FROM products
      WHERE product_id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product: rows[0],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/* ---------------- UPDATE PRODUCT ---------------- */
export async function PUT(request, context) {
  const { id } = await context.params;

  const {
    product_name,
    price,
    stock,
    is_active,
    is_on_sale,
    discount,
    sale_start_date,
    sale_end_date,
  } = await request.json();

  if (!id || isNaN(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid product id" },
      { status: 400 }
    );
  }

  try {
    await pool.query(
      `
      UPDATE products
      SET
        product_name = ?,
        price = ?,
        stock = ?,
        is_active = ?,
        is_on_sale = ?,
        discount = ?,
        sale_start_date = ?,
        sale_end_date = ?
      WHERE product_id = ?
      `,
      [
        product_name,
        Number(price),
        Number(stock),
        Number(is_active),
        Number(is_on_sale),
        Number(is_on_sale ? discount : 0),
        is_on_sale ? sale_start_date : null,
        is_on_sale ? sale_end_date : null,
        id,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/* ---------------- DELETE PRODUCT (SOFT DELETE) ---------------- */
export async function DELETE(request, context) {
  const { id } = await context.params;

  if (!id || isNaN(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid product id" },
      { status: 400 }
    );
  }

  try {
    await pool.query(
      `
      UPDATE products
      SET is_active = 0
      WHERE product_id = ?
      `,
      [id]
    );

    return NextResponse.json({
      success: true,
      message: "Product deleted (soft delete)",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
