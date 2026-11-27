// 問い合わせフォームの回数制限（大量に送られて、受信箱があふれたり、メールの送信枠を使い切ったりするのを抑える）。
// ・同じ IP アドレスからは10分間に5通まで。全体では1時間に30通まで。
// ・数えるのは、入力の確認を通って、実際に送ろうとした分だけ。記録はサーバーのメモリにだけ置き、保存しない。
// ・注意：サーバーは複数に分かれて動くことがあり、再起動でも記録は消える。そのため、厳密な上限ではない。
//   確実にするには、Vercel の管理画面のファイアウォールでも制限する。
const PER_IP = { max: 5, windowMs: 10 * 60 * 1000 };
const TOTAL = { max: 30, windowMs: 60 * 60 * 1000 };

// 通した分だけを残すので、全体の上限より多くは増えない
let sent: { ip: string; at: number }[] = [];

// 送ってよければ記録して 0 を返す。だめなら、次に送れるようになるまでの秒数を返す。
export function takeContactSlot(ip: string, now = Date.now()): number {
  sent = sent.filter((s) => now - s.at < TOTAL.windowMs);
  const mine = sent.filter((s) => s.ip === ip && now - s.at < PER_IP.windowMs);
  if (mine.length >= PER_IP.max) return Math.ceil((mine[0].at + PER_IP.windowMs - now) / 1000);
  if (sent.length >= TOTAL.max) return Math.ceil((sent[0].at + TOTAL.windowMs - now) / 1000);
  sent.push({ ip, at: now });
  return 0;
}

// 送った人の IP アドレス。Vercel では、これらのヘッダーは Vercel が付け直す（送る側が偽れない）。
export function clientIp(headers: Headers): string {
  return headers.get("x-real-ip") ?? headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}
