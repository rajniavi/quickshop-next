import Navbar from "../components/Navbar";

export default function About() {
  return (
    <>
      <Navbar />

      <section className="layout_padding">
        <div className="container">
          <h2>About Us</h2>
          <p>
            Welcome to QuickShop. We provide high-quality fashion products
            at affordable prices.
          </p>
        </div>
      </section>
    </>
  );
}
