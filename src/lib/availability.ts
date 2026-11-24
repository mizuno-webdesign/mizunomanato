// 対応可否（新規相談を受け付けているか）。社長が切り替える。
// 当面はコード内の定数（変更のたびにデプロイ）。将来 Sanity の項目に移す案あり（スキーマ変更は社長の了承が要る）。
// 表示は色だけに頼らず、必ず文言を併記する（色覚・読み上げ対策）。
export const ACCEPTING_NEW_REQUESTS = true;

export const AVAILABILITY_LABEL = {
  open: "新規相談を受付中",
  closed: "新規相談は停止中",
} as const;
