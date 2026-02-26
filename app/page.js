"use client";
import Script from "next/script";
import Hero from "./components/Hero";
import ProductsSection from "./components/ProductsSection";
import Chatbot from "./components/Chatbot";
import HomeCardSlider from "./components/HomeCardSlider";
import WhySlider from "./components/WhySlider";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* HERO / SLIDER */}
      <Hero />

      {/* WHY SHOP WITH US – SLIDER */}
      <WhySlider />

      {/* ARRIVAL / CTA SECTION */}
      <section className="arrival_section">
        <div className="container">
          <div className="box">
            <div className="arrival_bg_box">
              <img src="/images/arrival-bg.png" alt="arrival" />
            </div>

            <div className="row">
              <div className="col-md-6 ml-auto">
                <div className="heading_container remove_line_bt">
                  <h2>#NewArrivals</h2>
                </div>

                <p>
                  Discover the latest fashion arrivals at unbeatable prices.
                </p>

                {/* ✅ FIXED: Link instead of <a> */}
                <Link href="/product" className="btn1">
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY – SLIDER */}
      <HomeCardSlider />

      {/* PRODUCTS SECTION */}
      <ProductsSection />


    

      <Chatbot />

      {/* Bootstrap scripts */}
      <Script src="/js/jquery-3.4.1.min.js" strategy="beforeInteractive" />
      <Script src="/js/popper.min.js" strategy="beforeInteractive" />
      <Script src="/js/bootstrap.js" strategy="afterInteractive" />
    </>
  );
}
