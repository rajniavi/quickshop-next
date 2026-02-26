"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function HomeCardSlider() {
  const cards = [
    { title: "Men Fashion", text: "Latest trends for men" },
    { title: "Women Wear", text: "Stylish women collection" },
    { title: "Kids Wear", text: "Comfortable kids clothing" },
    { title: "Accessories", text: "Modern fashion accessories" },
    { title: "Footwear", text: "Premium quality shoes" },
    { title: "Winter Wear", text: "Stay warm & stylish" },
    { title: "Summer Wear", text: "Cool & breathable outfits" },
    { title: "Premium Picks", text: "Top rated products" },
  ];

  return (
    <section className="layout_padding">
      <div className="container">
        <div className="heading_container heading_center mb-4">
          <h2>Shop by Category</h2>
        </div>

        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={20}
          slidesPerView={3}
          navigation
          autoplay={{ delay: 2500 }}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {cards.map((card, i) => (
            <SwiperSlide key={i}>
              <div className="home-card">
                <h5>{card.title}</h5>
                <p>{card.text}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
