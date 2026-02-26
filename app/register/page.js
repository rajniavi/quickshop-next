"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";

export default function Register() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    mobile: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registration successful. Please login.");
      window.location.href = "/login";
    } else {
      alert(data.message);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container" style={{ padding: "80px 0", maxWidth: "500px" }}>
        <h2 className="mb-4">Create Account</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="full_name"
            placeholder="Full Name"
            className="form-control mb-3"
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            className="form-control mb-3"
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="form-control mb-3"
            onChange={handleChange}
            required
          />

          <input
            name="mobile"
            placeholder="Mobile (optional)"
            className="form-control mb-3"
            onChange={handleChange}
          />

          <button className="btn btn-danger w-100">
            Register
          </button>
        </form>
      </div>
    </>
  );
}
