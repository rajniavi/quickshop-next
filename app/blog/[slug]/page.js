import Navbar from "../../components/Navbar";

async function getBlog(slug) {
  const res = await fetch(
    `http://localhost:3000/api/blogs/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function BlogDetail({ params }) {
  // 🔑 params is a Promise
  const { slug } = await params;

  const blog = await getBlog(slug);

  if (!blog) {
    return (
      <>
       
        <section className="layout_padding">
          <div className="container">
            <h2>Blog not found</h2>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
  
      <section className="layout_padding">
        <div className="container">
          <h2>{blog.title}</h2>
          <p style={{ whiteSpace: "pre-line" }}>{blog.content}</p>
        </div>
      </section>
    </>
  );
}
