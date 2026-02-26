// import "./globals.css";
// import { CartProvider } from "./context/CartContext";
// import { AuthProvider } from "./context/AuthContext";
// import Chatbot from "./components/Chatbot";
// import Navbar from "./components/Navbar";
// import Script from "next/script";

// export const metadata = {
//   title: "QuickShop",
//   description: "Ecommerce Website",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <head>
//         {/* Bootstrap CSS */}
//         <link rel="stylesheet" href="/css/bootstrap.css" />
//         <link rel="stylesheet" href="/css/font-awesome.min.css" />
//         <link rel="stylesheet" href="/css/style.css" />
//         <link rel="stylesheet" href="/css/responsive.css" />
//       </head>

//       <body>
//         <AuthProvider>
//           <CartProvider>
//             <Navbar />
//             {children}
//             <Chatbot />
//           </CartProvider>
//         </AuthProvider>

//         {/* ✅ REQUIRED JS ORDER FOR BOOTSTRAP 4 */}
//         <Script
//           src="/js/jquery-3.4.1.min.js"
//           strategy="beforeInteractive"
//         />

//         <Script
//           src="/js/popper.min.js"
//           strategy="beforeInteractive"
//         />

//         <Script
//           src="/js/bootstrap.js"
//           strategy="afterInteractive"
//         />

//         {/* Optional custom JS */}
//         <Script
//           src="/js/custom.js"
//           strategy="afterInteractive"
//         />
//       </body>
//     </html>
//   );
// }
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { OrderProvider } from "./context/OrderContext";
import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";
import Script from "next/script";
import Footer from "./components/Footer";
import FloatingContact from "./components/FloatingContact";
export const metadata = {
  title: "QuickShop",
  description: "Ecommerce Website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Bootstrap CSS */}
        <link rel="stylesheet" href="/css/bootstrap.css" />
        <link rel="stylesheet" href="/css/font-awesome.min.css" />
        <link rel="stylesheet" href="/css/style.css" />
        <link rel="stylesheet" href="/css/responsive.css" />
      </head>

      <body>
        <AuthProvider>
          <OrderProvider>
            <CartProvider>
              <Navbar />
              {children}
           
              <Chatbot />
               <FloatingContact />
              <Footer />
                
            </CartProvider>
          </OrderProvider>
        </AuthProvider>

        {/* JS */}
        <Script src="/js/jquery-3.4.1.min.js" strategy="beforeInteractive" />
        <Script src="/js/popper.min.js" strategy="beforeInteractive" />
        <Script src="/js/bootstrap.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}