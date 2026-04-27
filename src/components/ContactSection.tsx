"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

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
      router.push("/thanks");
    } catch {
      setStatus("error");
    }
  };

  const monoStyle = {
    fontFamily: "var(--font-ui)",
    fontSize: "11px" as const,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
  };

  const inputStyle = {
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(235,231,218,0.3)",
    outline: "none",
    color: "var(--inverse)",
    fontSize: "14px",
    fontFamily: "inherit",
    padding: "4px 0 8px",
    width: "100%",
    WebkitTextFillColor: "var(--inverse)",
    WebkitBoxShadow: "0 0 0px 1000px #1c241b inset",
  };

  const fieldWrapStyle = {
    borderTop: "1px solid var(--inverse-soft)",
    padding: "20px 0",
    display: "grid" as const,
    gridTemplateColumns: "220px 1fr",
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
        <div className="contact-head">
          <div className="contact-head-label" style={{ ...monoStyle, opacity: 0.6 }}>§ 04 · Contact</div>
          <h2
            style={{
              fontFamily: "var(--font-display), 'Times New Roman', serif",
              fontSize: "clamp(36px, 5vw, 64px)",
              margin: 0,
              letterSpacing: "-0.01em",
              lineHeight: 1,
              fontWeight: 400,
              display: "inline-block",
            }}
          >
            Contact
          </h2>
        </div>

        {/* フォーム */}
        <form
              onSubmit={handleSubmit(onSubmit)}
              style={{ maxWidth: "900px", margin: "0 auto" }}
            >
              {/* 会社名 */}
              <div className="contact-field" style={fieldWrapStyle}>
                <div style={labelStyle}>
                  <span style={{ ...monoStyle, fontSize: "10px", color: "#e07070" }}>必須</span>
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
              <div className="contact-field" style={fieldWrapStyle}>
                <div style={labelStyle}>
                  <span style={{ ...monoStyle, fontSize: "10px", color: "#e07070" }}>必須</span>
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
              <div className="contact-field" style={fieldWrapStyle}>
                <div style={labelStyle}>
                  <span style={{ ...monoStyle, fontSize: "10px", color: "#e07070" }}>必須</span>
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
              <div className="contact-field" style={fieldWrapStyle}>
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
                className="contact-field"
                style={{
                  ...fieldWrapStyle,
                  alignItems: "flex-start",
                }}
              >
                <div style={labelStyle}>
                  <span style={{ ...monoStyle, fontSize: "10px", color: "#e07070" }}>必須</span>
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>
                    お問い合わせの種類
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {TYPE_OPTIONS.map((opt) => (
                    <label
                      key={opt}
                      onClick={() => setValue("type", opt)}
                      style={{
                        fontSize: "13.5px",
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <span
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
                className="contact-field"
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
                      onClick={() => setValue("channel", opt)}
                      style={{
                        fontSize: "13.5px",
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <span
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
                className="contact-field"
                style={{
                  ...fieldWrapStyle,
                  alignItems: "flex-start",
                }}
              >
                <div style={labelStyle}>
                  <span style={{ ...monoStyle, fontSize: "10px", color: "#e07070" }}>必須</span>
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>
                    お問い合わせ内容
                  </span>
                </div>
                <div style={{ width: "100%" }}>
                  <textarea
                    {...register("body", { required: true })}
                    placeholder="お問い合わせ内容は、こちらに記載ください"
                    rows={10}
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                      lineHeight: 1.8,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(235,231,218,0.2)",
                      padding: "12px",
                      borderRadius: "2px",
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
                  padding: "18px 0",
                  width: "100%",
                  maxWidth: "360px",
                  display: "flex",
                  margin: "32px auto 0",
                  justifyContent: "center",
                  background: "var(--inverse)",
                  color: "var(--ink)",
                  border: "none",
                  ...monoStyle,
                  fontSize: "16px",
                  cursor: status === "sending" ? "wait" : "pointer",
                  gap: "12px",
                  alignItems: "center",
                  opacity: status === "sending" ? 0.7 : 1,
                }}
              >
                {status === "sending" ? "送信中..." : "送信する"}
                {status !== "sending" && <Arrow size={14} color="var(--ink)" />}
              </button>

              <div
                style={{
                  marginTop: "20px",
                  ...monoStyle,
                  opacity: 0.5,
                  fontSize: "11px",
                  textAlign: "center",
                }}
              >
                または{" "}
                <a
                  href="https://lin.ee/VGOYsfe"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "inherit", opacity: 1, textDecoration: "underline" }}
                >
                  LINE で相談する
                </a>
                <br />
                通常2営業日以内にご返信いたします
              </div>

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
      </div>
    </section>
  );
}
