"use client";


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      });
  }, []);

  /* ---------- ACTIVATE / DEACTIVATE ---------- */
  const toggleStatus = async (id, current) => {
    await fetch(`/api/admin/products/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        is_active: current === 1 ? 0 : 1,
      }),
    });

    setProducts((prev) =>
      prev.map((p) =>
        p.product_id === id
          ? { ...p, is_active: current === 1 ? 0 : 1 }
          : p
      )
    );
  };

  /* ---------- DELETE PRODUCT ---------- */
  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;

    const res = await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      setProducts((prev) =>
        prev.filter((p) => p.product_id !== id)
      );
    } else {
      alert("Delete failed");
    }
  };

  return (
    <>
  

      <div className="container" style={{ padding: "80px 0" }}>
        <h2>Admin – Products</h2>

        {/* ADD PRODUCT */}
        <button
          className="btn btn-success mb-3"
          onClick={() => router.push("/admin/products/create")}
        >
          + Add Product
        </button>

        {loading && <p>Loading...</p>}

        {!loading && (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p.product_id}>
                  <td>{p.product_id}</td>

                  {/* ✅ THUMBNAIL */}
                  <td>
                    {p.thumbnail_url ? (
                      <img
                        src={p.thumbnail_url}
                        alt={p.product_name}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "6px",
                        }}
                      />
                    ) : (
                      <span style={{ color: "#999" }}>No Image</span>
                    )}
                  </td>

                  <td>{p.product_name}</td>
                  <td>{p.category_name || "-"}</td>
                  <td>{p.price}</td>
                  <td>{p.stock}</td>

                  <td>
                    {p.is_active === 1 ? (
                      <span className="badge bg-success">ACTIVE</span>
                    ) : (
                      <span className="badge bg-danger">INACTIVE</span>
                    )}
                  </td>

                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() =>
                        router.push(`/admin/products/${p.product_id}`)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className={`btn btn-sm me-2 ${
                        p.is_active === 1
                          ? "btn-warning"
                          : "btn-success"
                      }`}
                      onClick={() =>
                        toggleStatus(p.product_id, p.is_active)
                      }
                    >
                      {p.is_active === 1
                        ? "Deactivate"
                        : "Activate"}
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteProduct(p.product_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
