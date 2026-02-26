import { pool } from "@/lib/db";

export const dynamic = "force-dynamic";

async function getSaleProducts(discount) {
  const [rows] = await pool.query(
    `
    SELECT
      p.product_id,
      p.product_name,
      p.price,
      p.discount,
      (
        p.price - (p.price * p.discount / 100)
      ) AS discounted_price,
      (
        SELECT pi.image_url
        FROM product_images pi
        WHERE pi.product_id = p.product_id
        ORDER BY pi.image_id ASC
        LIMIT 1
      ) AS image_url
    FROM products p
    WHERE
      p.is_on_sale = 1
      AND p.discount = ?
      AND p.is_active = 1
      AND CURDATE() BETWEEN p.sale_start_date AND p.sale_end_date
    ORDER BY p.product_id DESC
    `,
    [discount]
  );

  return rows;
}

export default async function SalePage({ params }) {
  const discount = Number(params.discount);

  if (isNaN(discount)) {
    return (
      <div className="container mt-5">
        <h2>Invalid sale page</h2>
      </div>
    );
  }

  const products = await getSaleProducts(discount);

  return (
    <section className="layout_padding">
      <div className="container">

        {/* HEADING */}
        <div className="text-center mb-5">
          <h2 style={{ fontWeight: "700" }}>
            🔥 Flat {discount}% OFF
          </h2>
          <p>Limited time sale · Hurry up!</p>
        </div>

        {/* PRODUCTS */}
        <div className="row">
          {products.length === 0 && (
            <p className="text-center">
              No products available for this sale right now.
            </p>
          )}

          {products.map((p) => (
            <div
              key={p.product_id}
              className="col-md-4 col-sm-6 mb-4"
            >
              <div className="card h-100 shadow-sm">

                <img
                  src={p.image_url || "/images/no-image.png"}
                  className="card-img-top"
                  style={{ height: "220px", objectFit: "cover" }}
                  alt={p.product_name}
                />

                <div className="card-body text-center">
                  <h5>{p.product_name}</h5>

                  <p className="mb-2">
                    <del className="text-muted me-2">
                      ₹{p.price}
                    </del>
                    <span className="fw-bold text-danger">
                      ₹{Math.round(p.discounted_price)}
                    </span>
                  </p>

                  <a
                    href={`/product/${p.product_id}`}
                    className="btn btn-outline-danger btn-sm"
                  >
                    View Product
                  </a>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
