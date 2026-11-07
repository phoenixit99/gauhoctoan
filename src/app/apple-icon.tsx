import { ImageResponse } from "next/og";
import { BearIcon } from "@/lib/bearIcon";

// The icon iPad shows after "Thêm vào MH chính" (Add to Home Screen).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<BearIcon size={180} />, size);
}
