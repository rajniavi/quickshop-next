"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">

          {/* ABOUT */}
          <div className="col-md-4 mb-4">
            <h5 className="footer-title">QuickShop</h5>
            <p className="footer-text">
              Your one-stop online shopping destination for mobiles, fashion,
              electronics & more. Quality products at the best prices.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div className="col-md-2 mb-4">
            <h5 className="footer-title">Quick Links</h5>
            <ul className="footer-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/product">Products</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* CATEGORIES */}
          <div className="col-md-3 mb-4">
            <h5 className="footer-title">Categories</h5>
            <ul className="footer-links">
              <li><Link href="/category/1">Electronics</Link></li>
              <li><Link href="/category/2">Kids</Link></li>
              <li><Link href="/category/7">Women</Link></li>
              <li><Link href="/category/8">Men</Link></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div className="col-md-3 mb-4">
            <h5 className="footer-title">Contact Us</h5>
            <p className="footer-text">📍 India</p>
            <p className="footer-text">📧 support@quickshop.com</p>
            <p className="footer-text">📞 +91 99933 388240</p>

            {/* SOCIAL ICONS */}
            <div className="footer-social">
              <a href="https://facebook.com" target="_blank"><FaFacebookF /></a>
              <a href="https://instagram.com" target="_blank"><FaInstagram /></a>
              <a href="https://twitter.com" target="_blank"><FaTwitter /></a>
              <a href="https://youtube.com" target="_blank"><FaYoutube /></a>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} QuickShop — All Rights Reserved
        </div>
      </div>
    </footer>
  );
}