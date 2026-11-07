"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { ChooseQ, WalkStep } from "@/content/types";
import { speak } from "@/lib/speech";
import { sfx } from "@/lib/sfx";
import { wait } from "@/lib/vn";
import { setMethodStep } from "@/lib/method";
import { GroupView, PictureView, groupsOf, usePrompt, type ExProps } from "./common";

const LETTERS = ["A", "B", "C", "D"];

/** Multiple choice: A/B/C numbers, big buttons (Đ/S, signs), or picture cards. */
export function ChooseEx({ q, hint, locked, onAnswer, onRevealDone }: ExProps<ChooseQ>) {
  const [wrong, setWrong] = useState<number[]>([]);
  const [right, setRight] = useState(false);
  const [counted, setCounted] = useState<number[]>([]);
  const [optCounted, setOptCounted] = useState(false);
  const [walkFill, setWalkFill] = useState(false);
  const [labels, setLabels] = useState(false); // show the written word under picture cards
  const [focus, setFocus] = useState<number | null>(null); // option the bear is talking about
  const [crossed, setCrossed] = useState(false); // phép trừ: crossed-out items shown (always shown when pictures are visible)
  const prompt = usePrompt(q);

  useEffect(() => {
    if (hint < 2) return;
    let alive = true;
    (async () => {
      await prompt.current;
      if (!alive) return;
      // Step-by-step walkthrough: light up each method step, show it on screen, then say it.
      if (hint === 3 && q.walk) {
        setCounted([]);
        for (let si = 0; si < q.walk.length; si++) {
          if (!alive) return;
          const w: WalkStep = q.walk[si];
          setMethodStep(w.step ?? si);
          if (w.labels) setLabels(true);
          setFocus(w.focus ?? null);
          if (w.show) setCounted(w.show);
          if (w.cross) setCrossed(true);
          if (w.count !== undefined) {
            const gi = w.count;
            const n = groupsOf(q.picture)[gi]?.n ?? 0;
            for (let i = 1; i <= n && alive; i++) {
              setCounted((prev) => {
                const next = [...prev];
                next[gi] = i;
                return next;
              });
              sfx.tap();
              await speak(String(i));
            }
            if (!alive) return;
          }
          if (w.fill) setWalkFill(true);
          await speak(w.say, { caption: w.caption });
          await wait(500);
        }
        if (alive) onRevealDone();
        return;
      }
      const c = q.count;
      if (c?.mode === "focus") {
        const n = groupsOf(q.picture)[c.group]?.n ?? 0;
        for (let i = 1; i <= n && alive; i++) {
          setCounted((prev) => {
            const next = [...prev];
            next[c.group] = i;
            return next;
          });
          sfx.tap();
          await speak(String(i));
        }
      } else if (q.picture?.kind === "legend") {
        setCounted([1]);
      } else if (c?.mode === "all") {
        setCounted(groupsOf(q.picture).map((g) => g.n));
        setCrossed(true);
        if (q.picture?.kind === "expr") setCounted([99]);
        if (q.picture?.kind === "dice") setCounted([q.picture.n]);
        setOptCounted(true);
      }
      if (!alive) return;
      if (hint === 2) {
        if (q.options.some((o) => o.label)) setLabels(true);
        await speak(q.hint2);
      } else {
        await speak(q.reveal);
        await wait(700);
        if (alive) onRevealDone();
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hint]);

  const choose = (i: number) => {
    if (i === q.answer) {
      setRight(true);
      onAnswer(true);
    } else {
      const nextWrong = [...wrong, i];
      setWrong(nextWrong);
      // If only the right option is left, skip ahead to the walkthrough so the child still learns why.
      onAnswer(false, undefined, nextWrong.length >= q.options.length - 1);
    }
  };

  const disabled = (i: number) => locked || wrong.includes(i) || hint === 3 || right;
  const revealed = right || (hint === 3 && (!q.walk || walkFill));
  const glow = (i: number) => i === q.answer && revealed;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 overflow-y-auto p-4">
      {q.picture && (
        <PictureView
          p={q.picture}
          counted={counted}
          fill={revealed ? q.options[q.answer].text : undefined}
          revealed={revealed}
          crossed={crossed || !("hidden" in q.picture && q.picture.hidden)}
        />
      )}

      {q.style === "cards" ? (
        <div className="flex flex-wrap items-stretch justify-center gap-4">
          {q.options.map((o, i) => (
            <motion.button
              key={i}
              disabled={disabled(i)}
              onClick={() => choose(i)}
              animate={wrong.includes(i) ? { opacity: [1, 0.45, 1] } : glow(i) ? { scale: [1, 1.08, 1.04] } : {}}
              transition={{ duration: 0.45 }}
              className={`relative grid min-h-36 min-w-40 place-items-center rounded-[2rem] border-b-8 p-4 pt-8 shadow-xl ${
                glow(i)
                  ? "border-green-600 bg-green-100 ring-8 ring-yellow-300"
                  : focus === i
                    ? "border-orange-400 bg-orange-50 ring-8 ring-orange-300"
                    : wrong.includes(i)
                      ? "border-slate-300 bg-slate-100 opacity-50"
                      : "border-sky-300 bg-white"
              }`}
            >
              {q.options.length <= 4 && (
                <span className="absolute left-3 top-2 text-2xl font-extrabold text-sky-700">{LETTERS[i]}.</span>
              )}
              {o.groups?.map((g, gi) => (
                <GroupView key={gi} g={g} size={g.n === 1 ? "text-7xl" : "text-4xl"} counted={optCounted && g.n > 1 ? g.n : 0} />
              ))}
              {labels && o.label && <span className="mt-1 text-3xl font-extrabold text-sky-800">{o.label}</span>}
              {!o.groups && o.text && <span className="text-4xl font-extrabold text-sky-900">{o.text}</span>}
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-4">
          {q.options.map((o, i) => (
            <motion.button
              key={i}
              disabled={disabled(i)}
              onClick={() => choose(i)}
              animate={wrong.includes(i) ? { opacity: [1, 0.45, 1] } : glow(i) ? { scale: [1, 1.15, 1.05] } : {}}
              transition={{ duration: 0.45 }}
              className={`btn !min-h-24 !min-w-28 ${q.style === "abc" ? "!text-5xl" : (o.text?.length ?? 0) > 3 ? "!text-3xl" : "!text-6xl"} ${
                glow(i) ? "btn-green !opacity-100 ring-8 ring-yellow-300" : wrong.includes(i) ? "btn-white opacity-50" : "btn-blue"
              } ${focus === i && !glow(i) ? "ring-8 ring-orange-300" : ""}`}
            >
              {q.style === "abc" && <span className="text-3xl opacity-80">{LETTERS[i]}.</span>}
              {o.text}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
