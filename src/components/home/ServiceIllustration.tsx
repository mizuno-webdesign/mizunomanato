import Image, { type StaticImageData } from "next/image";
import buildImage from "./service-build.webp";
import improveImage from "./service-improve.webp";
import operateImage from "./service-operate.webp";

// サービス3本の絵（社長提供の背景透明の画像。2026-11-26 に差し替え）。
// 背景が透明なので、明るい表示でも暗い表示でも同じ画像を使う。名前と説明が別にあるので、装飾として扱う（alt は空）。
const IMAGES: Record<string, StaticImageData> = {
  build: buildImage,
  improve: improveImage,
  operate: operateImage,
};

export default function ServiceIllustration({
  id,
  sizes,
  className = "",
  style,
}: {
  id: string; // src/lib/services.tsx の id
  sizes: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return <Image src={IMAGES[id]} alt="" sizes={sizes} className={`object-contain ${className}`} style={style} />;
}
