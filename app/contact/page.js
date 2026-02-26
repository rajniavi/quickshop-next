"use client";

import Navbar from "../components/Navbar";
import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.mobile || !form.message) {
      alert("Please fill required fields");
      return;
    }

    setLoading(true);
    setSuccess("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess("✅ Message sent successfully!");
        setForm({
          name: "",
          email: "",
          mobile: "",
          subject: "",
          message: "",
        });
      } else {
        alert(data.message || "Failed to send");
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      

      <section className="layout_padding">
        <div className="container">

          {/* 🔹 HEADER */}
          <div style={{ marginBottom: "30px" }}>
            <h2>Contact Us</h2>
            <p style={{ color: "#555" }}>
              How can we help you today?
            </p>
          </div>

          {/* 🔹 FAQ SECTION (AMAZON STYLE) */}
          <div className="mb-5">
            <h4>Frequently Asked Questions</h4>

            <details className="mb-2">
              <summary>How long does delivery take?</summary>
              <p className="mt-2 text-muted">
                Delivery usually takes 3–5 business days.
              </p>
            </details>

            <details className="mb-2">
              <summary>How can I track my order?</summary>
              <p className="mt-2 text-muted">
                You can track your order from the “My Orders” section.
              </p>
            </details>

            <details className="mb-2">
              <summary>How do I return a product?</summary>
              <p className="mt-2 text-muted">
                Returns can be initiated from your order details page.
              </p>
            </details>
          </div>

          {/* 🔹 CONTACT OPTIONS */}
          <div className="row text-center mb-4">
            <div className="col-md-4 mb-3">
              <div className="border p-3 rounded">
                <h5>📞 Call Us</h5>
                <p>+91 90000 00000</p>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="border p-3 rounded">
                <h5>✉️ Email Us</h5>
                <p>support@quickshop.com</p>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="border p-3 rounded">
                <h5>💬 Message</h5>
                <p>We reply within 24 hours</p>
              </div>
            </div>
          </div>

          {/* 🔹 FORM + MAP */}
          <div className="row">
            <div className="col-md-6 mb-4">
              <h4>Send us a message</h4>

              <form onSubmit={handleSubmit}>
                <input
                  name="name"
                  placeholder="Your Name *"
                  value={form.name}
                  onChange={handleChange}
                  className="form-control mb-3"
                  required
                />

                <input
                  name="email"
                  type="email"
                  placeholder="Your Email *"
                  value={form.email}
                  onChange={handleChange}
                  className="form-control mb-3"
                  required
                />

                <input
                  name="mobile"
                  type="tel"
                  placeholder="Your Mobile Number *"
                  value={form.mobile}
                  onChange={handleChange}
                  className="form-control mb-3"
                  pattern="[0-9]{10}"
                  required
                />

                <input
                  name="subject"
                  placeholder="Subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="form-control mb-3"
                />

                <textarea
                  name="message"
                  placeholder="Your Message *"
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  className="form-control mb-3"
                  required
                />

                <button
                  type="submit"
                  className="btn btn-warning"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>

              {success && (
                <p style={{ color: "green", marginTop: "15px" }}>
                  {success}
                </p>
              )}
            </div>

            <div className="col-md-6">
              <h4>Our Office</h4>
              <p style={{ color: "#555" }}>
                HIG-8, Saraswati Nagar,<br />
                Jawahar Chowk,<br />
                Bhopal – 462003
              </p>

              <iframe
                src="https://www.google.com/maps?q=HIG-8%20Saraswati%20Nagar%20Jawahar%20Chowk%20Bhopal%20462003&output=embed"
                width="100%"
                height="300"
                style={{ border: 0, borderRadius: "10px" }}
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* 🔹 FLOATING WHATSAPP BUTTON */}
      <a
        href="https://wa.me/919000000000"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#25D366",
          color: "#fff",
          padding: "12px 16px",
          borderRadius: "50%",
          fontSize: "20px",
          zIndex: 999,
          textDecoration: "none",
        }}
      >
        💬
      </a>
    </>
  );
}
