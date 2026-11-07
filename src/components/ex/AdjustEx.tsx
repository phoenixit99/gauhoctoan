"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { AdjustQ, WalkStep } from "@/content/types";
import { speak } from "@/lib/speech";
import { sfx } from "@/lib/sfx";
import { wait } from "@/lib/vn";
import { setMethodStep } from "@/lib/method";
import { Badge, usePrompt, type ExProps } from "./common";

type RowState = { added: number; crossed: number[] };
const MAX = 10;

const countOf = (n: number, r: RowState) => n - r.crossed.length + r.added;

/** "Vẽ thêm / gạch bớt": tap ➕ to draw one more, tap a picture to cross it out. */
export function AdjustEx({ q, hint, locked, onAnswer, onRevealDone }: ExProps<AdjustQ>) {
  const [rows, setRows] = useState<[RowState, RowState]>([
    { added: 0, crossed: [] },
    { added: 0, crossed: [] },
  ]);
  const rowsRef = useRef(rows);
  useEffect(() => {
    rowsRef.current = rows;
  }, [rows]);
  const prompt = usePrompt(q);
  const counts = [countOf(q.rows[0].n, rows[0]), countOf(q.rows[1].n, rows[1])];

  const target = (): [number, number] => {
    const c = [countOf(q.rows[0].n, rowsRef.current[0]), countOf(q.rows[1].n, rowsRef.current[1])];
    if (q.goal.kind === "counts") return q.goal.counts;
    if (q.goal.kind === "equal") return [c[1], c[1]];
    const r = q.goal.row;
    const t: [number, number] = [c[0], c[1]];
    t[r] = Math.max(c[r], c[1 - r] + 1);
    return t;
  };

  /** Move a row one step toward a target count (used by the reveal). */
  const stepToward = (ri: 0 | 1, t: number) => {
    setRows((prev) => {
      const next: [RowState, RowState] = [{ ...prev[0] }, { ...prev[1] }];
      const r = next[ri];
      const c = countOf(q.rows[ri].n, r);
      if (c < t) {
        if (r.crossed.length) r.crossed = r.crossed.slice(0, -1);
        else r.added += 1;
      } else if (c > t) {
        if (r.added) r.added -= 1;
        else {
          const free = Array.from({ length: q.rows[ri].n }, (_, i) => i).filter((i) => !r.crossed.includes(i));
          r.crossed = [...r.crossed, free[free.length - 1]];
        }
      }
      return next;
    });
  };

  useEffect(() => {
    if (hint < 2) return;
    let alive = true;
    (async () => {
      await prompt.current;
      if (!alive) return;
      const c = [countOf(q.rows[0].n, rowsRef.current[0]), countOf(q.rows[1].n, rowsRef.current[1])];
      if (hint === 2) {
        const need =
          q.goal.kind === "counts"
            ? `Hàng trên cần ${q.goal.counts[0]}, hàng dưới cần ${q.goal.counts[1]}.`
            : q.goal.kind === "equal"
              ? `Mình cần hai hàng bằng nhau.`
              : `Hàng trên cần nhiều hơn hàng dưới.`;
        await speak(`Hàng trên có ${c[0]} ${q.rows[0].name}, hàng dưới có ${c[1]} ${q.rows[1].name}. ${need}`);
        return;
      }
      const t = target();
      // Step-by-step walkthrough: light up each method step; rows are fixed one picture at a time, counting aloud.
      if (q.walk) {
        for (let si = 0; si < q.walk.length; si++) {
          if (!alive) return;
          const w: WalkStep = q.walk[si];
          setMethodStep(w.step ?? si);
          await speak(w.say);
          if (w.row !== undefined) {
            const ri = w.row;
            while (alive && countOf(q.rows[ri].n, rowsRef.current[ri]) !== t[ri]) {
              stepToward(ri, t[ri]);
              sfx.pop();
              await wait(150);
              if (!alive) return;
              await speak(String(countOf(q.rows[ri].n, rowsRef.current[ri])));
            }
          }
          await wait(500);
        }
        if (alive) onRevealDone();
        return;
      }
      await speak("Gấu làm cùng con nhé!");
      for (const ri of [0, 1] as const) {
        while (alive && countOf(q.rows[ri].n, rowsRef.current[ri]) !== t[ri]) {
          stepToward(ri, t[ri]);
          sfx.pop();
          await wait(550);
        }
      }
      if (!alive) return;
      const s = q.goal.kind === "counts" ? ` ${t[0]} ${q.goal.sign === ">" ? "lớn hơn" : q.goal.sign === "<" ? "bé hơn" : "bằng"} ${t[1]}.` : "";
      await speak(`Bây giờ có ${t[0]} ${q.rows[0].name} và ${t[1]} ${q.rows[1].name}.${s}`);
      await wait(600);
      if (alive) onRevealDone();
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hint]);

  const canEdit = (ri: number) => q.editable[ri] && !locked && hint !== 3;

  const toggleCross = (ri: 0 | 1, i: number) => {
    if (!canEdit(ri)) return;
    sfx.tap();
    setRows((prev) => {
      const next: [RowState, RowState] = [{ ...prev[0] }, { ...prev[1] }];
      const r = next[ri];
      r.crossed = r.crossed.includes(i) ? r.crossed.filter((x) => x !== i) : [...r.crossed, i];
      return next;
    });
  };

  const add = (ri: 0 | 1, delta: 1 | -1) => {
    if (!canEdit(ri)) return;
    if (delta > 0 && countOf(q.rows[ri].n, rows[ri]) >= MAX) return;
    sfx.pop();
    setRows((prev) => {
      const next: [RowState, RowState] = [{ ...prev[0] }, { ...prev[1] }];
      next[ri].added = Math.max(0, next[ri].added + delta);
      return next;
    });
  };

  const check = () => {
    const [a, b] = counts;
    if (q.goal.kind === "equal") {
      if (a === b) return onAnswer(true);
      return onAnswer(false, a > b ? `Hàng trên còn nhiều hơn. Con gạch bớt nhé.` : `Hàng trên còn ít hơn. Con thêm nữa nhé.`);
    }
    if (q.goal.kind === "more") {
      const r = q.goal.row;
      if (counts[r] > counts[1 - r]) return onAnswer(true);
      return onAnswer(false, "Chưa đúng. Hàng trên chưa nhiều hơn. Con thêm nữa.");
    }
    const [x, y] = q.goal.counts;
    if (a === x && b === y) return onAnswer(true);
    return onAnswer(false, a !== x ? `Hàng trên cần ${x} hình nhé.` : `Hàng dưới cần ${y} hình nhé.`);
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 overflow-y-auto p-4">
      {q.goal.kind === "counts" && (
        <div className="flex items-center gap-3 text-5xl font-extrabold">
          <span className="grid h-20 w-20 place-items-center rounded-2xl border-4 border-sky-500 bg-white">{q.goal.counts[0]}</span>
          <span className="grid h-20 w-20 place-items-center rounded-2xl border-4 border-sky-500 bg-white text-orange-500">{q.goal.sign}</span>
          <span className="grid h-20 w-20 place-items-center rounded-2xl border-4 border-sky-500 bg-white">{q.goal.counts[1]}</span>
        </div>
      )}
      {q.rows.map((g, ri) => {
        const r = rows[ri];
        let k = 0; // running count for badges (skips crossed)
        return (
          <div key={ri} className="flex w-full max-w-4xl items-center gap-3">
            <div className="flex min-h-24 flex-1 flex-wrap items-center gap-2 rounded-3xl border-4 border-dashed border-sky-300 bg-white/90 px-4 py-3 shadow-md">
              {Array.from({ length: g.n }, (_, i) => {
                const crossed = r.crossed.includes(i);
                const badge = !crossed && hint >= 2 ? ++k : undefined;
                return (
                  <button
                    key={`o${i}`}
                    onClick={() => toggleCross(ri as 0 | 1, i)}
                    disabled={!canEdit(ri)}
                    className={`relative grid w-[1.25em] place-items-center text-5xl leading-none ${crossed ? "opacity-40" : ""}`}
                  >
                    {g.emoji}
                    {crossed && <span className="absolute inset-0 grid place-items-center text-6xl font-black text-red-600">✕</span>}
                    {badge !== undefined && <Badge n={badge} />}
                  </button>
                );
              })}
              <AnimatePresence>
                {Array.from({ length: r.added }, (_, i) => {
                  const badge = hint >= 2 ? ++k : undefined;
                  return (
                    <motion.button
                      key={`a${i}`}
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      onClick={() => add(ri as 0 | 1, -1)}
                      disabled={!canEdit(ri)}
                      className="relative grid w-[1.25em] place-items-center rounded-xl bg-yellow-100 text-5xl leading-none ring-2 ring-yellow-300"
                    >
                      {g.emoji}
                      {badge !== undefined && <Badge n={badge} />}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
            {q.editable[ri] ? (
              <button onClick={() => add(ri as 0 | 1, 1)} disabled={!canEdit(ri)} className="btn btn-orange !h-20 !w-20 !px-0 !text-5xl" aria-label="Thêm">
                ＋
              </button>
            ) : (
              <div className="w-20" />
            )}
          </div>
        );
      })}
      <button onClick={check} disabled={locked || hint === 3} className="btn btn-green !min-h-20 !text-3xl">
        Xong ✓
      </button>
    </div>
  );
}
