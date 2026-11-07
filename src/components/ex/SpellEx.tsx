"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { SpellQ } from "@/content/types";
import { speak } from "@/lib/speech";
import { sfx } from "@/lib/sfx";
import { spellSyl, tileTone, withTone } from "@/content/tv/words";
import { playWalk, usePrompt, type ExProps } from "./common";

/** Picked tiles so far: picks[s][k] = tile index for syllable s, slot k (0 âm đầu · 1 âm thứ hai · 2 dấu). */
type Picks = number[][];

/** What the child has built so far for one syllable, e.g. "b_" → "bê" → "bế". */
function built(q: SpellQ, s: number, picks: number[]): string {
  const [on, vo, to] = q.syllables[s].slots;
  const onset = picks[0] !== undefined ? on.tiles[picks[0]] : "_";
  if (picks[1] === undefined) return onset + "_";
  const vowel = vo.tiles[picks[1]];
  return onset + (picks[2] !== undefined ? withTone(vowel, tileTone(to.tiles[picks[2]])) : vowel);
}

/** Ghép tiếng: for each tiếng, choose âm đầu → âm thứ hai → dấu, in that fixed order. */
export function SpellEx({ q, hint, locked, onAnswer, onRevealDone }: ExProps<SpellQ>) {
  const [picks, setPicks] = useState<Picks>(() => q.syllables.map(() => []));
  const [shake, setShake] = useState<number | null>(null);
  const picksRef = useRef(picks);
  useEffect(() => {
    picksRef.current = picks;
  }, [picks]);
  const prompt = usePrompt(q);

  // Where we are: first syllable that is not complete, and its next slot.
  const pos = (p: Picks) => {
    const s = p.findIndex((x) => x.length < 3);
    return s < 0 ? null : { s, k: p[s].length };
  };
  const at = pos(picks);

  const choose = (tile: number) => {
    setPicks((prev) => {
      const cur = pos(prev);
      if (!cur) return prev;
      const next = prev.map((x) => [...x]);
      next[cur.s].push(tile);
      return next;
    });
  };

  useEffect(() => {
    if (hint < 2) return;
    let alive = true;
    (async () => {
      await prompt.current;
      if (hint === 2) {
        const cur = pos(picksRef.current) ?? { s: 0, k: 0 };
        await speak(`Đánh vần: ${spellSyl(q.syllables[cur.s].text)}.`, { caption: `Đánh vần: ${q.syllables[cur.s].text}` });
        return;
      }
      setPicks(q.syllables.map(() => []));
      const ok = await playWalk(q.walk ?? [], () => alive, undefined, (w) => {
        if (w.pick !== undefined) {
          sfx.pop();
          choose(w.pick);
        }
      });
      if (ok) onRevealDone();
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hint]);

  const tap = (tile: number) => {
    if (locked || hint === 3 || !at) return;
    const slot = q.syllables[at.s].slots[at.k];
    if (tile !== slot.answer) {
      setShake(tile);
      setTimeout(() => setShake(null), 500);
      onAnswer(false, `Chưa đúng. Mình đánh vần lại: ${spellSyl(q.syllables[at.s].text)}.`);
      return;
    }
    sfx.pop();
    const next = picks.map((x) => [...x]);
    next[at.s].push(tile);
    setPicks(next);
    if (!pos(next)) onAnswer(true);
  };

  const slot = at ? q.syllables[at.s].slots[at.k] : null;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 overflow-y-auto p-4">
      {q.emoji && <div className="grid h-32 w-32 place-items-center rounded-[2rem] bg-white text-7xl shadow-lg">{q.emoji}</div>}
      {q.model && (
        <div className="rounded-3xl bg-white px-8 py-3 text-6xl font-extrabold text-sky-900 shadow-lg" aria-label="Chữ mẫu">
          {q.model}
        </div>
      )}

      {/* What the child is building, one box per tiếng; the current one is outlined. */}
      <div className="flex gap-4">
        {q.syllables.map((sy, s) => (
          <div
            key={s}
            className={`grid min-h-24 min-w-28 place-items-center rounded-3xl border-4 px-4 text-6xl font-extrabold ${
              at?.s === s ? "border-orange-400 bg-orange-50" : picks[s].length === 3 ? "border-green-500 bg-green-50 text-green-800" : "border-dashed border-slate-300 bg-white/70"
            }`}
          >
            {built(q, s, picks[s])}
          </div>
        ))}
      </div>

      {slot && (
        <div className="flex flex-col items-center gap-3">
          <div className="chip text-2xl">
            Tiếng {at!.s + 1} · {slot.label}
          </div>
          <div className="flex gap-4">
            {slot.tiles.map((t, i) => (
              <motion.button
                key={`${at!.s}-${at!.k}-${i}`}
                onClick={() => tap(i)}
                disabled={locked || hint === 3}
                animate={shake === i ? { opacity: [1, 0.45, 1] } : {}}
                className={`btn btn-blue !min-h-24 !min-w-28 ${t.length > 3 ? "!text-2xl" : "!text-6xl"}`}
              >
                {t}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
