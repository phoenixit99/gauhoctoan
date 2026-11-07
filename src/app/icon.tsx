import { ImageResponse } from "next/og";
import { BearIcon } from "@/lib/bearIcon";

// Icons for the web manifest (Android / installed web app) and the browser tab.
export function generateImageMetadata() {
  return [
    { id: "192", contentType: "image/png", size: { width: 192, height: 192 } },
    { id: "512", contentType: "image/png", size: { width: 512, height: 512 } },
  ];
}

export default async function Icon({ id }: { id: Promise<string | number> }) {
  const px = Number(await id);
  return new ImageResponse(<BearIcon size={px} />, { width: px, height: px });
}
