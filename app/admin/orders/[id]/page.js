"use client";

import Navbar from "../../../components/Navbar";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminOrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data.order);
        setItems(data.items || []);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <p className="container mt-5">Loading order...</p>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <p className="container mt-5">Order not found</p>
      </>
    );
  }

  const updateStatus = async (newStatus) => {
    setUpdating(true);

    await fetch(`/api/admin/orders/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    setOrder({ ...order, status: newStatus });
    setUpdating(false);
  };

  return (
    <>
     

      <div className="container" style={{ padding: "80px 0" }}>
        <h2>Order #{order.order_id}</h2>

        <p>
          <strong>Status:</strong>{" "}
          <span className="badge bg-secondary">
            {order.status}
          </span>
        </p>

        {/* ✅ STATUS DROPDOWN */}
        <div className="mt-3" style={{ maxWidth: "250px" }}>
          <label className="form-label">
            <strong>Update Status</strong>
          </label>
          <select
            className="form-select"
            value={order.status}
            disabled={updating}
            onChange={(e) => updateStatus(e.target.value)}
          >
            <option value="PLACED">PLACED</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
              <option value="RETURNED">RETURNED</option>
          </select>
        </div>

        <p className="mt-3">
          <strong>Total Amount:</strong> ₹{order.total_amount}
        </p>

        <p>
          <strong>Order Date:</strong>{" "}
          {new Date(order.order_date).toLocaleString()}
        </p>

        <h4 className="mt-4">Order Items</h4>

        <table className="table table-bordered mt-2">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.order_item_id}>
                <td>{item.product_id}</td>
                <td>{item.quantity}</td>
                <td>₹{item.price}</td>
                <td>₹{item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
