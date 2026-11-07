"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { ReadQ } from "@/content/types";
import { speak } from "@/lib/speech";
import { sfx } from "@/lib/sfx";
import { playWalk, usePrompt, type ExProps } from "./common";

/** Luyện đọc: tap each card; the bear spells it (bờ, a, ba) and reads it. All cards heard → "Xong". */
export function ReadEx({ q, hint, locked, onAnswer, onRevealDone }: ExProps<ReadQ>) {
  const [heard, setHeard] = useState<number[]>([]);
  const [focus, setFocus] = useState<number | null>(null);
  const prompt = usePrompt(q);

  useEffect(() => {
    if (hint < 3) return;
    let alive = true;
    (async () => {
      await prompt.current;
      const ok = await playWalk(q.walk ?? [], () => alive, (w) => {
        setFocus(w.focus ?? null);
        if (w.focus !== undefined) setHeard((h) => (h.includes(w.focus!) ? h : [...h, w.focus!]));
      });
      if (ok) onRevealDone();
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hint]);

  const tap = (i: number) => {
    if (locked || hint === 3) return;
    sfx.tap();
    setFocus(i);
    setHeard((h) => (h.includes(i) ? h : [...h, i]));
    void speak(q.cards[i].spell, { caption: q.cards[i].text });
  };

  const allHeard = heard.length === q.cards.length;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 overflow-y-auto p-4">
      <div className="flex max-w-5xl flex-wrap justify-center gap-4">
        {q.cards.map((c, i) => {
          const done = heard.includes(i);
          return (
            <motion.button
              key={i}
              onClick={() => tap(i)}
              animate={focus === i ? { scale: 1.08 } : { scale: 1 }}
              className={`relative min-h-24 min-w-28 rounded-3xl border-b-8 px-6 py-3 font-extrabold shadow-lg ${c.text.length > 8 ? "text-4xl" : "text-6xl"} ${
                focus === i ? "border-orange-500 bg-orange-50 ring-8 ring-orange-300" : done ? "border-green-500 bg-green-50" : "border-sky-300 bg-white"
              }`}
            >
              {c.text}
              {done && <span className="absolute -right-2 -top-3 text-3xl">✅</span>}
            </motion.button>
          );
        })}
      </div>
      <p className="text-2xl font-bold text-amber-900">
        Đã nghe {heard.length}/{q.cards.length} thẻ
      </p>
      {allHeard && hint < 3 && (
        <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} disabled={locked} onClick={() => onAnswer(true)} className="btn btn-green !min-h-20 !text-3xl">
          Con đọc xong rồi ✓
        </motion.button>
      )}
    </div>
  );
}
