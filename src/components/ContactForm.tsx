"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CHANNEL_OPTIONS, TYPE_OPTIONS } from "@/lib/contactOptions";

// 問い合わせフォーム（社長確定 2026-11-24：項目と送信の仕組みは旧サイトと同じ）。
// 入力の条件（必須・文字数・メールの形式）は、送信API（/api/contact）の検証に合わせる。

type FormData = {
  company: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  channel: string;
  body: string;
};

// 入力欄の文字は16px：iPhone で、タップしたときに画面が拡大されないようにするため。
const INPUT =
  "w-full rounded-xl border border-line bg-field px-4 py-3 text-[16px] leading-[1.6] text-ink focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-accent aria-invalid:border-ng";

const required = (max: number) => ({
  validate: (v: string) => v.trim().length > 0 || "入力してください",
  maxLength: { value: max, message: `${max}文字以内で入力してください` },
});

function Label({ text, optional = false }: { text: string; optional?: boolean }) {
  return (
    <span className="flex items-center gap-2 type-heading text-heading">
      {text}
      <span
        className={`rounded-full px-2 text-[13px] leading-[1.6] font-normal ${
          optional ? "bg-ink/6 text-ink-sub" : "bg-cta/10 text-cta-text"
        }`}
      >
        {optional ? "任意" : "必須"}
      </span>
    </span>
  );
}

function ErrorText({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="type-caption text-ng">
      {message}
    </p>
  );
}

export default function ContactForm() {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { type: TYPE_OPTIONS[0], channel: "" },
  });

  const onSubmit = async (data: FormData) => {
    setSending(true);
    setSendError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 未選択のラジオは null になることがあるため、空文字にそろえる
        body: JSON.stringify({ ...data, channel: data.channel || "" }),
      });
      if (!res.ok) {
        const result = await res.json().catch(() => null);
        throw new Error(result?.error || "送信に失敗しました");
      }
      router.push("/thanks");
    } catch (err) {
      // 通信そのものの失敗は、英語のメッセージになるので出さない
      setSendError(
        err instanceof Error && !(err instanceof TypeError) ? err.message : "送信に失敗しました",
      );
      setSending(false);
    }
  };

  // 入力欄に共通で付ける、エラーの関連付け
  const a11y = (key: keyof FormData) => ({
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `${key}-error` : undefined,
  });

  const text = (
    key: "company" | "name" | "email" | "phone",
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement>,
    rules: Parameters<typeof register>[1],
    optional = false,
  ) => (
    <label className="flex flex-col gap-2">
      <Label text={label} optional={optional} />
      <input {...props} {...register(key, rules)} {...a11y(key)} aria-required={!optional} className={INPUT} />
      <ErrorText id={`${key}-error`} message={errors[key]?.message} />
    </label>
  );

  const radios = (
    key: "type" | "channel",
    legend: string,
    options: readonly string[],
    optional = false,
  ) => (
    <fieldset>
      <legend className="mb-2">
        <Label text={legend} optional={optional} />
      </legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o) => (
          <label
            key={o}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-field px-4 py-3 type-body has-checked:border-select has-checked:bg-solid has-focus-visible:outline-2 has-focus-visible:outline-accent"
          >
            <input type="radio" value={o} {...register(key)} className="size-4 shrink-0 accent-select" />
            {o}
          </label>
        ))}
      </div>
    </fieldset>
  );

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {text("company", "会社名", { autoComplete: "organization" }, required(200))}
      {text("name", "お名前", { autoComplete: "name" }, required(100))}
      {text(
        "email",
        "メールアドレス",
        { type: "email", autoComplete: "email", inputMode: "email" },
        {
          ...required(200),
          pattern: { value: /^\s*\S+@\S+\.\S+\s*$/, message: "メールアドレスの形式が正しくありません" },
        },
      )}
      {text(
        "phone",
        "電話番号",
        { type: "tel", autoComplete: "tel" },
        { maxLength: { value: 30, message: "30文字以内で入力してください" } },
        true,
      )}
      {radios("type", "お問い合わせの種類", TYPE_OPTIONS)}
      {radios("channel", "サービスを知ったきっかけ", CHANNEL_OPTIONS, true)}

      <label className="flex flex-col gap-2">
        <Label text="お問い合わせ内容" />
        <textarea
          rows={8}
          {...register("body", required(5000))}
          {...a11y("body")}
          aria-required
          className={`${INPUT} resize-y`}
        />
        <ErrorText id="body-error" message={errors.body?.message} />
      </label>

      <div className="flex flex-col items-center gap-3">
        <button
          type="submit"
          disabled={sending}
          className="w-full max-w-[320px] cursor-pointer rounded-full bg-cta px-9 py-3.5 text-[17px] leading-[1.4] font-semibold text-white shadow-[0_1px_3px_rgba(19,119,74,0.25)] transition-[opacity,scale] duration-150 ease-out hover:opacity-90 active:scale-[0.97] active:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-60 motion-reduce:transition-none motion-reduce:active:scale-100"
        >
          {sending ? "送信中..." : "送信する"}
        </button>
        <p role="alert" className="type-caption text-ng empty:hidden">
          {sendError}
        </p>
        <p className="type-caption text-ink-sub">通常2営業日以内にご返信いたします。</p>
      </div>
    </form>
  );
}
