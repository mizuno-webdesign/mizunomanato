// 和文の中の英字・数字を少し大きくする（社長確認 2026-11-24：IBM Plex Sans JP は和文と並ぶと英字が小さく見える）。
// next/font/google では size-adjust が使えないため、英字の連なりを span で包む方式にしている。
// 倍率は globals.css の .latin（1.1em）で一括管理。
const LATIN_RUN = /([A-Za-z0-9][A-Za-z0-9 .\/&!+:'’-]*)/;

export default function Latin({ children }: { children: string }) {
  return (
    <>
      {children.split(LATIN_RUN).map((part, i) =>
        /^[A-Za-z0-9]/.test(part) ? (
          <span key={i} className="latin">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
