"use client";
import dynamic from "next/dynamic";

// The whole app is client-only (WebGL, speech, localStorage progress).
const App = dynamic(() => import("./App"), {
  ssr: false,
  loading: () => (
    <div className="sky grid h-dvh place-items-center text-4xl font-extrabold text-amber-800">🐻 Đang tải…</div>
  ),
});

export default function ClientApp() {
  return <App />;
}
