"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminOrdersChart from "../components/AdminOrdersChart";

export default function AdminDashboard() {
  const [insights, setInsights] = useState([]);

  const [chartLabels, setChartLabels] = useState([]);
  const [chartValues, setChartValues] = useState([]);
  const [chartType, setChartType] = useState("weekly");

  // Fetch insights
  useEffect(() => {
    fetch("/api/admin/insight")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setInsights(data.insight || []);
        }
      });
  }, []);

  // Fetch chart data
  useEffect(() => {
    fetch(`/api/admin/orders-chart?type=${chartType}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setChartLabels(data.data.map((d) => d.label));
          setChartValues(data.data.map((d) => d.value));
        }
      });
  }, [chartType]);

  const exportCSV = () => {
    const csv = chartLabels
      .map((label, i) => `${label},${chartValues[i]}`)
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "admin-chart.csv";
    a.click();
  };

  return (
    <div className="container" style={{ padding: "80px 0", maxWidth: "1000px" }}>
      <h2 className="mb-4">Admin Dashboard</h2>

      <h4 className="mb-3">📊 Weekly Business Insights</h4>

      <div className="row g-3 mb-5">
        {insights.map((text, index) => (
          <div className="col-md-4" key={index}>
            <div className="card p-3 h-100">
              <p className="mb-0">{text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Controls */}
      <div className="d-flex gap-2 mb-3 flex-wrap">
        <button className="btn btn-outline-primary btn-sm" onClick={() => setChartType("weekly")}>📅 Weekly</button>
        <button className="btn btn-outline-success btn-sm" onClick={() => setChartType("revenue")}>💰 Revenue</button>
        <button className="btn btn-outline-warning btn-sm" onClick={() => setChartType("status")}>📦 Status</button>
        <button className="btn btn-outline-info btn-sm" onClick={() => setChartType("monthly")}>🗓️ Monthly</button>
        <button className="btn btn-outline-dark btn-sm" onClick={exportCSV}>⬇️ Export</button>
      </div>

      <div className="card p-3 mb-5">
        <AdminOrdersChart labels={chartLabels} values={chartValues} />
      </div>

      {/* 🔧 Admin Actions */}
      <div className="row g-3">
        <div className="col-md-4">
          <div className="card p-3">
            <h5>📦 Orders</h5>
            <p>View all customer orders</p>
            <Link href="/admin/orders" className="btn btn-dark btn-sm">
              View Orders
            </Link>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3">
            <h5>🛒 Products</h5>
            <p>Manage products</p>
            <Link href="/admin/products" className="btn btn-dark btn-sm">
              Manage Products
            </Link>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3">
            <h5>👥 Users</h5>
            <p>View registered users</p>
            <Link href="/admin/users" className="btn btn-dark btn-sm">
              View Users
            </Link>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3">
            <h5>📝 Blogs</h5>
            <p>Approve / Reject blogs</p>
            <Link href="/admin/blogs" className="btn btn-dark btn-sm">
              Review Blogs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}