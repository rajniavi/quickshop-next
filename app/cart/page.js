"use client";

import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { cart, updateQty, removeFromCart } = useCart();

  // ✅ TOTAL CALCULATION (FIXED)
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>


      <div className="container mt-5">
        <div className="row">
          {/* LEFT SIDE – CART ITEMS */}
          <div className="col-md-8">
            <h3>Shopping Cart</h3>
            <hr />

            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="row mb-4">
                  {/* IMAGE */}
                  <div className="col-md-3">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={120}
                      height={120}
                    />
                  </div>

                  {/* DETAILS */}
                  <div className="col-md-6">
                    <h6>{item.title}</h6>
                    <p className="text-success mb-1">In Stock</p>

                    <div className="d-flex align-items-center gap-3">
                      {/* QUANTITY */}
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          updateQty(
                            item.id,
                            Number(e.target.value)
                          )
                        }
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            Qty: {n}
                          </option>
                        ))}
                      </select>

                      {/* DELETE */}
                      <button
                        className="btn btn-link text-danger p-0"
                        onClick={() =>
                          removeFromCart(item.id)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* PRICE */}
                  <div className="col-md-3 text-end">
                    <strong>
                      ₹{item.price * item.quantity}
                    </strong>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* RIGHT SIDE – SUMMARY */}
          <div className="col-md-4">
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "20px",
              }}
            >
              <h5>
                Subtotal ({cart.length} items):
              </h5>

              <h4 className="text-danger">
                ₹{totalAmount}
              </h4>

              <Link href="/checkout">
                <button
                  className="btn btn-danger w-100 mt-3"
                  disabled={cart.length === 0}
                >
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
