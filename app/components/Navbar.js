
// "use client";

// import Link from "next/link";
// import { useAuth } from "../context/AuthContext";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// /* build category tree */
// function buildCategoryTree(categories) {
//   const map = {};
//   const tree = [];

//   categories.forEach(cat => {
//     map[cat.category_id] = { ...cat, children: [] };
//   });

//   categories.forEach(cat => {
//     if (cat.parent_id === null) {
//       tree.push(map[cat.category_id]);
//     } else if (map[cat.parent_id]) {
//       map[cat.parent_id].children.push(map[cat.category_id]);
//     }
//   });

//   return tree;
// }

// export default function Navbar() {
//   const { user, logout } = useAuth();
//   const router = useRouter();
//   const [categories, setCategories] = useState([]);

//   const handleLogout = () => {
//     logout();
//     router.push("/login");
//   };

//   useEffect(() => {
//     fetch("/api/categories")
//       .then(res => res.json())
//       .then(data => {
//         if (data.success) {
//           setCategories(buildCategoryTree(data.categories));
//         }
//       })
//       .catch(err => console.error(err));
//   }, []);

//   return (
//     <header className="header_section">
//       <div className="container">
//         <nav className="navbar navbar-expand-lg custom_nav-container">

//           {/* LOGO */}
//           <Link className="navbar-brand" href="/">
//             <img src="/images/logo.png" alt="logo" style={{ height: 48 }} />
//           </Link>

//           <ul className="navbar-nav ms-auto">

//             <li className="nav-item">
//               <Link className="nav-link nav-anim" href="/">Home</Link>
//             </li>

//             {/* PRODUCTS */}
//             <li className="nav-item dropdown-hover">
//               <span className="nav-link nav-anim">Products</span>

//               <ul className="dropdown-menu-hover">
//                 <li>
//                   <Link href="/product" className="dropdown-item fw-bold">
//                     All Products
//                   </Link>
//                 </li>

//                 <li className="dropdown-divider"></li>

//                 {categories.map(cat => (
//                   <li key={cat.category_id} className="submenu-hover">
//                     <span className="dropdown-item fw-bold">
//                       {cat.category_name}
//                     </span>

//                     {cat.children.length > 0 && (
//                       <ul className="dropdown-menu-hover right">
//                         {cat.children.map(sub => (
//                           <li key={sub.category_id}>
//                             <Link
//                               href={`/category/${sub.category_id}`}
//                               className="dropdown-item"
//                             >
//                               {sub.category_name}
//                             </Link>
//                           </li>
//                         ))}
//                       </ul>
//                     )}
//                   </li>
//                 ))}
//               </ul>
//             </li>

//             <li className="nav-item">
//               <Link className="nav-link nav-anim" href="/blog">Blog</Link>
//             </li>

//             <li className="nav-item">
//               <Link className="nav-link nav-anim" href="/contact">Contact</Link>
//             </li>

//             {/* AUTH SECTION */}
//             {!user ? (
//               <li className="nav-item">
//                 <Link className="nav-link nav-anim fw-bold" href="/login">
//                   Login
//                 </Link>
//               </li>
//             ) : (
//               <li className="nav-item user-dropdown">

//                 {/* USER NAME */}
//                 <span className="nav-link nav-anim fw-bold">
//                   Hi, {user.name || user.full_name || user.email}
//                 </span>

//                 {/* USER DROPDOWN */}
//                 <ul className="user-dropdown-menu">

//                   <li>
//                     <Link href="/order" className="dropdown-item">
//                       My Orders
//                     </Link>
//                   </li>

//                   <li>
//                     <Link href="/profile" className="dropdown-item">
//                       My Profile
//                     </Link>
//                   </li>

//                   {/* ✅ ADMIN DASHBOARD LINK */}
//                   {user?.role === "ADMIN" && (
//                     <>
//                       <li className="dropdown-divider"></li>
//                       <li>
//                         <Link
//                           href="/admin"
//                           className="dropdown-item fw-bold"
//                         >
//                           Admin Dashboard
//                         </Link>
//                       </li>
//                     </>
//                   )}

//                   <li className="dropdown-divider"></li>

