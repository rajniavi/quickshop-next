import { pool } from "@/lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { name, email, mobile, subject, message } = await request.json();

    if (!name || !email || !mobile || !message) {
      return NextResponse.json(
        { success: false, message: "Required fields missing" },
        { status: 400 }
      );
    }

    // ✅ Save to DB
    await pool.query(
      `
      INSERT INTO contact_messages (name, email, mobile, subject, message)
      VALUES (?, ?, ?, ?, ?)
      `,
      [name, email, mobile, subject || null, message]
    );

    // ✅ Brevo SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // ✅ Send email to admin
    //https://app.brevo.com/  by this we are sending email to admin email address when user submit contact form
await transporter.sendMail({
  from: `"QuickShop Contact" <guptarajni2307@gmail.com>`,
  to: "guptarajni2307@gmail.com",
  replyTo: email,
  subject: subject || "New Contact Message",
  html: `
    <h3>New Contact Message</h3>
    <p><b>Name:</b> ${name}</p>
    <p><b>Email:</b> ${email}</p>
    <p><b>Mobile:</b> ${mobile}</p>
    <p><b>Message:</b><br/>${message}</p>
  `,
});


    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("CONTACT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send message" },
      { status: 500 }
    );
  }
}
