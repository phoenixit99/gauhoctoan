"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { SelectQ } from "@/content/types";
import { speak } from "@/lib/speech";
import { spellSyl } from "@/content/tv/words";
import { sfx } from "@/lib/sfx";
import { playWalk, usePrompt, type ExProps } from "./common";

/** Chọn tất cả: tap every card that fits (tap again to undo), then "Xong". Tapping a picture says its name. */
export function SelectEx({ q, hint, locked, onAnswer, onRevealDone }: ExProps<SelectQ>) {
  const [chosen, setChosen] = useState<number[]>([]);
  const [focus, setFocus] = useState<number | null>(null);
  const [labels, setLabels] = useState(false);
  const [shake, setShake] = useState(false);
  const prompt = usePrompt(q);

  useEffect(() => {
    if (hint < 2) return;
    let alive = true;
    (async () => {
      await prompt.current;
      if (hint === 2) {
        if (q.cards.some((c) => c.emoji)) {
          setLabels(true);
          await speak("Gấu viết tên dưới mỗi hình rồi. Con đọc từng tên nhé.");
        } else {
          for (let i = 0; i < q.cards.length && alive; i++) {
            setFocus(i);
            await speak(`${spellSyl(q.cards[i].say)}.`, { caption: q.cards[i].text });
          }
          if (alive) setFocus(null);
        }
        return;
      }
      setChosen([]);
      const ok = await playWalk(q.walk ?? [], () => alive, (w) => {
        if (w.labels) setLabels(true);
        setFocus(w.focus ?? null);
        if (w.pick !== undefined) {
          sfx.pop();
          setChosen((c) => [...c, w.pick!]);
        }
      });
      if (ok) onRevealDone();
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hint]);

  const toggle = (i: number) => {
    if (locked || hint === 3) return;
    sfx.tap();
    setChosen((c) => (c.includes(i) ? c.filter((x) => x !== i) : [...c, i]));
    if (q.cards[i].emoji) void speak(q.cards[i].say);
  };

  const check = () => {
    const extra = chosen.filter((i) => !q.correct.includes(i));
    const missing = q.correct.filter((i) => !chosen.includes(i));
    if (!extra.length && !missing.length) return onAnswer(true);
    setShake(true);
    setTimeout(() => setShake(false), 500);
    if (extra.length) {
      setChosen((c) => c.filter((i) => q.correct.includes(i)));
      return onAnswer(false, `Có ${extra.length} cái chưa đúng. Gấu bỏ chọn rồi. Con xem lại nhé.`);
    }
    onAnswer(false, `Còn ${missing.length} cái nữa. Con tìm tiếp nhé.`);
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 overflow-y-auto p-4">
      <motion.div animate={shake ? { opacity: [1, 0.45, 1] } : {}} className="flex max-w-4xl flex-wrap justify-center gap-4">
        {q.cards.map((c, i) => {
          const on = chosen.includes(i);
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={`relative flex min-h-32 min-w-32 flex-col items-center justify-center rounded-[2rem] border-b-8 p-3 shadow-xl ${
                on ? "border-green-600 bg-green-100 ring-8 ring-green-300" : focus === i ? "border-orange-400 bg-orange-50 ring-8 ring-orange-300" : "border-sky-300 bg-white"
              }`}
            >
              {c.emoji && <span className="text-7xl leading-none">{c.emoji}</span>}
              {(!c.emoji || labels) && <span className={`font-extrabold text-sky-900 ${c.emoji ? "mt-1 text-3xl" : "text-6xl"}`}>{c.text}</span>}
              {on && <span className="absolute -right-2 -top-3 text-4xl">✅</span>}
            </button>
          );
        })}
      </motion.div>
      <button onClick={check} disabled={locked || hint === 3} className="btn btn-green !min-h-20 !text-3xl">
        Xong ✓
      </button>
    </div>
  );
}
