"use client";
import { useEffect } from "react";
import { speak } from "@/lib/speech";
import { extendSession } from "@/lib/session";
import { KID } from "@/lib/kid";
import { HoldButton } from "./HoldButton";

/** Shown when the parent's session time is used up (between questions, never in the middle of one). */
export function TimeUpScreen() {
  useEffect(() => {
    void speak(`Hết giờ học rồi. Hôm nay ${KID.name} học xong rồi. Bài đang làm đã được lưu. Lần sau mình học tiếp nhé.`, {
      caption: "Hết giờ học rồi. Bài đang làm đã được lưu. Lần sau mình học tiếp nhé.",
    });
  }, []);
  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-indigo-100 p-6 text-center" role="dialog" aria-label="Hết giờ học">
      <div className="text-9xl" aria-hidden>
        🐻💤
      </div>
      <p className="text-5xl font-extrabold text-indigo-900">Hết giờ học rồi.</p>
      <p className="max-w-xl text-2xl font-bold text-indigo-900/80">Bài đang làm đã được lưu. Lần sau mình học tiếp.</p>
      <HoldButton label="Phụ huynh: giữ 2 giây để cho học thêm" onHold={extendSession} className="btn btn-white !min-h-12 !text-base opacity-70">
        Phụ huynh: giữ 2 giây để học thêm
      </HoldButton>
    </div>
  );
}
