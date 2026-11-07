"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { OrderQ } from "@/content/types";
import { speak } from "@/lib/speech";
import { sfx } from "@/lib/sfx";
import { playWalk, usePrompt, type ExProps } from "./common";

/** Sắp xếp thành câu: tap the cards in order; each right card moves up into the sentence line. */
export function OrderEx({ q, hint, locked, onAnswer, onRevealDone }: ExProps<OrderQ>) {
  const [placed, setPlaced] = useState<number[]>([]); // indices into q.parts, in sentence order
  const [focus, setFocus] = useState<number | null>(null);
  const [shake, setShake] = useState<number | null>(null);
  const prompt = usePrompt(q);

  useEffect(() => {
    if (hint < 2) return;
    let alive = true;
    (async () => {
      await prompt.current;
      if (hint === 2) {
        const next = q.order[placed.length];
        setFocus(next);
        await speak(placed.length === 0 ? `Thẻ có chữ viết hoa đứng đầu câu: ${q.parts[next]}.` : `Thẻ tiếp theo là: ${q.parts[next]}.`);
        return;
      }
      setPlaced([]);
      const ok = await playWalk(
        q.walk ?? [],
        () => alive,
        (w) => setFocus(w.pick ?? null),
        (w) => {
          if (w.pick !== undefined) {
            sfx.pop();
            setPlaced((p) => [...p, w.pick!]);
          }
        },
      );
      if (ok) onRevealDone();
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hint]);

  const tap = (i: number) => {
    if (locked || hint === 3 || placed.includes(i)) return;
    if (q.order[placed.length] !== i) {
      setShake(i);
      setTimeout(() => setShake(null), 500);
      onAnswer(false, placed.length === 0 ? "Chưa đúng. Thẻ đứng đầu câu có chữ viết hoa." : undefined);
      return;
    }
    sfx.pop();
    setFocus(null);
    const next = [...placed, i];
    setPlaced(next);
    void speak(q.parts[i]);
    if (next.length === q.parts.length) onAnswer(true);
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 overflow-y-auto p-4">
      {/* The sentence being built, one slot per card. */}
      <div className="flex min-h-24 max-w-4xl flex-wrap items-center justify-center gap-3 rounded-3xl bg-white px-5 py-4 shadow-lg">
        {q.parts.map((_, k) =>
          placed[k] !== undefined ? (
            <motion.span key={k} initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="rounded-2xl bg-green-100 px-4 py-2 text-4xl font-extrabold text-green-800">
              {q.parts[placed[k]]}
            </motion.span>
          ) : (
            <span key={k} className="h-16 min-w-24 rounded-2xl border-4 border-dashed border-slate-300" />
          ),
        )}
      </div>
      <div className="flex max-w-4xl flex-wrap justify-center gap-4">
        {q.parts.map((p, i) => (
          <motion.button
            key={i}
            onClick={() => tap(i)}
            disabled={locked || hint === 3 || placed.includes(i)}
            animate={shake === i ? { opacity: [1, 0.45, 1] } : {}}
            className={`btn !min-h-20 !text-4xl ${placed.includes(i) ? "btn-white opacity-30" : "btn-blue"} ${focus === i ? "ring-8 ring-orange-300" : ""}`}
          >
            {p}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
