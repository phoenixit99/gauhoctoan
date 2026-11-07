"use client";
import { AnimatePresence, motion } from "framer-motion";
import { speak, useCaption } from "@/lib/speech";

/** Bear speech bubble with a replay button. Every prompt shows here as text too. */
export function Caption() {
  const { text, spoken, speaking } = useCaption();
  return (
    <div className="flex items-center gap-3 px-4 pb-4 pt-2">
      <motion.div
        animate={speaking ? { rotate: [0, -8, 8, 0] } : { rotate: 0 }}
        transition={{ repeat: speaking ? Infinity : 0, duration: 0.6 }}
        className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-amber-200 text-4xl shadow-md"
      >
        🐻
      </motion.div>
      <div className="relative min-h-16 flex-1 rounded-3xl bg-white px-5 py-3 text-2xl font-bold shadow-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={text}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {text || "…"}
          </motion.div>
        </AnimatePresence>
      </div>
      <button
        aria-label="Nghe lại"
        onClick={() => spoken && speak(spoken, { caption: text })}
        className="btn btn-white h-16 w-16 shrink-0 !px-0 text-3xl"
      >
        🔊
      </button>
    </div>
  );
}
