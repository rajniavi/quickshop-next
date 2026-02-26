// "use client";

// import Navbar from "../components/Navbar";
// import { useOrders } from "../context/OrderContext";

// export default function OrdersPage() {
//   const { orders } = useOrders();

//   return (
//     <>
//       <Navbar />

//       <div className="container mt-5">
//         <h2>My Orders</h2>

//         {orders.length === 0 ? (
//           <p>No orders yet.</p>
//         ) : (
//           orders.map((order) => (
//             <div
//               key={order.id}
//               className="border p-3 mb-3"
//             >
//               <p><strong>Order ID:</strong> {order.id}</p>
//               <p><strong>Date:</strong> {order.date}</p>
//               <p><strong>Total:</strong> ₹{order.total}</p>

//               <ul>
//                 {order.items.map((item) => (
//                   <li key={item.id}>
//                     {item.title} × {item.qty}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))
//         )}
//       </div>
//     </>
//   );
// }
"use client";

import Navbar from "../components/Navbar";
import { useOrders } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const { orders } = useOrders();
  const { user } = useAuth();
  const router = useRouter();

  /* 🔐 Protect page */
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <>
      

      <div className="container mt-5">
        <h2 className="mb-4">My Orders</h2>

        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="border p-3 mb-4 rounded"
            >
              <div className="d-flex justify-content-between">
                <p><strong>Order ID:</strong> #{order.id}</p>
                <span className="badge bg-primary">
                  {order.status || "Placed"}
                </span>
              </div>

              <p>
                <strong>Date:</strong>{" "}
                {order.date || order.created_at}
              </p>

              <p>
                <strong>Total:</strong> ₹
                {order.total || order.total_amount}
              </p>

              <ul className="mb-0">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.title} × {item.qty}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </>
  );
}