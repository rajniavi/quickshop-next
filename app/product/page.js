"use client";

import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/admin/products");
        const data = await res.json();

        if (data.success) {
          // ✅ only ACTIVE products
          setProducts(data.products.filter(p => p.is_active === 1));
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <>
 

      <section className="product_section layout_padding">
        <div className="container">
          <div className="heading_container heading_center">
            <h2>
              Our <span>Products</span>
            </h2>
          </div>

          {loading && (
            <p style={{ textAlign: "center" }}>Loading products...</p>
          )}

          {!loading && products.length === 0 && (
            <p style={{ textAlign: "center" }}>No products found</p>
          )}

          <div className="row">
            {products.map((p) => (
              <div className="col-sm-6 col-md-4 col-lg-4" key={p.product_id}>
                <div className="box">
                  <div className="img-box">
                    <img
                      src={p.thumbnail_url || "/images/p1.png"}
                      alt={p.product_name}
                      style={{ width: "100%", height: "250px", objectFit: "cover" }}
                    />
                  </div>

                  <div className="detail-box">
                    <h5>{p.product_name}</h5>
                    <h6>₹{p.price}</h6>

                    <Link
                      href={`/product/${p.product_id}`}
                      className="btn btn-sm btn-dark mt-2"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
