// "use client";
// import Navbar from "../components/Navbar";
// import Link from "next/link";
// import { pool } from "@/lib/db";

// async function getBlogs() {
//   const [rows] = await pool.query(
//     `
//     SELECT *
//     FROM blogs
//     WHERE status = 'PUBLISHED'
//       AND is_deleted = 0
//     ORDER BY created_at DESC
//     `
//   );

//   return rows;
// }

// export default async function Blog() {
//   const blogs = await getBlogs();

//   return (
//     <>
//       <Navbar />

//       <section className="layout_padding">
//         <div className="container">
//           <h2>Blog</h2>
//           <p>Latest news and updates.</p>

//           {/* PUBLIC SUBMIT BLOG BUTTON */}
//           <Link href="/blog/submit" className="btn btn-secondary mb-4">
//             Create a Blog
//           </Link>

//           {blogs.length === 0 ? (
//             <p>No blogs published yet.</p>
//           ) : (
//             <div className="row">
//               {blogs.map((blog) => (
//                 <div key={blog.id} className="col-md-4">
//                   <div className="card mb-4">
//                     {blog.image && (
//                       <img
//                         src={`/uploads/blogs/${blog.image}`}
//                         className="card-img-top"
//                         alt={blog.title}
//                       />
//                     )}
//                     <div className="card-body">
//                       <h5 className="card-title">{blog.title}</h5>
//                       <p className="card-text">
//                         {blog.short_description}
//                       </p>
//                       <Link
//                         href={`/blog/${blog.slug}`}
//                         className="btn btn-primary"
//                       >
//                         Read More
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </section>
//     </>
//   );
// }
import Navbar from "../components/Navbar";
import Link from "next/link";

async function getBlogs() {
  const res = await fetch("http://localhost:3000/api/blogs", {
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export default async function Blog() {
  const blogs = await getBlogs();

  return (
    <>
    

      <section className="layout_padding">
        <div className="container">
          <h2>Blog</h2>
          <p>Latest news and updates.</p>

          <Link href="/blog/submit" className="btn btn-secondary mb-4">
            Create a Blog
          </Link>

          {blogs.length === 0 ? (
            <p>No blogs published yet.</p>
          ) : (
            <div className="row">
              {blogs.map((blog) => (
                <div key={blog.id} className="col-md-4">
                  <div className="card mb-4">
                    {blog.image && (
                      <img
                        src={`/uploads/blogs/${blog.image}`}
                        className="card-img-top"
                        alt={blog.title}
                      />
                    )}
                    <div className="card-body">
                      <h5 className="card-title">{blog.title}</h5>
                      <p className="card-text">
                        {blog.short_description}
                      </p>
                      <Link
                        href={`/blog/${blog.slug}`}
                        className="btn btn-primary"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
