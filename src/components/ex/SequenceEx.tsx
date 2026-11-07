"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { SequenceQ } from "@/content/types";
import { speak } from "@/lib/speech";
import { sfx } from "@/lib/sfx";
import { wait } from "@/lib/vn";
import { usePrompt, type ExProps } from "./common";

const FLAG_COLORS = ["#64b5f6", "#e57373", "#ba68c8", "#81c784", "#fff176", "#4fc3f7", "#f06292", "#ce93d8", "#aed581", "#ffd54f", "#90caf9"];

/** Fill the missing numbers on a train (đoàn tàu) or bunting flags (dây cờ). */
export function SequenceEx({ q, hint, locked, onAnswer, onRevealDone }: ExProps<SequenceQ>) {
  const [filled, setFilled] = useState<number[]>([]); // indices of blanks already filled
  const [pointer, setPointer] = useState(-1); // car highlighted while counting along
  const [shake, setShake] = useState<number | null>(null);
  const prompt = usePrompt(q);

  const nextBlankPos = q.blanks.findIndex((b) => !filled.includes(b));
  const cur = nextBlankPos >= 0 ? q.blanks[nextBlankPos] : -1;

  useEffect(() => {
    if (hint < 2) return;
    let alive = true;
    (async () => {
      await prompt.current;
      if (hint === 2) {
        // Count along from the start up to the current blank.
        for (let i = 0; i < cur && alive; i++) {
          setPointer(i);
          await speak(String(q.values[i]));
        }
        if (!alive) return;
        setPointer(cur);
        await speak("Số tiếp theo là số mấy?");
        return;
      }
      // Reveal: fill every remaining blank, counting along.
      for (let i = 0; i < q.values.length && alive; i++) {
        setPointer(i);
        if (q.blanks.includes(i)) setFilled((f) => (f.includes(i) ? f : [...f, i]));
        await speak(String(q.values[i]));
      }
      if (!alive) return;
      setPointer(-1);
      await wait(500);
      if (alive) onRevealDone();
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hint]);

  const tap = (v: number) => {
    if (locked || hint === 3 || cur < 0) return;
    if (v === q.values[cur]) {
      const next = [...filled, cur];
      setFilled(next);
      setPointer(-1);
      sfx.pop();
      if (next.length === q.blanks.length) onAnswer(true);
      else void speak(String(v));
    } else {
      setShake(v);
      setTimeout(() => setShake(null), 500);
      onAnswer(false);
    }
  };

  const choices = nextBlankPos >= 0 ? q.choices[nextBlankPos] : [];

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 overflow-x-auto p-4">
      {q.style === "train" ? (
        <div className="flex items-end gap-1.5">
          <div className="text-6xl leading-none" style={{ transform: q.values[0] === 0 ? "scaleX(-1)" : undefined }}>
            🚂
          </div>
          {q.values.map((v, i) => {
            const blank = q.blanks.includes(i) && !filled.includes(i);
            const active = i === cur || i === pointer;
            return (
              <motion.div
                key={i}
                animate={active ? { y: [0, -6, 0] } : { y: 0 }}
                transition={{ repeat: active ? Infinity : 0, duration: 0.8 }}
                className="flex flex-col items-center"
              >
                <div
                  className={`grid h-16 w-14 place-items-center rounded-xl border-4 text-3xl font-extrabold shadow-md sm:h-[4.5rem] sm:w-16 ${
                    blank
                      ? active
                        ? "border-orange-500 bg-orange-100 text-orange-500"
                        : "border-dashed border-sky-400 bg-white text-sky-300"
                      : filled.includes(i)
                        ? "border-green-500 bg-green-100 text-green-700"
                        : i === pointer
                          ? "border-orange-400 bg-yellow-100"
                          : "border-sky-400 bg-sky-200"
                  }`}
                >
                  {blank ? (active ? "?" : "…") : v}
                </div>
                <div className="-mt-1 flex gap-2">
                  <span className="h-3.5 w-3.5 rounded-full bg-slate-700" />
                  <span className="h-3.5 w-3.5 rounded-full bg-slate-700" />
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="relative flex items-start gap-1 pt-6">
          <div className="absolute left-0 right-0 top-6 h-1 rounded bg-amber-700/60" />
          {q.values.map((v, i) => {
            const blank = q.blanks.includes(i) && !filled.includes(i);
            const active = i === cur || i === pointer;
            const dy = Math.sin((i / (q.values.length - 1)) * Math.PI) * 26;
            return (
              <motion.div
                key={i}
                animate={active ? { rotate: [0, -6, 6, 0] } : { rotate: 0 }}
                transition={{ repeat: active ? Infinity : 0, duration: 0.8 }}
                style={{ marginTop: dy, background: blank && !active ? "#fff" : FLAG_COLORS[i % FLAG_COLORS.length], clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)" }}
                className={`grid h-24 w-14 place-items-start justify-center pt-3 text-3xl font-extrabold shadow-md sm:w-16 ${
                  active ? "outline outline-4 outline-orange-500" : ""
                } ${filled.includes(i) ? "text-green-900" : "text-slate-800"}`}
              >
                {blank ? (active ? "?" : "…") : v}
              </motion.div>
            );
          })}
        </div>
      )}

      {cur >= 0 && (
        <div className="flex gap-4">
          {choices.map((v) => (
            <motion.button
              key={`${cur}-${v}`}
              disabled={locked || hint === 3}
              onClick={() => tap(v)}
              animate={shake === v ? { opacity: [1, 0.45, 1] } : {}}
              className="btn btn-blue !h-24 !w-24 !text-5xl"
            >
              {v}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
