"use client";

import { useEffect, useState } from "react";

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // form state (ADMIN ONLY)
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  // fetch blogs
  const fetchBlogs = async () => {
    const res = await fetch("/api/admin/blogs");
    const data = await res.json();
    setBlogs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // CREATE BLOG (ADMIN)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("short_description", shortDescription);
    formData.append("content", content);
    if (image) formData.append("image", image);

    const res = await fetch("/api/admin/blogs", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Blog created (Draft)");
      setTitle("");
      setShortDescription("");
      setContent("");
      setImage(null);
      fetchBlogs();
    }
  };

  // UPDATE STATUS (APPROVE / UNPUBLISH)
  const updateStatus = async (id, status) => {
    await fetch("/api/admin/blogs/status", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchBlogs();
  };

  // DELETE BLOG (REJECT)
  const deleteBlog = async (id) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    await fetch("/api/admin/blogs/delete", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    fetchBlogs();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Blogs</h2>

      {/* ADMIN CREATE BLOG */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
        <h4>Create Blog (Admin)</h4>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br /><br />

        <textarea
          placeholder="Short Description"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          required
        />
        <br /><br />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <br /><br />

        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <br /><br />

        <button type="submit">Save as Draft</button>
      </form>

      {/* BLOG LIST */}
      <h3>Submitted Blogs</h3>

      {loading ? (
        <p>Loading...</p>
      ) : blogs.length === 0 ? (
        <p>No blogs found</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.id}>
                <td>{blog.title}</td>
                <td>{blog.status}</td>
                <td>{new Date(blog.created_at).toLocaleDateString()}</td>
                <td>
                  {blog.status === "DRAFT" && (
                    <button
                      onClick={() => updateStatus(blog.id, "PUBLISHED")}
                    >
                      Approve
                    </button>
                  )}

                  {blog.status === "PUBLISHED" && (
                    <button
                      onClick={() => updateStatus(blog.id, "DRAFT")}
                    >
                      Unpublish
                    </button>
                  )}

                  <button
                    onClick={() => deleteBlog(blog.id)}
                    style={{ marginLeft: "10px", color: "red" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
