"use client";

import Navbar from "../../../components/Navbar";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminEditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState({
    product_name: "",
    price: "",
    stock: "",
    is_active: 1,

    is_on_sale: 0,
    discount: 0,
    sale_start_date: "",
    sale_end_date: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ================== FETCH PRODUCT ================== */
  useEffect(() => {
    if (!id) return;

    fetch(`/api/admin/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.product) {
          setProduct({
            product_name: data.product.product_name,
            price: data.product.price,
            stock: data.product.stock,
            is_active: data.product.is_active,

            is_on_sale: Number(data.product.is_on_sale || 0),
            discount: Number(data.product.discount || 0),
            sale_start_date: data.product.sale_start_date || "",
            sale_end_date: data.product.sale_end_date || "",
          });
        }
        setLoading(false);
      })
      .catch(() => {
        alert("Failed to load product");
        setLoading(false);
      });
  }, [id]);

  /* ================== SAVE ================== */
  const handleSave = async () => {
    if (!product.product_name || !product.price || !product.stock) {
      alert("All fields are required");
      return;
    }

    if (product.is_on_sale === 1) {
      if (!product.discount) {
        alert("Select discount percentage");
        return;
      }
      if (!product.sale_start_date || !product.sale_end_date) {
        alert("Select sale start & end date");
        return;
      }
    }

    setSaving(true);

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_name: product.product_name,
          price: Number(product.price),
          stock: Number(product.stock),
          is_active: product.is_active,

          is_on_sale: product.is_on_sale,
          discount: product.is_on_sale ? product.discount : 0,
          sale_start_date: product.is_on_sale
            ? product.sale_start_date
            : null,
          sale_end_date: product.is_on_sale
            ? product.sale_end_date
            : null,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Product updated successfully");
        router.push("/admin/products");
      } else {
        alert(data.message || "Update failed");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mt-5">Loading product...</div>
      </>
    );
  }

  /* ================== UI ================== */
  return (
    <>
      <Navbar />

      <div className="container" style={{ padding: "80px 0", maxWidth: "700px" }}>
        <h2 className="mb-4">Edit Product</h2>

        {/* NAME */}
        <input
          className="form-control mb-3"
          placeholder="Product Name"
          value={product.product_name}
          onChange={(e) =>
            setProduct({ ...product, product_name: e.target.value })
          }
        />

        {/* PRICE */}
        <input
          type="number"
          className="form-control mb-3"
          placeholder="Price"
          value={product.price}
          onChange={(e) =>
            setProduct({ ...product, price: e.target.value })
          }
        />

        {/* STOCK */}
        <input
          type="number"
          className="form-control mb-3"
          placeholder="Stock"
          value={product.stock}
          onChange={(e) =>
            setProduct({ ...product, stock: e.target.value })
          }
        />

        {/* SALE TOGGLE */}
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            checked={product.is_on_sale === 1}
            onChange={(e) =>
              setProduct({
                ...product,
                is_on_sale: e.target.checked ? 1 : 0,
              })
            }
          />
          <label className="form-check-label">
            Put this product on Sale
          </label>
        </div>

        {/* SALE OPTIONS */}
        {product.is_on_sale === 1 && (
          <>
            <select
              className="form-select mb-3"
              value={product.discount}
              onChange={(e) =>
                setProduct({
                  ...product,
                  discount: Number(e.target.value),
                })
              }
            >
              <option value="">Select Discount</option>
              {[10, 20, 30, 40, 50, 60, 70].map((d) => (
                <option key={d} value={d}>
                  {d}% OFF
                </option>
              ))}
            </select>

            <label className="form-label">Sale Start Date</label>
            <input
              type="date"
              className="form-control mb-3"
              value={product.sale_start_date}
              onChange={(e) =>
                setProduct({
                  ...product,
                  sale_start_date: e.target.value,
                })
              }
            />

            <label className="form-label">Sale End Date</label>
            <input
              type="date"
              className="form-control mb-3"
              value={product.sale_end_date}
              onChange={(e) =>
                setProduct({
                  ...product,
                  sale_end_date: e.target.value,
                })
              }
            />
          </>
        )}

        {/* STATUS */}
        <select
          className="form-select mb-4"
          value={product.is_active}
          onChange={(e) =>
            setProduct({ ...product, is_active: Number(e.target.value) })
          }
        >
          <option value={1}>ACTIVE</option>
          <option value={0}>INACTIVE</option>
        </select>

        <button
          className="btn btn-primary w-100"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </>
  );
}
