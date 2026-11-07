"use client";
import { useEffect, useRef } from "react";
import { setPaused } from "@/lib/pause";
import { speak, speakNow, stopSpeech, useCaption } from "@/lib/speech";

/**
 * The calm screen behind the "Nghỉ" button. The lesson underneath stays exactly where it was;
 * spoken prompts wait until the child taps "Học tiếp".
 */
export function BreakOverlay({ onClose }: { onClose: () => void }) {
  const before = useRef(useCaption.getState());

  useEffect(() => {
    stopSpeech();
    setPaused(true);
    void speakNow("Mình nghỉ một chút. Hít vào. Thở ra.");
  }, []);

  const resume = () => {
    stopSpeech();
    const waiting = setPaused(false);
    // Nothing was waiting to be said: repeat what the bear said before the break.
    const prev = before.current;
    if (!waiting && prev.spoken) void speak(prev.spoken, { caption: prev.text });
    else if (!waiting) useCaption.setState({ text: prev.text, spoken: prev.spoken });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-sky-100 p-6 text-center" role="dialog" aria-label="Nghỉ">
      <div className="relative grid h-72 w-72 place-items-center">
        <div className="breath absolute inset-0 rounded-full bg-sky-300/60" aria-hidden />
        <span className="relative text-8xl" aria-hidden>
          🐻
        </span>
      </div>
      <p className="text-4xl font-extrabold text-sky-900">Mình nghỉ một chút.</p>
      <p className="text-2xl font-bold text-sky-900/80">Vòng tròn to ra: hít vào. Vòng tròn nhỏ lại: thở ra.</p>
      <button className="btn btn-green !min-h-20 !px-10 !text-3xl" onClick={resume}>
        ▶ Học tiếp
      </button>
    </div>
  );
}
