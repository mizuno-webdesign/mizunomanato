import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { TYPE_OPTIONS, CHANNEL_OPTIONS, HONEYPOT_FIELD } from "@/lib/contactOptions";

const noControlChars = (value: string) => !/[\r\n]/.test(value);

const ContactSchema = z.object({
  company: z.string().trim().min(1, "入力してください").max(200).refine(noControlChars, "改行を含めることはできません"),
  name: z.string().trim().min(1, "入力してください").max(100).refine(noControlChars, "改行を含めることはできません"),
  email: z
    .string()
    .trim()
    .min(1, "入力してください")
    .max(200)
    .regex(/^\S+@\S+\.\S+$/, "メールアドレスの形式が正しくありません")
    .refine(noControlChars, "改行を含めることはできません"),
  phone: z.string().trim().max(30).refine(noControlChars, "改行を含めることはできません").optional().or(z.literal("")),
  type: z.enum(TYPE_OPTIONS, { message: "お問い合わせの種類を選択してください" }),
  channel: z.enum(CHANNEL_OPTIONS).optional().or(z.literal("")),
  body: z.string().trim().min(1, "入力してください").max(5000),
});

// このサイトのページから送られたかを調べる。ブラウザは POST の fetch に必ず Origin を付けるので、
// Origin のホストが、受け取った側のホストと同じ場合だけ通す（本番・プレビュー・手元のどれでも動く）。
function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "送信できませんでした" }, { status: 403 });
  }
  // JSON 以外は受け付けない（他サイトのフォームから、事前確認なしに送れる形式をふさぐ）
  const contentType = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  if (contentType !== "application/json") {
    return NextResponse.json({ error: "リクエストの形式が正しくありません" }, { status: 415 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "リクエストの形式が正しくありません" }, { status: 400 });
  }

  // 隠し入力欄（人には見えない）に値があれば、自動送信とみなして送らない。
  // 誤って判定された人が気づけるように、成功にはせず失敗を返す。
  if (typeof json === "object" && json !== null && (json as Record<string, unknown>)[HONEYPOT_FIELD]) {
    return NextResponse.json({ error: "送信できませんでした" }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(json);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      { error: firstIssue?.message ?? "入力内容を確認してください" },
      { status: 400 }
    );
  }

  const { company, name, email, phone, type, channel, body: message } = parsed.data;

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "メール送信が設定されていません" }, { status: 503 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: "noreply@mizunomanato.com",
    to: ["mizuno.webdesign@gmail.com"],
    subject: `【お問い合わせ】${type} — ${name} 様`,
    text: `お問い合わせがありました。\n\n会社名: ${company}\nお名前: ${name}\nメールアドレス: ${email}\n電話番号: ${phone || "未記入"}\nお問い合わせの種類: ${type}\nサービスを知ったきっかけ: ${channel || "未記入"}\n\nお問い合わせ内容:\n${message}`,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "送信に失敗しました" }, { status: 502 });
  }

  console.log("Contact email sent:", data?.id);

  return NextResponse.json({ success: true });
}
