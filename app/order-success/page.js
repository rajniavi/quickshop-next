"use client";

import Navbar from "../components/Navbar";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  return (
    <>
      <Navbar />

      <div
        className="container text-center"
        style={{ padding: "120px 0", maxWidth: "600px" }}
      >
        <h1 className="text-success mb-3">✅ Order Placed!</h1>

        <p className="mb-4">
          Thank you for shopping with <strong>QuickShop</strong>.
          <br />
          Your order has been placed successfully.
        </p>

        {/* ✅ ORDER ID (SAFE + OPTIONAL) */}
        {orderId && (
          <p className="mb-3">
            🧾 <strong>Order ID:</strong> #{orderId}
          </p>
        )}

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "30px",
          }}
        >
          <p className="mb-1">
            📦 Estimated Delivery: <strong>3–5 Business Days</strong>
          </p>
          <p className="mb-0">
            💳 Payment Method: <strong>Cash on Delivery</strong>
          </p>
        </div>

        <Link href="/">
          <button className="btn btn-danger">
            Continue Shopping
          </button>
        </Link>
      </div>
    </>
  );
}
