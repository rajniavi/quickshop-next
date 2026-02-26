"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Chatbot() {
  // ✅ CLOSED BY DEFAULT
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [listening, setListening] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // 🔽 Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🎙️ Voice recognition setup
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      setInput(event.results[0][0].transcript);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
  }, []);

  async function sendMessage() {
    if (!input.trim() || sending) return;

    const userText = input;
    setInput("");
    setSending(true);

    setMessages((prev) => [
      ...prev,
      { role: "user", type: "text", content: userText },
      { role: "bot", type: "typing" },
    ]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();

      setMessages((prev) =>
        prev.filter((m) => m.type !== "typing").concat({ role: "bot", ...data })
      );
    } catch {
      setMessages((prev) =>
        prev.filter((m) => m.type !== "typing").concat({
          role: "bot",
          type: "text",
          reply: "Something went wrong. Try again.",
        })
      );
    }

    setSending(false);
  }

  function startListening() {
    if (!recognitionRef.current || listening) return;
    recognitionRef.current.start();
  }

  /* ===============================
     CLOSED STATE (CHAT ICON ONLY)
     =============================== */
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#e63946",
          color: "#fff",
          borderRadius: "50%",
          width: "55px",
          height: "55px",
          border: "none",
          fontSize: "22px",
          cursor: "pointer",
          zIndex: 9999,
        }}
      >
        💬
      </button>
    );
  }

  /* ===============================
     OPEN CHAT WINDOW
     =============================== */
  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "330px",
        background: "#fff",
        borderRadius: "10px",
        boxShadow: "0 0 15px rgba(0,0,0,0.2)",
        zIndex: 9999,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: "#e63946",
          color: "#fff",
          padding: "10px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        🛍️ Shop Assistant
        <button
          onClick={() => setOpen(false)}
          style={{ background: "none", border: "none", color: "#fff" }}
        >
          ❌
        </button>
      </div>

      {/* MESSAGES */}
      <div style={{ padding: "10px", height: "280px", overflowY: "auto" }}>
        {messages.map((msg, i) => {
          if (msg.type === "typing") {
            return (
              <div key={i} style={{ fontStyle: "italic", color: "#777" }}>
                Bot is typing...
              </div>
            );
          }

          if (msg.type === "text") {
            return (
              <div key={i} style={{ marginBottom: "8px" }}>
                <strong>{msg.role === "user" ? "You" : "Bot"}:</strong>{" "}
                {msg.content || msg.reply}
              </div>
            );
          }

          if (msg.type === "products") {
            return (
              <div key={i}>
                <strong>Recommended Products</strong>
                {msg.products.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      border: "1px solid #eee",
                      padding: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    <div style={{ display: "flex", gap: "6px" }}>
                      {p.images.map((img, idx) => (
                        <Image
                          key={idx}
                          src={img}
                          width={60}
                          height={60}
                          alt={p.title}
                        />
                      ))}
                    </div>
                    <p>{p.title}</p>
                    <small>₹{p.price}</small>
                    <br />
                    <Link href={`/product/${p.id}`}>View</Link>
                  </div>
                ))}
              </div>
            );
          }

          return null;
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div style={{ display: "flex", padding: "8px", gap: "6px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about products..."
          style={{ flex: 1, padding: "6px" }}
          disabled={sending}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button onClick={startListening} disabled={listening}>
          {listening ? "🎙️..." : "🎙️"}
        </button>

        <button onClick={sendMessage} disabled={sending}>
          {sending ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}