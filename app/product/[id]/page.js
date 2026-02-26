"use client";

import Image from "next/image";

import { useCart } from "../../context/CartContext";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [activeImage, setActiveImage] = useState("/images/p1.png");
  const [qty, setQty] = useState(1); // ✅ quantity state
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH PRODUCT ---------------- */
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();

        if (data.success && data.product) {
          setProduct(data.product);

          const imgs = data.product.images || [];
          setImages(imgs);

          if (imgs.length > 0) {
            setActiveImage(imgs[0].image_url);
          }
        }
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <>
      
        <h2 style={{ textAlign: "center", marginTop: "80px" }}>
          Loading product...
        </h2>
      </>
    );
  }

  if (!product) {
    return (
      <>
       
        <h2 style={{ textAlign: "center", marginTop: "80px" }}>
          Product not found
        </h2>
      </>
    );
  }

  const isOutOfStock = product.stock === 0;

  return (
    <>
     

      <div className="container" style={{ padding: "80px 0" }}>
        <div className="row align-items-center">

          {/* LEFT: IMAGE GALLERY */}
          <div className="col-md-6 text-center">
            <Image
              src={activeImage}
              alt={product.product_name}
              width={450}
              height={450}
              style={{ maxWidth: "100%", height: "auto" }}
            />

            {images.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "15px",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                {images.map((img) => (
                  <img
                    key={img.image_id}
                    src={img.image_url}
                    alt="thumb"
                    width={80}
                    height={80}
                    style={{
                      cursor: "pointer",
                      border:
                        activeImage === img.image_url
                          ? "2px solid red"
                          : "1px solid #ccc",
                    }}
                    onClick={() => setActiveImage(img.image_url)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: DETAILS */}
          <div className="col-md-6">
            <h2>{product.product_name}</h2>
            <h4 className="text-danger mt-3">₹{product.price}</h4>

            <p className="mt-3">
              Stock Available:{" "}
              <strong>{product.stock}</strong>
            </p>

            {isOutOfStock && (
              <p className="text-danger fw-bold">
                Out of Stock
              </p>
            )}

            {/* QUANTITY */}
            <div className="mt-4">
              <label>
                <strong>Quantity</strong>
              </label>
              <input
                type="number"
                min={1}
                max={product.stock}
                value={qty}
                disabled={isOutOfStock}
                className="form-control"
                style={{ width: "120px" }}
                onChange={(e) => {
                  let value = Number(e.target.value);

                  if (value < 1) value = 1;
                  if (value > product.stock) value = product.stock;

                  setQty(value);
                }}
              />
            </div>

            {/* ADD TO CART */}
            <div className="mt-4">
              <button
                className="btn btn-danger"
                disabled={isOutOfStock}
                onClick={() => {
                  if (qty > product.stock) {
                    alert("Quantity exceeds available stock");
                    return;
                  }

                  addToCart(
                    {
                      id: product.product_id,
                      title: product.product_name,
                      price: Number(product.price),
                      image: activeImage,
                    },
                    qty
                  );

                  router.push("/cart");
                }}
              >
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
