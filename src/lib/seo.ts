// タイトルと説明文の決まり（社長決定 2026-11-28）。全体のルールは 03_広報部/ルール.md の「SEO」。
// 文字数は、全角を1、半角を0.5として数える。
// Sanity の入力欄（sanity/schemaTypes）からも読むので、import は相対パスにする。
import { SITE_NAME } from "./site";

export const TITLE_MAX = 32;
export const DESCRIPTION_MIN = 80;
export const DESCRIPTION_MAX = 120;

const SUFFIX = ` — ${SITE_NAME}`;

export function textWidth(text: string): number {
  return [...text].reduce((sum, c) => sum + (c.charCodeAt(0) <= 0xff ? 0.5 : 1), 0);
}

// ページ名の後ろに「 — Manato Mizuno」を付ける。付けると上限を超える場合は、ページ名だけにする。
export function pageTitle(name: string): string {
  const trimmed = String(name ?? "").trim();
  const base = trimmed.endsWith(SUFFIX.trim()) && trimmed !== SITE_NAME ? trimmed.slice(0, -SUFFIX.trim().length).trim() : trimmed;
  const full = `${base}${SUFFIX}`;
  return textWidth(full) <= TITLE_MAX ? full : base;
}

// 複数の行を1つの文にする。日本語は行をそのままつなぎ、英単語どうしが続くところだけ空白を入れる。
function joinLines(lines: string[]): string {
  return lines.reduce((out, line) => (/[A-Za-z0-9.,]$/.test(out) && /^[A-Za-z0-9]/.test(line) ? `${out} ${line}` : out + line), "");
}

// 入力欄の文を、検索結果に出す形（前後の空白と改行を除いた1行）にする。
export function oneLine(text: unknown): string {
  if (typeof text !== "string") return "";
  return joinLines(text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean));
}

const URL_PATTERN = /https?:\/\/[A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=%]+/g;

// 事例の本文から説明文を作る（検索用説明文が空のとき）。
// URL を除き、最初の「【見出し】」より前の文を使う。長い場合は、上限に収まる最後の「。」で切る。
// その「。」までが下限より短くなる場合は、文の途中で切って「…」を付ける。
export function descriptionFromBody(body: string | undefined): string | undefined {
  if (!body) return undefined;
  const lines = body
    // かっこに入った URL は、かっこごと除く
    .replace(/[（(]\s*https?:\/\/[^\s（）()]+\s*[）)]/g, "")
    .replace(URL_PATTERN, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    // URL を除いて「サイト：」のような見出し語だけになった行は使わない
    .filter((line) => line && !/[：:]$/.test(line));
  const heading = lines.findIndex((line) => line.startsWith("【"));
  const picked = heading > 0 ? lines.slice(0, heading) : lines.map((line) => line.replace(/【[^】]*】/g, "").trim()).filter(Boolean);
  const text = joinLines(picked);
  if (!text) return undefined;
  if (textWidth(text) <= DESCRIPTION_MAX) return text;

  let cut = "";
  for (const c of text) {
    if (textWidth(cut + c) > DESCRIPTION_MAX - 1) break;
    cut += c;
  }
  const end = cut.lastIndexOf("。");
  const sentences = end >= 0 ? cut.slice(0, end + 1) : "";
  return textWidth(sentences) >= DESCRIPTION_MIN ? sentences : `${cut}…`;
}
