// "use client";

// import Navbar from "../components/Navbar";
// import { useCart } from "../context/CartContext";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export default function CheckoutPage() {
//   const { cart, totalAmount, clearCart } = useCart();
//   const router = useRouter();

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     address: "",
//     phone: "",
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleOrder = async () => {
//     if (cart.length === 0) {
//       alert("Your cart is empty");
//       return;
//     }

//     try {
//       const res = await fetch("/api/place-order", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           customer: form,
//           cart,
//           totalAmount,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data.message || "Order failed");
//         return;
//       }

//       clearCart(); // ✅ clear cart AFTER successful order
//       router.push(`/order-success?id=${data.orderId}`);
//     } catch (error) {
//       console.error(error);
//       alert("Something went wrong");
//     }
//   };

//   return (
//     <>
//       <Navbar />

//       <div
//         className="container"
//         style={{ padding: "80px 0", maxWidth: "600px" }}
//       >
//         <h2 className="mb-4">Checkout</h2>

//         <input
//           className="form-control mb-3"
//           placeholder="Name"
//           name="name"
//           value={form.name}
//           onChange={handleChange}
//         />

//         <input
//           className="form-control mb-3"
//           placeholder="Email"
//           name="email"
//           value={form.email}
//           onChange={handleChange}
//         />

//         <input
//           className="form-control mb-3"
//           placeholder="Address"
//           name="address"
//           value={form.address}
//           onChange={handleChange}
//         />

//         <input
//           className="form-control mb-3"
//           placeholder="Phone"
//           name="phone"
//           value={form.phone}
//           onChange={handleChange}
//         />

//         <h4 className="mt-4">
//           Total: <span className="text-danger">₹{totalAmount}</span>
//         </h4>

//         <button
//           className="btn btn-danger w-100 mt-3"
//           onClick={handleOrder}
//           disabled={cart.length === 0}
//         >
//           Place Order
//         </button>
//       </div>
//     </>
//   );
// }
"use client";

import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const { cart, totalAmount, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ MOCK PAYMENT + PLACE ORDER
  const handleOrder = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    if (!form.name || !form.email || !form.address || !form.phone) {
      alert("Please fill all details");
      return;
    }

    // 🔔 Mock payment confirmation
    const confirmPayment = window.confirm(
      `Pay ₹${totalAmount} to QuickShop?\n\n(Mock Payment – No real money)`
    );

    if (!confirmPayment) {
      alert("Payment cancelled");
      return;
    }

    setLoading(true);

    // ⏳ Fake payment delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const res = await fetch("/api/place-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          cart,
          totalAmount,
          paymentMode: "MOCK",
          paymentStatus: "PAID",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Order failed");
        setLoading(false);
        return;
      }

      clearCart();
      router.push(`/order-success?id=${data.orderId}`);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div
        className="container"
        style={{ padding: "80px 0", maxWidth: "600px" }}
      >
        <h2 className="mb-4">Checkout</h2>

        <input
          className="form-control mb-3"
          placeholder="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          placeholder="Address"
          name="address"
          value={form.address}
          onChange={handleChange}
        />

        <input
          className="form-control mb-3"
          placeholder="Phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />

        <h4 className="mt-4">
          Total: <span className="text-danger">₹{totalAmount}</span>
        </h4>

        <button
          className="btn btn-danger w-100 mt-3"
          onClick={handleOrder}
          disabled={cart.length === 0 || loading}
        >
          {loading ? "Processing Payment..." : `Pay ₹${totalAmount}`}
        </button>

        <p className="text-muted mt-3" style={{ fontSize: "14px" }}>
          🔒 This is a demo payment. No real money will be deducted.
        </p>
      </div>
    </>
  );
}