//                   <li>
//                     <button
//                       className="dropdown-item text-danger"
//                       onClick={handleLogout}
//                     >
//                       Logout
//                     </button>
//                   </li>

//                 </ul>
//               </li>
//             )}

//           </ul>
//         </nav>
//       </div>
//     </header>
//   );
// }
"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

/* build category tree */
function buildCategoryTree(categories) {
  const map = {};
  const tree = [];

  categories.forEach((cat) => {
    map[cat.category_id] = { ...cat, children: [] };
  });

  categories.forEach((cat) => {
    if (cat.parent_id === null) {
      tree.push(map[cat.category_id]);
    } else if (map[cat.parent_id]) {
      map[cat.parent_id].children.push(map[cat.category_id]);
    }
  });

  return tree;
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [productsOpen, setProductsOpen] = useState(false);

  const productsRef = useRef(null);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  /* fetch categories */
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCategories(buildCategoryTree(data.categories));
        }
      })
      .catch(console.error);
  }, []);

  /* close products dropdown when clicking outside */
  useEffect(() => {
    function handleClickOutside(e) {
      if (productsRef.current && !productsRef.current.contains(e.target)) {
        setProductsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header_section">
      <div className="container">
        <nav className="navbar navbar-expand-lg custom_nav-container">
          {/* LOGO */}
          <Link className="navbar-brand" href="/">
            <img src="/images/logo.png" alt="logo" style={{ height: 48 }} />
          </Link>

          <ul className="navbar-nav ms-auto">
            {/* HOME */}
            <li className="nav-item">
              <Link className="nav-link nav-anim" href="/">
                Home
              </Link>
            </li>

            {/* PRODUCTS – STABLE CLICK DROPDOWN */}
            <li
              className="nav-item dropdown-hover"
              ref={productsRef}
            >
              <button
                type="button"
                className="nav-link nav-anim"
                style={{ background: "none", border: "none" }}
                onClick={() => setProductsOpen((prev) => !prev)}
              >
                Products ▾
              </button>

              {productsOpen && (
                <ul className="dropdown-menu-hover">
                  <li>
                    <Link
                      href="/product"
                      className="dropdown-item fw-bold"
                      onClick={() => setProductsOpen(false)}
                    >
                      All Products
                    </Link>
                  </li>

                  <li className="dropdown-divider"></li>

                  {categories.map((cat) => (
                    <li key={cat.category_id} className="submenu-hover">
                      <span className="dropdown-item fw-bold">
                        {cat.category_name}
                      </span>

                      {cat.children.length > 0 && (
                        <ul className="dropdown-menu-hover right">
                          {cat.children.map((sub) => (
                            <li key={sub.category_id}>
                              <Link
                                href={`/category/${sub.category_id}`}
                                className="dropdown-item"
                                onClick={() => setProductsOpen(false)}
                              >
                                {sub.category_name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* BLOG */}
            <li className="nav-item">
              <Link className="nav-link nav-anim" href="/blog">
                Blog
              </Link>
            </li>

            {/* CONTACT */}
            <li className="nav-item">
              <Link className="nav-link nav-anim" href="/contact">
                Contact
              </Link>
            </li>

            {/* AUTH */}
            {!user ? (
              <li className="nav-item">
                <Link className="nav-link nav-anim fw-bold" href="/login">
                  Login
                </Link>
              </li>
            ) : (
              <li className="nav-item user-dropdown">
                <span className="nav-link nav-anim fw-bold">
                  Hi, {user.name || user.full_name || user.email}
                </span>

                <ul className="user-dropdown-menu">
                  <li>
                    <Link href="/order" className="dropdown-item">
                      My Orders
                    </Link>
                  </li>

                  <li>
                    <Link href="/profile" className="dropdown-item">
                      My Profile
                    </Link>
                  </li>

                  {/* ADMIN DASHBOARD */}
                  {user?.role === "ADMIN" && (
                    <>
                      <li className="dropdown-divider"></li>
                      <li>
                        <Link
                          href="/admin"
                          className="dropdown-item fw-bold"
                        >
                          Admin Dashboard
                        </Link>
                      </li>
                    </>
                  )}

                  <li className="dropdown-divider"></li>

                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}