import type { MetadataRoute } from "next";

// Lets the app be added to the home screen and open full screen, without the browser bar.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Gấu Đi Học",
    short_name: "Gấu Đi Học",
    description: "Bé lớp 1 học Toán và Tiếng Việt cùng chú gấu, từng bước rõ ràng.",
    lang: "vi",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#bfe9ff",
    theme_color: "#bfe9ff",
    icons: [
      { src: "/icon/192", sizes: "192x192", type: "image/png" },
      { src: "/icon/512", sizes: "512x512", type: "image/png" },
      { src: "/icon/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
