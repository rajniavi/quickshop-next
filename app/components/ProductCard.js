// import Image from "next/image";
// import Link from "next/link";
// import SaleCountdown from "./SaleCountdown";

// export default function ProductCard({ product }) {
//   if (!product) return null;

//   const imageSrc =
//     product.thumbnail_url && product.thumbnail_url.trim() !== ""
//       ? product.thumbnail_url
//       : "/no-image.png"; // ✅ fallback

//   return (
//     <div className="col-sm-6 col-md-4 col-lg-4">
//       <div className="box">
//         <div className="img-box">
//           <Image
//             src={imageSrc}
//             alt={product.product_name || "Product image"}
//             width={300}
//             height={300}
//           />
//         </div>

//         <div className="detail-box">
//           <h5>{product.product_name}</h5>

//           {product.is_on_sale ? (
//             <>
//               <h6 style={{ textDecoration: "line-through", color: "#888" }}>
//                 ₹{product.price}
//               </h6>
//               <h6 style={{ color: "red", fontWeight: "bold" }}>
//                 ₹{product.sale_price}
//               </h6>

//               <SaleCountdown saleEnd={product.sale_end} />
//             </>
//           ) : (
//             <h6>₹{product.price}</h6>
//           )}

//           <Link
//             href={`/product/${product.product_id}`}
//             className="btn btn-sm btn-dark"
//           >
//             View Details
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
import Image from "next/image";
import Link from "next/link";
import SaleCountdown from "./SaleCountdown";

export default function ProductCard({ product }) {
  if (!product) return null;

  // ✅ NEVER reference /no-image.png
  const imageSrc = product.image || "/images/p1.png";

  return (
    <div className="col-sm-6 col-md-4 col-lg-4">
      <div className="box">
        <div className="img-box">
          <Image
            src={imageSrc}
            alt={product.name || "Product image"}
            width={300}
            height={300}
            style={{ objectFit: "contain" }}
            onError={(e) => {
              e.currentTarget.src = "/images/p1.png";
            }}
          />
        </div>

        <div className="detail-box">
          <h5>{product.name}</h5>

          {product.is_on_sale ? (
            <>
              <h6 style={{ textDecoration: "line-through", color: "#888" }}>
                ₹{product.price}
              </h6>
              <h6 style={{ color: "red", fontWeight: "bold" }}>
                ₹{product.sale_price}
              </h6>
              <SaleCountdown saleEnd={product.sale_end} />
            </>
          ) : (
            <h6>₹{product.price}</h6>
          )}

          <Link
            href={`/product/${product.id}`}
            className="btn btn-sm btn-dark"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
