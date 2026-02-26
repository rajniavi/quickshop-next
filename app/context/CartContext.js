"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  /* ===============================
     LOAD CART FROM localStorage
     =============================== */
  useEffect(() => {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    const parsed = JSON.parse(savedCart);

    // 🔥 MIGRATE OLD qty → quantity
    const fixedCart = parsed.map((item) => ({
      ...item,
      quantity: item.quantity ?? item.qty ?? 1,
    }));

    setCart(fixedCart);
  }
}, []);

  /* ===============================
     SAVE CART TO localStorage
     =============================== */
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  /* ===============================
     ADD TO CART
     =============================== */
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prev, { ...product, quantity }];
    });
  };

  /* ===============================
     UPDATE QUANTITY
     =============================== */
  const updateQty = (id, quantity) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  /* ===============================
     REMOVE ITEM
     =============================== */
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  /* ===============================
     CLEAR CART (AFTER ORDER)
     =============================== */
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  /* ===============================
     TOTAL AMOUNT
     =============================== */
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
}
