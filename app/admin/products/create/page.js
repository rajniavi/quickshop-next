"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminCreateProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState([]);

  const [product, setProduct] = useState({
    product_name: "",
    price: "",
    stock: "",
    category_id: "",
    is_active: 1,
    is_on_sale: 0,
    discount: "",
  });

  /* ---------------- FETCH CATEGORIES ---------------- */
  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []));
  }, []);

  /* ---------------- IMAGE HANDLER ---------------- */
  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  /* ---------------- SAVE PRODUCT ---------------- */
  const handleSave = async () => {
    /* BASIC VALIDATION */
    if (
      !product.product_name.trim() ||
      !product.price ||
      !product.stock ||
      !product.category_id
    ) {
      alert("All fields are required");
      return;
    }

    /* SALE VALIDATION */
    if (product.is_on_sale === 1) {
      if (!product.discount || Number(product.discount) <= 0) {
        alert("Please enter a valid discount percentage");
        return;
      }
    }

    setSaving(true);

    try {
      const payload = {
        product_name: product.product_name.trim(),
        price: Number(product.price),
        stock: Number(product.stock),
        category_id: Number(product.category_id),
        is_active: Number(product.is_active),
        is_on_sale: Number(product.is_on_sale),
        discount:
          product.is_on_sale === 1 ? Number(product.discount) : 0,
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Product creation failed");
        return;
      }

      const productId = data.product_id;

      /* IMAGE UPLOAD (OPTIONAL) */
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((img) => formData.append("images", img));

        await fetch(`/api/admin/products/${productId}/images`, {
          method: "POST",
          body: formData,
        });
      }

      alert("Product created successfully");
      router.push("/admin/products");
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container" style={{ padding: "80px 0", maxWidth: "600px" }}>
      <h2 className="mb-4">Add New Product</h2>

      {/* PRODUCT NAME */}
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

      {/* CATEGORY */}
      <select
        className="form-select mb-3"
        value={product.category_id}
        onChange={(e) =>
          setProduct({ ...product, category_id: e.target.value })
        }
      >
        <option value="">Select Category</option>
        {categories.map((c) => (
          <option key={c.category_id} value={c.category_id}>
            {c.category_name}
          </option>
        ))}
      </select>

      {/* SALE TOGGLE */}
      <div className="form-check mb-2">
        <input
          className="form-check-input"
          type="checkbox"
          checked={product.is_on_sale === 1}
          onChange={(e) =>
            setProduct({
              ...product,
              is_on_sale: e.target.checked ? 1 : 0,
              discount: e.target.checked ? product.discount : "",
            })
          }
        />
        <label className="form-check-label">
          Put this product on Sale
        </label>
      </div>

      {/* DISCOUNT */}
      {product.is_on_sale === 1 && (
        <input
          type="number"
          className="form-control mb-3"
          placeholder="Discount % (e.g. 20)"
          value={product.discount}
          onChange={(e) =>
            setProduct({ ...product, discount: e.target.value })
          }
        />
      )}

      {/* ACTIVE STATUS */}
      <select
        className="form-select mb-3"
        value={product.is_active}
        onChange={(e) =>
          setProduct({ ...product, is_active: Number(e.target.value) })
        }
      >
        <option value={1}>ACTIVE</option>
        <option value={0}>INACTIVE</option>
      </select>

      {/* IMAGES */}
      <input
        type="file"
        className="form-control mb-4"
        multiple
        accept="image/*"
        onChange={handleImageChange}
      />

      {/* SAVE BUTTON */}
      <button
        className="btn btn-success w-100"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Product"}
      </button>
    </div>
  );
}
