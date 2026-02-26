// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";

// /* 🔥 FETCH SALE PRODUCTS */
// async function getSaleProducts() {
//   const res = await fetch("/api/sale-products", {
//     cache: "no-store",
//   });
//   const data = await res.json();
//   return data.products || [];
// }

// /* ⏳ COUNTDOWN HELPER */
// function getCountdown(endDate) {
//   const now = new Date();
//   const end = new Date(endDate);
//   const diff = end - now;

//   if (diff <= 0) return "Sale ended";

//   const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//   const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
//   const minutes = Math.floor((diff / (1000 * 60)) % 60);

//   return `${days}d ${hours}h ${minutes}m left`;
// }

// export default function SalePage() {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     getSaleProducts().then(setProducts);
//   }, []);

//   return (
//     <section className="layout_padding">
//       <div className="container">

//         {/* HEADING */}
//         <div className="text-center mb-5">
//           <h2 style={{ fontWeight: 700 }}>🔥 Sale Products</h2>
//           <p>Limited time offers you don’t want to miss</p>
//         </div>

//         <div className="row">
//           {products.map((p) => {
//             const discountedPrice = Math.round(
//               p.price - (p.price * p.discount) / 100
//             );

//             return (
//               <div key={p.product_id} className="col-md-4 mb-4">
//                 <div className="card h-100 shadow-sm">

//                   <img
//                     src={p.image_url || "/images/no-image.png"}
//                     className="card-img-top"
//                     style={{ height: 220, objectFit: "cover" }}
//                   />

//                   <div className="card-body text-center">
//                     <h5>{p.product_name}</h5>

//                     <p className="mb-1">
//                       <del className="text-muted">₹{p.price}</del>{" "}
//                       <span className="fw-bold text-danger">
//                         ₹{discountedPrice}
//                       </span>
//                     </p>

//                     <div className="fw-bold text-danger mb-2">
//                       {p.discount}% OFF
//                     </div>

//                     {/* 📅 DATES */}
//                     <div className="small text-muted mb-2">
//                       📅 {new Date(p.sale_start_date).toLocaleDateString()} →{" "}
//                       {new Date(p.sale_end_date).toLocaleDateString()}
//                     </div>

//                     {/* ⏳ COUNTDOWN */}
//                     <div className="fw-bold text-warning mb-3">
//                       ⏳ {getCountdown(p.sale_end_date)}
//                     </div>

//                     <Link
//                       href={`/product/${p.product_id}`}
//                       className="btn btn-outline-danger btn-sm"
//                     >
//                       View Product
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}

//           {products.length === 0 && (
//             <p className="text-center">
//               No active sale products right now.
//             </p>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* 🔥 FETCH SALE PRODUCTS */
async function getSaleProducts() {
  const res = await fetch("/api/sale-products", {
    cache: "no-store",
  });
  const data = await res.json();
  return data.products || [];
}

/* ⏳ COUNTDOWN HELPER */
function getCountdown(endDate) {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end - now;

  if (diff <= 0) return "Sale ended";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  return `${days}d ${hours}h ${minutes}m left`;
}

export default function SalePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getSaleProducts().then(setProducts);
  }, []);

  return (
    <section className="layout_padding">
      <div className="container">

        {/* 🔥 HEADING */}
        <div className="text-center mb-5">
          <h2 style={{ fontWeight: 700 }}>🔥 Sale Products</h2>
          <p>Limited time offers you don’t want to miss</p>
        </div>

        <div className="row">
          {products.map((p) => {
            const discountedPrice = Math.round(
              p.price - (p.price * p.discount) / 100
            );

            return (
              <div key={p.product_id} className="col-md-4 mb-4">
                <div className="card h-100 shadow-sm">

                  {/* ✅ FIXED IMAGE */}
                  <img
                    src={
                      p.image_url
                        ? `/uploads/products/${p.category_id}/${p.image_url}`
                        : "/images/p1.png"
                    }
                    alt={p.product_name}
                    className="card-img-top"
                    style={{
                      height: 220,
                      objectFit: "contain",
                      background: "#f7f7f7",
                    }}
                  />

                  <div className="card-body text-center">
                    <h5>{p.product_name}</h5>

                    <p className="mb-1">
                      <del className="text-muted">₹{p.price}</del>{" "}
                      <span className="fw-bold text-danger">
                        ₹{discountedPrice}
                      </span>
                    </p>

                    <div className="fw-bold text-danger mb-2">
                      {p.discount}% OFF
                    </div>

                    {/* 📅 SALE DATES */}
                    <div className="small text-muted mb-2">
                      📅{" "}
                      {new Date(p.sale_start_date).toLocaleDateString()} →{" "}
                      {new Date(p.sale_end_date).toLocaleDateString()}
                    </div>

                    {/* ⏳ COUNTDOWN */}
                    <div className="fw-bold text-warning mb-3">
                      ⏳ {getCountdown(p.sale_end_date)}
                    </div>

                    <Link
                      href={`/product/${p.product_id}`}
                      className="btn btn-outline-danger btn-sm"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {products.length === 0 && (
            <p className="text-center">
              No active sale products right now.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
