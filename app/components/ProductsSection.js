"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

export default function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        // ✅ FIX 1: correct API
        const res = await fetch("/api/admin/products");
        const data = await res.json();

        if (data.success) {
          // ✅ show only ACTIVE products on home
          setProducts(data.products.filter(p => p.is_active === 1));
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
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
          {products.map((product) => (
            <ProductCard
              key={product.product_id}
              product={{
                id: product.product_id,
                name: product.product_name,
                price: product.price,

                // ✅ FIX 2: use thumbnail_url
                image:
                  product.thumbnail_url ||
                  "/images/p1.png",

                category: product.category_name,
              }}
            />
          ))}
        </div>

        <div className="btn-box">
          <a href="/product">View All Products</a>
        </div>
      </div>
    </section>
  );
}
