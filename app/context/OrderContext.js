// "use client";

// import { createContext, useContext, useEffect, useState } from "react";

// const OrderContext = createContext(null);

// export function OrderProvider({ children }) {
//   const [orders, setOrders] = useState([]);

//   // Load orders
//   useEffect(() => {
//     const saved = localStorage.getItem("orders");
//     if (saved) setOrders(JSON.parse(saved));
//   }, []);

//   // Save orders
//   useEffect(() => {
//     localStorage.setItem("orders", JSON.stringify(orders));
//   }, [orders]);

//   const addOrder = (order) => {
//     setOrders((prev) => [...prev, order]);
//   };

//   return (
//     <OrderContext.Provider value={{ orders, addOrder }}>
//       {children}
//     </OrderContext.Provider>
//   );
// }

// export function useOrders() {
//   const ctx = useContext(OrderContext);
//   if (!ctx) throw new Error("useOrders must be used inside OrderProvider");
//   return ctx;
// }
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  /* Load orders for logged-in user */
  useEffect(() => {
    if (!user) {
      setOrders([]);
      return;
    }

    const key = `orders_user_${user.id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setOrders(JSON.parse(saved));
    } else {
      setOrders([]);
    }
  }, [user]);

  /* Save orders per user */
  useEffect(() => {
    if (!user) return;

    const key = `orders_user_${user.id}`;
    localStorage.setItem(key, JSON.stringify(orders));
  }, [orders, user]);

  const addOrder = (order) => {
    setOrders((prev) => [
      ...prev,
      {
        ...order,
        id: order.id || Date.now(),   // safe unique id
        status: order.status || "Placed",
        date: order.date || new Date().toLocaleDateString(),
      },
    ]);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used inside OrderProvider");
  return ctx;
}