"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Arrow from "./Arrow";

type FormData = {
  company: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  channel: string;
  body: string;
};

const TYPE_OPTIONS = [
  "ECサイト構築について",
  "サイト分析・改善設計について",
  "運用サポートについて",
  "その他",
];

const CHANNEL_OPTIONS = [
  "公式サイト",
  "SNS",
  "広告",
  "知人・取引先からの紹介",
];

export default function ContactSection() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { type: "ECサイト構築について", channel: "" },
  });

  const watchType = watch("type");
  const watchChannel = watch("channel");

  const onSubmit = async (data: FormData) => {
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const monoStyle = {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: "11px" as const,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
  };

  const inputStyle = {
    background: "transparent",
    border: "none",
    outline: "none",
    color: "var(--inverse)",
    fontSize: "14px",
    fontFamily: "inherit",
    padding: 0,
    width: "100%",
  };

  const fieldWrapStyle = {
    borderTop: "1px solid var(--inverse-soft)",
    padding: "20px 0",
    display: "grid" as const,
    gridTemplateColumns: "180px 1fr",
    alignItems: "center" as const,
    gap: "16px",
  };

  const labelStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  return (
    <section
      id="contact"
      style={{ padding: "0 clamp(20px, 5vw, 56px) 120px" }}
    >
      <div
        style={{
          background: "var(--ink)",
          color: "var(--inverse)",
          padding: "64px clamp(20px, 5vw, 56px)",
        }}
      >
        {/* セクションヘッド */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "48px",
            paddingBottom: "20px",
            borderBottom: "1px solid var(--inverse-soft)",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div style={{ ...monoStyle, opacity: 0.6 }}>§ 04 · Contact</div>
          <h2
            style={{
              fontFamily: "var(--font-display), 'Times New Roman', serif",
              fontSize: "clamp(36px, 5vw, 64px)",
              margin: 0,
              letterSpacing: "-0.01em",
              lineHeight: 1,
              fontWeight: 400,
            }}
          >
            Let&apos;s talk.
          </h2>
          <div style={{ ...monoStyle, opacity: 0.6 }}>Free consultation</div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "72px",
          }}
        >
          {/* 左：説明 + LINE */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-display), 'Times New Roman', serif",
                fontSize: "clamp(24px, 2.5vw, 34px)",
                fontStyle: "italic",
                lineHeight: 1.35,
                marginBottom: "20px",
                fontWeight: 400,
              }}
            >
              ご相談やご質問など、
              <br />
              お気軽にご連絡ください。
            </div>
            <p
              style={{
                fontSize: "14px",
                lineHeight: 2,
                opacity: 0.82,
                maxWidth: "440px",
                marginBottom: "48px",
              }}
            >
              下記フォーム、または LINE 無料相談もご利用いただけます。
              通常2営業日以内にご返信いたします。
            </p>

            {/* LINE CTA */}
            <div
              style={{
                border: "1px solid var(--inverse-soft)",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              <div style={{ ...monoStyle, opacity: 0.6 }}>Alternative</div>
              <div
                style={{
                  fontFamily: "var(--font-display), 'Times New Roman', serif",
                  fontSize: "28px",
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                LINE 無料相談
              </div>
              <button
                style={{
                  marginTop: "8px",
                  padding: "14px 18px",
                  background: "var(--inverse)",
                  color: "var(--ink)",
                  border: "none",
                  ...monoStyle,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>LINE で相談する</span>
                <Arrow size={13} color="var(--ink)" />
              </button>
            </div>

            <div
              style={{
                marginTop: "28px",
                ...monoStyle,
                opacity: 0.5,
                lineHeight: 2,
              }}
            >
              受付 · 平日 9–18 JST
              <br />
              Reply · within 2 business days
            </div>
          </div>

          {/* 右：フォーム */}
          {status === "sent" ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display), 'Times New Roman', serif",
                  fontSize: "40px",
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                Thank you.
              </div>
              <p style={{ fontSize: "14px", lineHeight: 2, opacity: 0.82 }}>
                お問い合わせを受け付けました。
                <br />
                通常2営業日以内にご返信いたします。
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{ borderBottom: "1px solid var(--inverse-soft)" }}
            >
              {/* 会社名 */}
              <div style={fieldWrapStyle}>
                <div style={labelStyle}>
                  <span style={{ ...monoStyle, opacity: 0.9, fontSize: "10px" }}>必須</span>
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>会社名</span>
                </div>
                <div>
                  <input
                    {...register("company", { required: true })}
                    placeholder="株式会社〇〇"
                    style={inputStyle}
                  />
                  {errors.company && (
                    <p style={{ color: "#ff6b6b", fontSize: "11px", marginTop: "4px" }}>
                      入力してください
                    </p>
                  )}
                </div>
              </div>

              {/* お名前 */}
              <div style={fieldWrapStyle}>
                <div style={labelStyle}>
                  <span style={{ ...monoStyle, opacity: 0.9, fontSize: "10px" }}>必須</span>
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>お名前</span>
                </div>
                <div>
                  <input
                    {...register("name", { required: true })}
                    placeholder="田中 太郎"
                    style={inputStyle}
                  />
                  {errors.name && (
                    <p style={{ color: "#ff6b6b", fontSize: "11px", marginTop: "4px" }}>
                      入力してください
                    </p>
                  )}
                </div>
              </div>

              {/* メールアドレス */}
              <div style={fieldWrapStyle}>
                <div style={labelStyle}>
                  <span style={{ ...monoStyle, opacity: 0.9, fontSize: "10px" }}>必須</span>
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>メールアドレス</span>
                </div>
                <div>
                  <input
                    {...register("email", { required: true, pattern: /^\S+@\S+\.\S+$/ })}
                    type="email"
                    placeholder="example@abc.com"
                    style={inputStyle}
                  />
                  {errors.email && (
                    <p style={{ color: "#ff6b6b", fontSize: "11px", marginTop: "4px" }}>
                      正しいメールアドレスを入力してください
                    </p>
                  )}
                </div>
              </div>

              {/* 電話番号 */}
              <div style={fieldWrapStyle}>
                <div style={labelStyle}>
                  <span style={{ ...monoStyle, opacity: 0.45, fontSize: "10px" }}>任意</span>
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>電話番号</span>
                </div>
                <input
                  {...register("phone")}
                  type="tel"
                  placeholder="000-123-4567"
                  style={inputStyle}
                />
              </div>

              {/* お問い合わせの種類 */}
              <div
                style={{
                  ...fieldWrapStyle,
                  alignItems: "flex-start",
                }}
              >
                <div style={labelStyle}>
                  <span style={{ ...monoStyle, opacity: 0.9, fontSize: "10px" }}>必須</span>
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>
                    お問い合わせの種類
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {TYPE_OPTIONS.map((opt) => (
                    <label
                      key={opt}
                      style={{
                        fontSize: "13.5px",
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <span
                        onClick={() => setValue("type", opt)}
                        style={{
                          width: "14px",
                          height: "14px",
                          borderRadius: "50%",
                          border: "1px solid var(--inverse-soft)",
                          background: watchType === opt ? "var(--inverse)" : "transparent",
                          boxShadow:
                            watchType === opt
                              ? "inset 0 0 0 3px var(--ink)"
                              : "none",
                          flexShrink: 0,
                          display: "inline-block",
                        }}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              {/* 知ったきっかけ */}
              <div
                style={{
                  ...fieldWrapStyle,
                  alignItems: "flex-start",
                }}
              >
                <div style={labelStyle}>
                  <span style={{ ...monoStyle, opacity: 0.45, fontSize: "10px" }}>任意</span>
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>
                    サービスを知ったきっかけ
                  </span>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                  }}
                >
                  {CHANNEL_OPTIONS.map((opt) => (
                    <label
                      key={opt}
                      style={{
                        fontSize: "13.5px",
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <span
                        onClick={() => setValue("channel", opt)}
                        style={{
                          width: "14px",
                          height: "14px",
                          borderRadius: "50%",
                          border: "1px solid var(--inverse-soft)",
                          background:
                            watchChannel === opt ? "var(--inverse)" : "transparent",
                          boxShadow:
                            watchChannel === opt
                              ? "inset 0 0 0 3px var(--ink)"
                              : "none",
                          flexShrink: 0,
                          display: "inline-block",
                        }}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              {/* お問い合わせ内容 */}
              <div
                style={{
                  ...fieldWrapStyle,
                  alignItems: "flex-start",
                }}
              >
                <div style={labelStyle}>
                  <span style={{ ...monoStyle, opacity: 0.9, fontSize: "10px" }}>必須</span>
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>
                    お問い合わせ内容
                  </span>
                </div>
                <div style={{ width: "100%" }}>
                  <textarea
                    {...register("body", { required: true })}
                    placeholder="お問い合わせ内容は、こちらに記載ください"
                    rows={5}
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                      lineHeight: 1.8,
                    }}
                  />
                  {errors.body && (
                    <p style={{ color: "#ff6b6b", fontSize: "11px", marginTop: "4px" }}>
                      入力してください
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                style={{
                  marginTop: "32px",
                  padding: "18px 32px",
                  background: "var(--inverse)",
                  color: "var(--ink)",
                  border: "none",
                  ...monoStyle,
                  cursor: status === "sending" ? "wait" : "pointer",
                  display: "inline-flex",
                  gap: "12px",
                  alignItems: "center",
                  opacity: status === "sending" ? 0.7 : 1,
                }}
              >
                {status === "sending" ? "送信中..." : "送信する"}
                {status !== "sending" && <Arrow size={14} color="var(--ink)" />}
              </button>

              {status === "error" && (
                <p
                  style={{
                    marginTop: "16px",
                    color: "#ff6b6b",
                    fontSize: "13px",
                  }}
                >
                  送信に失敗しました。時間をおいて再度お試しください。
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
