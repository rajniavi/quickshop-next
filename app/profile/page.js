"use client";

import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // 🔐 Protect profile page
  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/profile");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="container mt-5">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4">My Profile</h2>

      <div className="border rounded p-4 bg-light">
        <p>
          <strong>Name:</strong>{" "}
        {user.name || user.full_name || user.email}
        </p>

        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <p>
          <strong>Role:</strong>{" "}
          <span className="badge bg-secondary">
            {user.role}
          </span>
        </p>

        <button
          className="btn btn-outline-danger mt-3"
          onClick={() => {
            logout();
            router.push("/login");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}