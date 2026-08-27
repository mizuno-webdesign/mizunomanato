import { useSyncExternalStore } from "react";

// 画面幅がSP（640px以下）かどうかを React 推奨の方法（useSyncExternalStore）で購読するフック。
// useEffect 内で setState する実装だとレンダーのカスケードを招くため、こちらに統一している。
const SP_MEDIA_QUERY = "(max-width: 640px)";

function subscribe(callback: () => void) {
  const mq = window.matchMedia(SP_MEDIA_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(SP_MEDIA_QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

export function useIsSp() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
