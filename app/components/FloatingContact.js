"use client";

export default function FloatingContact() {
  const phoneNumber = "919999988888"; // 👉 change to your number
  const whatsappNumber = "919999988888"; // 👉 same or different

  return (
    <>
       {/* 📞 CALL */}
      <a
        href={`tel:+${phoneNumber}`}
        style={{
          position: "fixed",
          bottom: "180px",
          right: "20px",
          width: "55px",
          height: "55px",
          borderRadius: "50%",
          background: "#198754",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
          zIndex: 10000,
        }}
        title="Call Us"
      >
        📞
      </a>
       {/* 💬 WHATSAPP */}
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed",
          bottom: "110px",
          right: "20px",
          width: "55px",
          height: "55px",
          borderRadius: "50%",
          background: "#25D366",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
          zIndex: 10000,
        }}
        title="Chat on WhatsApp"
      >
        💬
      </a>
        
    
    </>
  );
}