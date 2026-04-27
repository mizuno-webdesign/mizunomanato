import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { company, name, email, phone, type, channel, body: message } = body;

    if (!company || !name || !email || !type || !message) {
      return NextResponse.json({ error: "必須項目が未入力です" }, { status: 400 });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "メールアドレスの形式が正しくありません" }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "メール送信が設定されていません" }, { status: 503 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "noreply@mizunomanato.com",
      to: ["mizuno.webdesign@gmail.com"],
      subject: `【お問い合わせ】${type} — ${name} 様`,
      text: `お問い合わせがありました。\n\n会社名: ${company}\nお名前: ${name}\nメールアドレス: ${email}\n電話番号: ${phone || "未記入"}\nお問い合わせの種類: ${type}\nサービスを知ったきっかけ: ${channel || "未記入"}\n\nお問い合わせ内容:\n${message}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "送信に失敗しました" }, { status: 500 });
  }
}
