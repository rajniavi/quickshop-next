"use client";

import { useState } from "react";

export default function SubmitBlog() {
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("short_description", shortDescription);
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setTitle("");
        setShortDescription("");
        setContent("");
        setImage(null);
      } else {
        setMessage(data.message || "Something went wrong.");
      }
    } catch (error) {
      setMessage("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="layout_padding">
      <div className="container" style={{ maxWidth: "700px" }}>
        <h2>Submit a Blog</h2>
        <p>Your blog will be reviewed before publishing.</p>

        {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="form-control mb-3"
          />

          <textarea
            placeholder="Short Description"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            required
            className="form-control mb-3"
          />

          <textarea
            placeholder="Full Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="form-control mb-3"
            rows={6}
          />

          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="form-control mb-3"
          />

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Blog"}
          </button>
        </form>
      </div>
    </section>
  );
}
