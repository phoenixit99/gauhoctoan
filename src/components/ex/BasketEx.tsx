"use client";
import { useEffect, useState } from "react";
import type { BasketQ } from "@/content/types";
import { speak } from "@/lib/speech";
import { sfx } from "@/lib/sfx";
import { wait } from "@/lib/vn";
import { Orchard } from "../three/Orchard";
import { usePrompt, type ExProps } from "./common";

/** 3D: put exactly n apples from the tree into the basket. */
export function BasketEx({ q, hint, locked, onAnswer, onRevealDone }: ExProps<BasketQ>) {
  const [basket, setBasket] = useState<number[]>([]);
  const [happy, setHappy] = useState(false);
  const prompt = usePrompt(q);

  useEffect(() => {
    if (hint < 2) return;
    let alive = true;
    (async () => {
      await prompt.current;
      if (hint === 2) {
        await speak(`Trong giỏ có ${basket.length} quả. Mình cần ${q.n} quả nhé.`);
        return;
      }
      setBasket([]);
      await speak("Gấu làm cùng con nhé!");
      for (let i = 0; i < q.n && alive; i++) {
        setBasket((b) => [...b, i]);
        sfx.pop();
        await speak(String(i + 1));
      }
      if (!alive) return;
      setHappy(true);
      await speak(`Đây là ${q.n} quả táo!`);
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
    const next = basket.includes(i) ? basket.filter((x) => x !== i) : [...basket, i];
    setBasket(next);
    sfx.pop();
    if (next.length > 0) void speak(String(next.length));
  };

  const labels: Record<number, number> = {};
  if (hint >= 2) basket.forEach((a, k) => (labels[a] = k + 1));

  return (
    <div className="relative h-full">
      <Orchard apples={10} basket={basket} onTapApple={tap} labels={labels} bearHappy={happy || locked} />
      <div className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2">
        <div className="chip !text-3xl">
          🧺 Cần <span className="text-5xl text-orange-600">{q.n}</span> 🍎
        </div>
      </div>
      <div className="absolute bottom-3 right-4">
        <button
          disabled={locked || hint === 3 || basket.length === 0}
          onClick={() => {
            if (basket.length === q.n) {
              setHappy(true);
              onAnswer(true);
            } else {
              onAnswer(false, basket.length > q.n
                  ? `Chưa đúng. Giỏ có ${basket.length} quả. Mình cần ${q.n} quả. Con chạm vào quả trong giỏ để bỏ bớt.`
                  : `Chưa đúng. Giỏ có ${basket.length} quả. Mình cần ${q.n} quả. Con hái thêm.`);
            }
          }}
          className="btn btn-green !min-h-20 !text-3xl"
        >
          Xong ✓
        </button>
      </div>
    </div>
  );
}
