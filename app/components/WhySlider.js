"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function WhySlider() {
  const items = [
    { title: "Fast Delivery", text: "Quick and safe delivery worldwide" },
    { title: "Free Shipping", text: "No extra charges on orders" },
    { title: "Best Quality", text: "Premium products guaranteed" },
    { title: "Secure Payment", text: "100% secure transactions" },
    { title: "Easy Returns", text: "Hassle-free returns policy" },
    { title: "24/7 Support", text: "We’re here to help anytime" },
    { title: "Best Deals", text: "Unbeatable prices & offers" },
    { title: "Trusted Brand", text: "Loved by thousands of customers" },
  ];

  return (
    <section className="why-slider-section">
      <div className="container">
        <div className="heading_container heading_center mb-5">
          <h2>Why Shop With Us</h2>
        </div>

        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={25}
          navigation
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1200: { slidesPerView: 4 },
          }}
        >
          {items.map((item, i) => (
            <SwiperSlide key={i}>
              <div className="why-card hover-lift">
                <h5>{item.title}</h5>
                <p>{item.text}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
