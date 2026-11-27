"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

// サイト内のリンクのクリックを、まとめて計測する（イベントの一覧は src/lib/analytics.ts）。
// リンクを足したときに指定を忘れないように、行き先と置かれた場所から自動で分類する。
// ページ内の移動（目次など）と、管理画面（/studio）は計測しない。

// 押された場所の名前。data-ga-area があればそれを、なければ一番近いカードの見出しの id から作る
// （例：pc-works-title と s-works-title は、どちらも works）。
function areaOf(el: Element) {
  const marked = el.closest("[data-ga-area]")?.getAttribute("data-ga-area");
  if (marked) return marked;
  const labelledBy = el.closest("section[aria-labelledby]")?.getAttribute("aria-labelledby");
  if (labelledBy) return labelledBy.replace(/^(pc|s)-/, "").replace(/-(title|name)$/, "");
  return el.closest('nav[aria-label="メイン"]') ? "nav" : "page";
}

export default function ClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (window.location.pathname.startsWith("/studio")) return;
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement)) return;
      const href = a.getAttribute("href") ?? "";
      if (href.startsWith("#")) return;
      const url = new URL(a.href);
      if (url.protocol !== "https:" && url.protocol !== "http:") return;

      const location = areaOf(a);
      if (url.origin !== window.location.origin) {
        // 検索語などが付いていても送らないように、? より後ろは外す
        track("external_click", { location, link_url: `${url.origin}${url.pathname}` });
        return;
      }
      const path = url.pathname;
      const detail = path.match(/^\/(works|articles)\/[^/]+/);
      if (path === "/contact") track("cta_click", { location });
      else if (a.closest('nav[aria-label="メイン"]')) track("nav_click", { location, link_path: path });
      else if (detail) track("content_click", { location, content_type: detail[1] === "works" ? "work" : "article", link_path: path });
      else track("link_click", { location, link_path: path });
    };
    // 先に受け取る（ページ側の処理がイベントを止めても、数えられるように）
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
