// // "use client";

// // import { useState } from "react";
// // import { useAuth } from "../context/AuthContext";
// // import { useRouter } from "next/navigation";
// // import Navbar from "../components/Navbar";
// // import Link from "next/link";

// // export default function LoginPage() {
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");

// //   const { login } = useAuth();
// //   const router = useRouter();

// //   const handleLogin = async (e) => {
// //     e.preventDefault(); // ✅ FIX

// //     setError("");
// //     setLoading(true);

// //     if (!email || !password) {
// //       setError("Enter email and password");
// //       setLoading(false);
// //       return;
// //     }

// //     const res = await fetch("/api/auth/login", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({
// //         email: email.toLowerCase().trim(),
// //         password,
// //       }),
// //     });

// //     const data = await res.json();

// //     if (!res.ok) {
// //       setError(data.message);
// //       setLoading(false);
// //       return;
// //     }

// //     login(data.user);

// //     if (data.user.role === "ADMIN") {
// //       router.push("/admin");
// //     } else {
// //       router.push("/");
// //     }
// //   };

// //   return (
// //     <>
    

// //       <div className="container" style={{ padding: "80px 0", maxWidth: "400px" }}>
// //         <h3 className="mb-4 text-center">Login</h3>

// //         <form onSubmit={handleLogin}>
// //           <input
// //             type="email"
// //             className="form-control mb-3"
// //             placeholder="Email"
// //             value={email}
// //             onChange={(e) => setEmail(e.target.value)}
// //           />

// //           <input
// //             type="password"
// //             className="form-control mb-3"
// //             placeholder="Password"
// //             value={password}
// //             onChange={(e) => setPassword(e.target.value)}
// //           />

// //           {error && (
// //             <div className="alert alert-danger py-2">{error}</div>
// //           )}

// //           <button
// //             type="submit"
// //             className="btn btn-danger w-100 mb-3"
// //             disabled={loading}
// //           >
// //             {loading ? "Logging in..." : "Login"}
// //           </button>
// //         </form>

// //         <p className="text-center">
// //           New user?{" "}
// //           <Link href="/register" className="text-danger fw-bold">
// //             Create an account
// //           </Link>
// //         </p>
// //       </div>
// //     </>
// //   );
// // }
// "use client";

// import { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const { login } = useAuth();
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // where to go after login (default = home)
//   const redirectTo = searchParams.get("redirect") || "/";

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     setError("");
//     setLoading(true);

//     if (!email || !password) {
//       setError("Enter email and password");
//       setLoading(false);
//       return;
//     }

//     const res = await fetch("/api/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         email: email.toLowerCase().trim(),
//         password,
//       }),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       setError(data.message);
//       setLoading(false);
//       return;
//     }

//     // ✅ set user in AuthContext
//     login(data.user);

//     // ✅ redirect properly
//     if (data.user.role === "ADMIN") {
//       router.push("/admin");
//     } else {
//       router.push(redirectTo);
//     }
//   };

//   return (
//     <div className="container" style={{ padding: "80px 0", maxWidth: "400px" }}>
//       <h3 className="mb-4 text-center">Login</h3>

//       <form onSubmit={handleLogin}>
//         <input
//           type="email"
//           className="form-control mb-3"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           type="password"
//           className="form-control mb-3"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         {error && (
//           <div className="alert alert-danger py-2">{error}</div>
//         )}

//         <button
//           type="submit"
//           className="btn btn-danger w-100 mb-3"
//           disabled={loading}
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>

//       <p className="text-center">
//         New user?{" "}
//         <Link href="/register" className="text-danger fw-bold">
//           Create an account
//         </Link>
//       </p>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // where to go after login (default = home)
  const redirectTo = searchParams.get("redirect") || "/";

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Enter email and password");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      setLoading(false);
      return;
    }

    login(data.user);

    if (data.user.role === "ADMIN") {
      router.push("/admin");
    } else {
      router.push(redirectTo);
    }
  };

  return (
    <div className="container" style={{ padding: "80px 0", maxWidth: "400px" }}>
      <h3 className="mb-4 text-center">Login</h3>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <div className="alert alert-danger py-2">{error}</div>
        )}

        <button
          type="submit"
          className="btn btn-danger w-100 mb-3"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-center">
        New user?{" "}
        <Link href="/register" className="text-danger fw-bold">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}