import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { company, name, email, phone, type, channel, body: message } = body;

    if (!company || !name || !email || !type || !message) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Mail not configured" }, { status: 503 });
    }

    const payload = {
      from: "noreply@mizunomanato.com",
      to: ["mizuno.webdesign@gmail.com"],
      subject: `[Contact] ${type} - ${name}`,
      text: [
        "Company: " + company,
        "Name: " + name,
        "Email: " + email,
        "Phone: " + (phone || "-"),
        "Type: " + type,
        "Channel: " + (channel || "-"),
        "",
        "Message:",
        message,
      ].join("\n"),
    };

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + process.env.RESEND_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", res.status, err);
      return NextResponse.json({ error: "Mail send failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}
