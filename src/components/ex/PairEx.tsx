"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Card, PairQ } from "@/content/types";
import { speak } from "@/lib/speech";
import { sfx } from "@/lib/sfx";
import { playWalk, usePrompt, type ExProps } from "./common";
import { Emo } from "./Emo";

const LINE_COLORS = ["#ef5350", "#42a5f5", "#66bb6a", "#ffa726", "#ab47bc"];
type Line = { x1: number; y1: number; x2: number; y2: number; color: string };

function CardFace({ c, big }: { c: Card; big?: boolean }) {
  if (c.emoji)
    return (
      <span className="flex flex-col items-center gap-1">
        <span className="text-6xl leading-none">
          <Emo e={c.emoji} />
        </span>
        {c.text && <span className="text-2xl font-extrabold">{c.text}</span>}
      </span>
    );
  return <span className={`font-extrabold ${big ? "text-4xl" : "text-3xl"}`}>{c.text}</span>;
}

/** Nối: tap a left card (picture or first half), then the matching right card. Lines are drawn like on paper. */
export function PairEx({ q, hint, locked, onAnswer, onRevealDone }: ExProps<PairQ>) {
  const [pairs, setPairs] = useState<Record<number, number>>({});
  const [sel, setSel] = useState<number | null>(null);
  const [focus, setFocus] = useState<number | null>(null);
  const [shake, setShake] = useState<number | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const box = useRef<HTMLDivElement>(null);
  const lRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const prompt = usePrompt(q);

  useLayoutEffect(() => {
    const measure = () => {
      const root = box.current?.getBoundingClientRect();
      if (!root) return;
      setLines(
        Object.entries(pairs).map(([li, ri]) => {
          const a = lRefs.current[+li]!.getBoundingClientRect();
          const b = rRefs.current[ri]!.getBoundingClientRect();
          return {
            x1: a.right - root.left,
            y1: a.top + a.height / 2 - root.top,
            x2: b.left - root.left,
            y2: b.top + b.height / 2 - root.top,
            color: LINE_COLORS[+li % LINE_COLORS.length],
          };
        }),
      );
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [pairs]);

  useEffect(() => {
    if (hint < 2) return;
    let alive = true;
    (async () => {
      await prompt.current;
      if (hint === 2 && q.hint2) {
        await speak(q.hint2);
        return;
      }
      if (hint === 2) {
        const left = q.left.map((c) => c.say).join(", ");
        await speak(q.left[0].emoji ? `Gấu nói tên các hình: ${left}.` : `Các phần đầu là: ${left}.`);
        return;
      }
      setPairs({});
      const ok = await playWalk(
        q.walk ?? [],
        () => alive,
        (w) => setFocus(w.focus ?? null),
        (w) => {
          if (w.pair) {
            sfx.pop();
            setPairs((p) => ({ ...p, [w.pair![0]]: w.pair![1] }));
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

  const tapLeft = (li: number) => {
    if (locked || hint === 3) return;
    sfx.tap();
    setSel(li);
    if (q.left[li].emoji) void speak(q.left[li].say); // naming the picture is help, not the answer
  };

  const tapRight = (ri: number) => {
    if (locked || hint === 3) return;
    if (sel === null) {
      void speak(q.left[0].emoji ? "Con chạm vào một hình trước nhé!" : "Con chạm vào một phần đầu trước nhé!");
      return;
    }
    if (q.answer[sel] === ri) {
      const next = { ...pairs, [sel]: ri };
      setPairs(next);
      setSel(null);
      sfx.pop();
      if (Object.keys(next).length === q.left.length) onAnswer(true);
    } else {
      setShake(ri);
      setTimeout(() => setShake(null), 500);
      onAnswer(false);
    }
  };

  const usedRight = new Set(Object.values(pairs));

  return (
    <div className="flex h-full items-center justify-center overflow-y-auto p-4">
      <div ref={box} className="relative flex items-center gap-[min(16vw,10rem)]">
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
          {lines.map((l, i) => (
            <motion.line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.color} strokeWidth={6} strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
          ))}
        </svg>
        <div className="flex flex-col gap-3">
          {q.left.map((c, li) => {
            const done = li in pairs;
            return (
              <button
                key={li}
                ref={(el) => {
                  lRefs.current[li] = el;
                }}
                disabled={locked || done || hint === 3}
                onClick={() => tapLeft(li)}
                className={`grid min-h-20 min-w-28 place-items-center rounded-3xl border-4 bg-white px-4 py-2 shadow-md transition ${
                  sel === li || focus === li ? "scale-105 border-orange-400 ring-4 ring-orange-200" : done ? "border-green-400 bg-green-50" : "border-transparent"
                }`}
              >
                <CardFace c={c} big />
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-3">
          {q.right.map((c, ri) => (
            <motion.button
              key={ri}
              ref={(el) => {
                rRefs.current[ri] = el;
              }}
              disabled={locked || usedRight.has(ri) || hint === 3}
              onClick={() => tapRight(ri)}
              animate={shake === ri ? { opacity: [1, 0.45, 1] } : {}}
              className={`grid min-h-20 min-w-32 place-items-center rounded-full border-4 px-5 shadow-md ${
                usedRight.has(ri) ? "border-green-500 bg-green-100 text-green-800" : "border-slate-700 bg-white"
              }`}
            >
              <CardFace c={c} />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
