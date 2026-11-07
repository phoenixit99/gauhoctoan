"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { Group, Picture, Question, WalkStep } from "@/content/types";
import { speak } from "@/lib/speech";
import { setMethodStep } from "@/lib/method";
import { wait } from "@/lib/vn";
import { Emo } from "./Emo";

export type Hint = 0 | 1 | 2 | 3; // 0 none · 1 voice nudge · 2 help counting · 3 show answer

export type ExProps<Q extends Question = Question> = {
  q: Q;
  hint: Hint;
  locked: boolean;
  onAnswer: (correct: boolean, customHint?: string, reveal?: boolean) => void;
  onRevealDone: () => void;
};

/** Speaks the question once on mount; returns a promise ref so hints can wait for it. */
export function usePrompt(q: Question) {
  const ref = useRef<Promise<void>>(Promise.resolve());
  useEffect(() => {
    ref.current = speak(q.say ?? q.prompt, { caption: q.prompt });
  }, [q]);
  return ref;
}

export function Badge({ n }: { n: number }) {
  return (
    <span className="absolute -right-2 -top-3 z-10 grid h-7 w-7 place-items-center rounded-full bg-orange-500 text-base font-extrabold leading-none text-white shadow">
      {n}
    </span>
  );
}

function Item({ emoji, badge, size, delay, gone }: { emoji: string; badge?: number; size: string; delay: number; gone?: boolean }) {
  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: badge ? 1.12 : 1 }}
      transition={{ type: "spring", bounce: 0.5, delay }}
      className={`relative inline-grid w-[1.25em] place-items-center leading-none ${size}`}
    >
      <span className={gone ? "opacity-50" : ""}>
        <Emo e={emoji} />
      </span>
      {gone && (
        <span className="absolute inset-0 grid place-items-center text-[0.9em] font-black text-slate-600/80" aria-label="gạch bớt">
          ✗
        </span>
      )}
      {badge !== undefined && <Badge n={badge} />}
    </motion.span>
  );
}

/** A group of identical items in rows of 5 (like a ten-frame), with optional count badges. `crossed`: show the `gone` items crossed out. */
export function GroupView({ g, counted = 0, size = "text-5xl", crossed = true }: { g: Group; counted?: number; size?: string; crossed?: boolean }) {
  const gone = crossed ? (g.gone ?? 0) : 0;
  return (
    <div className="flex max-w-[20em] flex-wrap justify-center gap-x-2 gap-y-3" style={{ fontSize: "inherit" }}>
      {Array.from({ length: g.n }, (_, i) => (
        <Item key={i} emoji={g.emoji} size={size} badge={i < counted ? i + 1 : undefined} delay={counted ? 0 : i * 0.04} gone={i >= g.n - gone} />
      ))}
    </div>
  );
}

/** A number, a sign or a blank in an equation line. */
function EqPart({ part, fill }: { part: string | number; fill?: string }) {
  if (part === "☐")
    return (
      <span
        className={`grid h-20 min-w-20 place-items-center rounded-2xl px-2 ${
          fill !== undefined ? "border-4 border-green-500 bg-green-100 text-green-700" : "border-4 border-dashed border-orange-400 bg-orange-50 text-orange-400"
        }`}
      >
        {fill ?? "?"}
      </span>
    );
  return <span className="px-1">{part}</span>;
}

/** Boxes of pictures (one per group) shown above an equation or a bond. Hidden groups appear once counted. */
function GroupBoxes({ groups, counted, hidden, crossed }: { groups: Group[]; counted: number[]; hidden?: boolean; crossed: boolean }) {
  const visible = groups.map((_, gi) => !hidden || counted[gi] !== undefined);
  if (!visible.some(Boolean)) return null;
  return (
    <div className="flex flex-wrap items-stretch justify-center gap-3">
      {groups.map((g, gi) =>
        visible[gi] ? (
          <div key={gi} className="grid min-w-32 place-items-center rounded-3xl border-4 border-dashed border-sky-300 bg-white/90 p-3 shadow-md">
            <GroupView g={g} counted={counted[gi] ?? 0} size="text-4xl" crossed={crossed} />
          </div>
        ) : null,
      )}
    </div>
  );
}

