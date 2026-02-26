"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";

export default function CategoryPage() {
  const { id } = useParams();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function loadData() {
      try {
        // ✅ fetch ALL categories
        const catRes = await fetch("/api/categories");
        const catData = await catRes.json();

        if (!catData.success) return;

        // 🔥 find category or subcategory by id
        const allCats = catData.categories;
        const found = allCats.find(
          c => String(c.category_id) === String(id)
        );

        setCategory(found || null);

        // ✅ fetch products by category / subcategory
        const prodRes = await fetch(
          `/api/products?categoryId=${id}`
        );
        const prodData = await prodRes.json();

        setProducts(prodData.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (loading) {
    return <p style={{ padding: 40 }}>Loading...</p>;
  }

  if (!category) {
    return <p style={{ padding: 40 }}>Category not found</p>;
  }

  return (
    <>
  

      <div className="container py-5">
        <h2 className="mb-4">{category.category_name}</h2>

        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="row">
            {products.map(p => (
              <div key={p.product_id} className="col-md-3 mb-4">
                <div className="card h-100">
                  <img
                    src={p.image}
                    className="card-img-top"
                    alt={p.product_name}
                  />
                  <div className="card-body">
                    <h6>{p.product_name}</h6>
                    <p className="fw-bold">₹{p.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
