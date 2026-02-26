import Link from "next/link";

export default function Hero() {
  return (
    <section className="slider_section">
      <div className="slider_bg_box">
        <img src="/images/slider-bg.jpg" alt="slider" />
      </div>

      <div className="container">
        <div className="row">
          <div className="col-md-7 col-lg-6">
            <div className="detail-box">
              <h1>
                <span>Sale 20% Off</span>
                <br />
                On Everything
              </h1>

              <p>
                Explicabo esse amet tempora quibusdam laudantium,
                laborum eaque magnam fugiat hic.
              </p>

              <div className="btn-box">
                {/* ✅ SALE PAGE LINK */}
                <Link href="/sale-20" className="btn1">
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
