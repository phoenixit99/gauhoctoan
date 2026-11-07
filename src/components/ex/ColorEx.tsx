"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { ColorQ } from "@/content/types";
import { speak } from "@/lib/speech";
import { sfx } from "@/lib/sfx";
import { wait } from "@/lib/vn";
import { Badge, usePrompt, type ExProps } from "./common";

/** "Tô màu (theo mẫu)": tap grey pictures to colour exactly n of them. */
export function ColorEx({ q, hint, locked, onAnswer, onRevealDone }: ExProps<ColorQ>) {
  const [on, setOn] = useState<number[]>([]);
  const prompt = usePrompt(q);

  useEffect(() => {
    if (hint < 2) return;
    let alive = true;
    (async () => {
      await prompt.current;
      if (hint === 2) {
        await speak(`Con đã tô ${on.length} ${q.name}. Mình cần tô ${q.n} ${q.name} nhé.`);
        return;
      }
      setOn([]);
      await speak("Gấu tô cùng con nhé!");
      for (let i = 0; i < q.n && alive; i++) {
        setOn((o) => [...o, i]);
        sfx.pop();
        await speak(String(i + 1));
      }
      if (!alive) return;
      await speak(`Đã tô ${q.n} ${q.name}.`);
      await wait(500);
      if (alive) onRevealDone();
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hint]);

  const tap = (i: number) => {
    if (locked || hint === 3) return;
    const next = on.includes(i) ? on.filter((x) => x !== i) : [...on, i];
    setOn(next);
    sfx.pop();
    if (next.length > 0) void speak(String(next.length));
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 p-4">
      <div className="flex items-center gap-4 rounded-[2rem] bg-white/90 px-6 py-5 shadow-xl">
        <span className="mr-2 grid h-20 w-20 place-items-center rounded-2xl bg-orange-100 text-6xl font-extrabold text-orange-600">{q.n}</span>
        {Array.from({ length: q.total }, (_, i) => {
          const colored = on.includes(i);
          const badge = hint >= 2 && colored ? on.indexOf(i) + 1 : undefined;
          return (
            <motion.button
              key={i}
              onClick={() => tap(i)}
              disabled={locked || hint === 3}
              animate={colored ? { scale: [1, 1.2, 1] } : { scale: 1 }}
              className="relative text-6xl leading-none"
              style={{ filter: colored ? "none" : "grayscale(1) brightness(1.6) contrast(0.6)", opacity: colored ? 1 : 0.7 }}
              aria-label={colored ? "Đã tô" : "Chưa tô"}
            >
              {q.emoji}
              {badge !== undefined && <Badge n={badge} />}
            </motion.button>
          );
        })}
      </div>
      <button
        onClick={() =>
          on.length === q.n
            ? onAnswer(true)
            : onAnswer(false, on.length > q.n
                ? `Chưa đúng. Con đã tô ${on.length} hình. Mình cần ${q.n} hình. Con chạm để bỏ bớt.`
                : `Chưa đúng. Con đã tô ${on.length} hình. Mình cần ${q.n} hình. Con tô thêm.`)
        }
        disabled={locked || hint === 3 || on.length === 0}
        className="btn btn-green !min-h-20 !text-3xl"
      >
        Xong ✓
      </button>
    </div>
  );
}
