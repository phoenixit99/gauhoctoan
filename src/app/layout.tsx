import type { Metadata, Viewport } from "next";
import { Baloo_2 } from "next/font/google";
import "./globals.css";

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Gấu Đi Học",
  description: "Bé lớp 1 học Toán và Tiếng Việt cùng chú gấu, từng bước rõ ràng.",
  // Opened from the iPad home screen: full screen, no Safari bar.
  appleWebApp: { capable: true, title: "Gấu Đi Học", statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#bfe9ff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${baloo.variable} h-full antialiased`}>
      <body className="h-full">{children}</body>
    </html>
  );
}
