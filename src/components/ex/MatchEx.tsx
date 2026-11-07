"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { MatchQ } from "@/content/types";
import { speak } from "@/lib/speech";
import { sfx } from "@/lib/sfx";
import { wait } from "@/lib/vn";
import { GroupView, usePrompt, type ExProps } from "./common";

const LINE_COLORS = ["#ef5350", "#42a5f5", "#66bb6a", "#ffa726", "#ab47bc"];

type Line = { x1: number; y1: number; x2: number; y2: number; color: string };

/** Nối: tap a group, then the matching number. Lines are drawn like on paper. */
export function MatchEx({ q, hint, locked, onAnswer, onRevealDone }: ExProps<MatchQ>) {
  const [pairs, setPairs] = useState<Record<number, number>>({}); // group index -> number index
  const [sel, setSel] = useState<number | null>(null);
  const [shake, setShake] = useState<number | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const box = useRef<HTMLDivElement>(null);
  const gRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const nRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const prompt = usePrompt(q);

  const numIndexFor = (gi: number) => q.numbers.indexOf(q.groups[gi].n);

  useLayoutEffect(() => {
    const measure = () => {
      const root = box.current?.getBoundingClientRect();
      if (!root) return;
      setLines(
        Object.entries(pairs).map(([gi, ni]) => {
          const a = gRefs.current[+gi]!.getBoundingClientRect();
          const b = nRefs.current[ni]!.getBoundingClientRect();
          return {
            x1: a.right - root.left,
            y1: a.top + a.height / 2 - root.top,
            x2: b.left - root.left,
            y2: b.top + b.height / 2 - root.top,
            color: LINE_COLORS[+gi % LINE_COLORS.length],
          };
        }),
      );
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [pairs]);

  useEffect(() => {
    if (hint < 3) {
      if (hint === 2) void prompt.current.then(() => speak("Gấu đã đánh số cho từng nhóm rồi. Con nối lại nhé!"));
      return;
    }
    let alive = true;
    (async () => {
      await prompt.current;
      for (let gi = 0; gi < q.groups.length && alive; gi++) {
        setPairs((p) => ({ ...p, [gi]: numIndexFor(gi) }));
        sfx.pop();
        await speak(`${q.groups[gi].n} ${q.groups[gi].name}`);
      }
      await wait(600);
      if (alive) onRevealDone();
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hint]);

  const tapNumber = (ni: number) => {
    if (locked || hint === 3 || sel === null) {
      if (sel === null) void speak("Con chạm vào một nhóm trước nhé!");
      return;
    }
    if (q.numbers[ni] === q.groups[sel].n) {
      const next = { ...pairs, [sel]: ni };
      setPairs(next);
      setSel(null);
      sfx.pop();
      if (Object.keys(next).length === q.groups.length) onAnswer(true);
      else void speak(`Đúng rồi, ${q.numbers[ni]}!`);
    } else {
      setShake(ni);
      setTimeout(() => setShake(null), 500);
      onAnswer(false);
    }
  };

  const matchedNums = new Set(Object.values(pairs));

  return (
    <div className="flex h-full items-center justify-center overflow-y-auto p-4">
      <div ref={box} className="relative flex items-center gap-[min(18vw,12rem)]">
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
          {lines.map((l, i) => (
            <motion.line
              key={i}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              stroke={l.color}
              strokeWidth={6}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4 }}
            />
          ))}
        </svg>
        <div className="flex flex-col gap-3">
          {q.groups.map((g, gi) => {
            const done = gi in pairs;
            return (
              <button
                key={gi}
                ref={(el) => {
                  gRefs.current[gi] = el;
                }}
                disabled={locked || done || hint === 3}
                onClick={() => {
                  setSel(gi);
                  sfx.tap();
                }}
                className={`min-h-20 rounded-3xl border-4 bg-white px-4 py-2 text-left shadow-md transition ${
                  sel === gi ? "scale-105 border-orange-400 ring-4 ring-orange-200" : done ? "border-green-400 bg-green-50" : "border-transparent"
                }`}
              >
                <GroupView g={g} size="text-3xl" counted={hint >= 2 ? g.n : 0} />
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-4">
          {q.numbers.map((v, ni) => (
            <motion.button
              key={ni}
              ref={(el) => {
                nRefs.current[ni] = el;
              }}
              disabled={locked || matchedNums.has(ni) || hint === 3}
              onClick={() => tapNumber(ni)}
              animate={shake === ni ? { opacity: [1, 0.45, 1] } : {}}
              className={`grid h-20 w-20 place-items-center rounded-full border-4 text-4xl font-extrabold shadow-md ${
                matchedNums.has(ni) ? "border-green-500 bg-green-100 text-green-700" : "border-slate-700 bg-white"
              }`}
            >
              {v}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
