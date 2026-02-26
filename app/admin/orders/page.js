"use client";

import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      });
  }, []);

  return (
    <>
 
      <div className="container" style={{ padding: "80px 0" }}>
        <h2 className="mb-4">All Orders</h2>

        {loading && <p>Loading orders...</p>}

        {!loading && orders.length === 0 && (
          <p>No orders found.</p>
        )}

        {!loading && orders.length > 0 && (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Order Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.order_id}>
                  <td>
                    <Link
                      href={`/admin/orders/${order.order_id}`}
                      style={{ textDecoration: "underline" }}
                    >
                      #{order.order_id}
                    </Link>
                  </td>
                  <td>₹{order.total_amount}</td>
                  <td>{order.status}</td>
                  <td>
                    {new Date(order.order_date).toLocaleString()}
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