/**
 * counted[i] = how many items of group i show a number badge. `fill` = text for the blank once answered.
 * `revealed` = the answer is shown (for pictures whose answer is not text). `crossed` = crossed-out items are shown.
 */
export function PictureView({ p, counted, fill, revealed, crossed = true }: { p: Picture; counted: number[]; fill?: string; revealed?: boolean; crossed?: boolean }) {
  if (p.kind === "eq") {
    return (
      <div className="flex flex-col items-center gap-5">
        {p.groups && <GroupBoxes groups={p.groups} counted={counted} hidden={p.hidden} crossed={crossed} />}
        <div className="flex flex-wrap items-center justify-center gap-2 rounded-3xl bg-white px-6 py-3 text-6xl font-extrabold shadow-lg">
          {p.parts.map((part, i) => (
            <EqPart key={i} part={part} fill={fill} />
          ))}
        </div>
      </div>
    );
  }

  if (p.kind === "bond") {
    const node = (v: number | "☐", big?: boolean) => (
      <div
        className={`grid place-items-center rounded-full font-extrabold shadow-lg ${big ? "h-24 w-24 text-5xl" : "h-20 w-20 text-4xl"} ${
          v === "☐" ? (fill !== undefined ? "border-4 border-green-500 bg-green-100 text-green-700" : "border-4 border-dashed border-orange-400 bg-orange-50 text-orange-400") : big ? "bg-amber-100" : "bg-white"
        }`}
      >
        {v === "☐" ? (fill ?? "?") : v}
      </div>
    );
    return (
      <div className="flex flex-col items-center gap-4">
        {p.groups && <GroupBoxes groups={p.groups} counted={counted} hidden={p.hidden} crossed={crossed} />}
        <div className="flex flex-col items-center">
          {node(p.whole, true)}
          <svg width="200" height="44" viewBox="0 0 200 44" aria-hidden>
            <line x1="100" y1="2" x2="40" y2="42" stroke="#5d4037" strokeWidth="4" strokeLinecap="round" />
            <line x1="100" y1="2" x2="160" y2="42" stroke="#5d4037" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <div className="flex gap-16">
            {node(p.parts[0])}
            {node(p.parts[1])}
          </div>
        </div>
      </div>
    );
  }

  if (p.kind === "pattern") {
    return (
      <div className="flex max-w-full flex-wrap items-center justify-center gap-2 rounded-3xl bg-white px-4 py-4 text-6xl shadow-lg">
        {p.items.map((it, i) =>
          i === p.ask ? (
            <span
              key={i}
              className={`grid h-20 w-20 place-items-center rounded-2xl ${revealed ? "border-4 border-green-500 bg-green-100" : "border-4 border-dashed border-orange-400 bg-orange-50 text-5xl font-extrabold text-orange-400"}`}
            >
              {revealed ? <Emo e={p.answer} /> : "?"}
            </span>
          ) : (
            <span key={i} className={`grid h-20 w-20 place-items-center ${counted[0] !== undefined && i < (counted[0] ?? 0) ? "rounded-2xl ring-4 ring-orange-300" : ""}`}>
              <Emo e={it} />
            </span>
          ),
        )}
      </div>
    );
  }

  if (p.kind === "sentence") {
    const [a, b] = p.text.split("…");
    return (
      <div className="flex flex-col items-center gap-4">
        {p.emoji && <div className="grid h-36 w-36 place-items-center rounded-[2rem] bg-white text-8xl shadow-lg">{p.emoji}</div>}
        <div className="flex max-w-3xl flex-wrap items-center justify-center gap-x-2 gap-y-3 rounded-3xl bg-white px-6 py-4 text-4xl font-extrabold leading-snug text-sky-950 shadow-lg">
          <span>{a}</span>
          <span
            className={`grid min-h-16 min-w-32 place-items-center rounded-2xl px-3 ${
              fill !== undefined ? "border-4 border-green-500 bg-green-100 text-green-700" : "border-4 border-dashed border-orange-400 bg-orange-50 text-orange-400"
            }`}
          >
            {fill ?? "…"}
          </span>
          {b && <span>{b}</span>}
        </div>
      </div>
    );
  }

  if (p.kind === "expr") {
    // Hint: a tower of blocks above each number (counted[0] = how many numbers have their tower).
    // Towers share one baseline, so the taller tower is the bigger number.
    const shown = counted[0] ?? 0;
    let numIdx = 0;
    return (
      <div className="flex items-end justify-center gap-4">
        {p.parts.map((part, i) => {
          const isBlank = part === "☐";
          const isNum = typeof part === "number";
          const tower = isNum && ++numIdx <= shown;
          return (
            <div key={i} className="flex flex-col items-center gap-2">
              {tower && (
                <div className="flex flex-col-reverse items-center gap-0.5">
                  {Array.from({ length: part }, (_, k) => (
                    <motion.span
                      key={k}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: k * 0.06 }}
                      className="h-3.5 w-12 rounded-sm bg-orange-400 shadow-sm"
                    />
                  ))}
                  {part === 0 && <span className="text-sm font-bold text-orange-500">không có khối</span>}
                </div>
              )}
              <div
                className={`grid h-24 min-w-24 place-items-center rounded-3xl px-3 text-6xl font-extrabold shadow-lg ${
                  isBlank && fill ? "border-4 border-green-500 bg-green-100 text-green-700" : isBlank ? "border-4 border-dashed border-orange-400 bg-orange-50 text-orange-400" : "bg-white"
                }`}
              >
                {isBlank ? (fill ?? "?") : part}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (p.kind === "dice") return <Dice n={p.n} counted={counted[0] ?? 0} />;

  if (p.kind === "card") {
    return (
      <div className="flex flex-col items-center gap-3">
        {p.emoji && <div className="grid h-40 w-40 place-items-center rounded-[2rem] bg-white text-8xl shadow-lg">{p.emoji}</div>}
        {p.parts && (
          <div className="flex items-end text-6xl font-extrabold">
            {p.parts.map((part, i) =>
              part === "☐" ? (
                <span
                  key={i}
                  className={`relative mx-1 grid h-20 min-w-20 place-items-center rounded-2xl px-2 ${
                    fill ? "border-4 border-green-500 bg-green-100 text-green-700" : "border-4 border-dashed border-orange-400 bg-orange-50 text-orange-400"
                  }`}
                >
                  {fill ? p.answer : "?"}
                  {p.mark && !fill && (
                    <span
                      className={`absolute left-1/2 -translate-x-1/2 text-4xl text-slate-500 ${p.mark.includes("\u0323") ? "-bottom-12" : "-top-12"}`}
                      aria-label="dấu của tiếng này"
                    >
                      {p.mark}
                    </span>
                  )}
                </span>
              ) : (
                <span key={i} className="whitespace-pre">
                  {part}
                </span>
              ),
            )}
          </div>
        )}
      </div>
    );
  }

  if (p.kind === "legend") {
    const hl = counted.length > 0;
    return (
      <div className="flex flex-col items-center gap-5">
        <div className="flex flex-wrap justify-center gap-3">
          {p.items.map((it) => (
            <div
              key={it.num}
              className={`flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-2xl font-extrabold shadow-md ${hl && it.num === p.ask ? "scale-110 ring-4 ring-orange-400" : ""}`}
            >
              <span>Số {it.num}:</span>
              <span className="h-7 w-7 rounded-full border-2 border-white shadow" style={{ background: it.color }} />
              <span>{it.label}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <div className="grid h-24 w-24 place-items-center rounded-3xl bg-white text-6xl font-extrabold shadow-lg">{p.ask}</div>
          <span className="text-5xl">→</span>
          <div className="grid h-24 w-24 place-items-center rounded-full border-4 border-dashed border-orange-400 bg-white text-5xl text-orange-400">?</div>
        </div>
      </div>
    );
  }

  if (p.kind === "rows") {
    return (
      <div className="flex flex-col gap-4">
        {p.groups.map((g, gi) => (
          <div key={gi} className={`flex min-h-20 min-w-40 gap-2 rounded-3xl px-4 py-3 shadow-md ${g.n === 0 ? "border-4 border-dashed border-sky-300 bg-white/60" : "bg-white/90"}`}>
            {Array.from({ length: g.n }, (_, i) => (
              <Item key={i} emoji={g.emoji} size="text-5xl" badge={i < (counted[gi] ?? 0) ? i + 1 : undefined} delay={i * 0.04} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (p.kind === "side") {
    return (
      <div className="flex items-stretch gap-4">
        {p.groups.map((g, gi) => (
          <div key={gi} className="grid min-w-40 place-items-center rounded-3xl border-4 border-dashed border-sky-300 bg-white/90 p-4 shadow-md">
            <GroupView g={g} counted={counted[gi] ?? 0} size="text-4xl" />
          </div>
        ))}
      </div>
    );
  }

  // scene: one mixed box
  if (p.kind !== "scene") return null;
  const seen = p.groups.map(() => 0);
  return (
    <div className="flex max-w-[34rem] flex-wrap justify-center gap-x-3 gap-y-4 rounded-[2rem] bg-gradient-to-b from-sky-100 to-green-100 p-5 shadow-md">
      {p.order.map((gi, i) => {
        const k = seen[gi]++;
        return (
          <Item key={i} emoji={p.groups[gi].emoji} size="text-5xl" badge={k < (counted[gi] ?? 0) ? k + 1 : undefined} delay={i * 0.03} />
        );
      })}
    </div>
  );
}

export const groupsOf = (p?: Picture): Group[] =>
  p && (p.kind === "rows" || p.kind === "side" || p.kind === "scene") ? p.groups : p && (p.kind === "eq" || p.kind === "bond") ? (p.groups ?? []) : [];

/**
 * Plays a step-by-step walkthrough: lights up the method step, lets the renderer show the step
 * on screen (`show`), says it, then lets the renderer act (`act`, e.g. draw a line). Stops when `alive()` is false.
 */
export async function playWalk(
  walk: WalkStep[],
  alive: () => boolean,
  show?: (w: WalkStep, i: number) => void,
  act?: (w: WalkStep, i: number) => void | Promise<void>,
) {
  for (let i = 0; i < walk.length; i++) {
    if (!alive()) return false;
    const w = walk[i];
    setMethodStep(w.step ?? i);
    show?.(w, i);
    await speak(w.say, { caption: w.caption });
    if (!alive()) return false;
    await act?.(w, i);
    await wait(450);
  }
  return alive();
}

// Dot positions on a 3×3 grid for dice faces 1–6 (row, col).
const FACES: [number, number][][] = [
  [],
  [[1, 1]],
  [[0, 0], [2, 2]],
  [[0, 0], [1, 1], [2, 2]],
  [[0, 0], [0, 2], [2, 0], [2, 2]],
  [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
  [[0, 0], [1, 0], [2, 0], [0, 2], [1, 2], [2, 2]],
];

/** Dots like a dice face (numbers above 6 use two faces: 5 + rest). */
export function Dice({ n, counted = 0 }: { n: number; counted?: number }) {
  const faces = n <= 6 ? [n] : [5, n - 5];
  let k = 0;
  return (
    <div className="flex gap-4">
      {faces.map((f, fi) => (
        <div key={fi} className="grid h-40 w-40 grid-cols-3 grid-rows-3 gap-1 rounded-[2rem] bg-sky-600 p-4 shadow-xl">
          {Array.from({ length: 9 }, (_, cell) => {
            const on = FACES[f].some(([r, c]) => r * 3 + c === cell);
            const badge = on ? ++k : 0;
            return (
              <div key={cell} className="relative grid place-items-center">
                {on && <span className="h-8 w-8 rounded-full bg-white shadow-inner" />}
                {on && badge <= counted && <Badge n={badge} />}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
