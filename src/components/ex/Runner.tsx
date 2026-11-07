"use client";
import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import type { Question, Spec } from "@/content/types";
import { easier, generate } from "@/content/generate";
import { afterSpeech, speak, useCaption } from "@/lib/speech";
import { sfx } from "@/lib/sfx";
import { wait } from "@/lib/vn";
import { useProgress, type Resume, type Support } from "@/lib/store";
import { useSettings } from "@/lib/settings";
import { usePause } from "@/lib/pause";
import { isTimeUp } from "@/lib/session";
import { KID } from "@/lib/kid";
import { methodFor } from "@/content/methods";
import { setMethodStep } from "@/lib/method";
import { MethodBar } from "../MethodBar";
import type { ExProps, Hint } from "./common";
import { ChooseEx } from "./ChooseEx";
import { SequenceEx } from "./SequenceEx";
import { MatchEx } from "./MatchEx";
import { AdjustEx } from "./AdjustEx";
import { BasketEx } from "./BasketEx";
import { ColorEx } from "./ColorEx";
import { ReadEx } from "./ReadEx";
import { SelectEx } from "./SelectEx";
import { PairEx } from "./PairEx";
import { SpellEx } from "./SpellEx";
import { TraceEx } from "./TraceEx";

/** Picks the renderer for a question. */
export function Exercise(p: ExProps) {
  switch (p.q.type) {
    case "choose":
      return <ChooseEx {...(p as ExProps<typeof p.q>)} />;
    case "sequence":
      return <SequenceEx {...(p as ExProps<typeof p.q>)} />;
    case "match":
      return <MatchEx {...(p as ExProps<typeof p.q>)} />;
    case "adjust":
      return <AdjustEx {...(p as ExProps<typeof p.q>)} />;
    case "basket":
      return <BasketEx {...(p as ExProps<typeof p.q>)} />;
    case "color":
      return <ColorEx {...(p as ExProps<typeof p.q>)} />;
    case "read":
      return <ReadEx {...(p as ExProps<typeof p.q>)} />;
    case "select":
      return <SelectEx {...(p as ExProps<typeof p.q>)} />;
    case "pair":
      return <PairEx {...(p as ExProps<typeof p.q>)} />;
    case "spell":
      return <SpellEx {...(p as ExProps<typeof p.q>)} />;
    case "trace":
      return <TraceEx {...(p as ExProps<typeof p.q>)} />;
  }
}

export function starsFor(score: number, total: number) {
  const r = score / total;
  return r >= 0.9 ? 3 : r >= 0.6 ? 2 : 1;
}

/** The same praise every time, so the child knows exactly what a right answer sounds like. */
export const praiseLine = () => `Đúng rồi! ${KID.name} giỏi lắm.`;

/** Wrong-answer lines always start the same way. */
const wrongLine = (s: string) => (s.startsWith("Chưa đúng") ? s : `Chưa đúng. ${s}`);

/**
 * Runs a list of Specs.
 *
 * Help the bear gives (prompting, from most to least, faded as the child succeeds):
 *   - Start of a question: by the kind's support level — 2: light step 1 and say it · 1: light step 1 · 0: nothing.
 *   - No tap for `autoHintSec`: 1st time say step 1 (or the question again) · 2nd time the counting help (hint 2).
 *     This is not a mistake: no "Chưa đúng", no sound, nothing logged.
 * After a wrong answer:
 *   wrong #1 → "Chưa đúng. Mình làm lại từ bước 1" · wrong #2 → the bear solves it step by step (hint 3),
 *   then one easier, similar question with full help (not scored), so the child ends on a success.
 * A question scores only when it was answered with no wrong taps; help without a mistake never costs anything.
 */
export function Runner({
  itemId,
  specs,
  mode,
  startAt,
  onDone,
  onTimeUp,
}: {
  itemId: string;
  specs: Spec[];
  mode: "practice" | "worksheet";
  startAt?: Resume;
  onDone: (stars: number) => void;
  onTimeUp: () => void;
}) {
  const { logMistake, logAttempt, setSupport, saveResume } = useProgress.getState();
  const celebrate = useSettings((s) => s.celebrate);
  const autoHintSec = useSettings((s) => s.autoHintSec);
  const paused = usePause((s) => s.paused);
  const speaking = useCaption((s) => s.speaking);
  const score = useRef(startAt?.score ?? 0);
  const [done, setDone] = useState(startAt?.done ?? 0);
  const [q, setQ] = useState<Question>(() => generate(specs[startAt?.done ?? 0]));
  const [si, setSi] = useState(startAt?.done ?? 0); // index of the spec the current question came from
  const [extra, setExtra] = useState(false); // current question is extra practice
  const [hint, setHint] = useState<Hint>(0);
  const [locked, setLocked] = useState(false);
  const [idle, setIdle] = useState(0); // idle hints given on this question
  const [lastTap, setLastTap] = useState(0);
  const wrongs = useRef(0);
  const help = useRef(0);
  const spec = specs[Math.min(si, specs.length - 1)];
  const method = methodFor(spec);
  const revealAt = q.type === "trace" ? 3 : 2; // tracing strays are not real mistakes, allow more

  // Start of each question: no step lit, then the help this kind still needs.
  useEffect(() => {
    setMethodStep(-1);
    wrongs.current = 0;
    const level: Support = extra ? 2 : (useProgress.getState().support[spec.kind] ?? 2);
    help.current = method ? level : 0;
    if (!method || level === 0) return;
    let alive = true;
    (async () => {
      await wait(150);
      await afterSpeech(); // let the question be read first
      if (!alive || wrongs.current > 0) return;
      setMethodStep(0);
      if (level === 2) await speak(`Bước 1: ${method[0].text}.`);
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q.uid]);

  // Idle help: the child has not tapped for a while (only when the bear is quiet and no break).
  useEffect(() => {
    if (!autoHintSec || locked || paused || speaking || hint >= 3 || idle >= 2) return;
    const t = setTimeout(() => {
      const next = idle + 1;
      setIdle(next);
      help.current = Math.max(help.current, next === 1 ? 2 : 3);
      if (next === 1) {
        if (method) {
          setMethodStep(0);
          void speak(`Mình làm bước 1: ${method[0].text}.`);
        } else void speak(q.say ?? q.prompt, { caption: q.prompt });
      } else if (hint < 2) setHint(2);
    }, autoHintSec * 1000);
    return () => clearTimeout(t);
  }, [autoHintSec, locked, paused, speaking, hint, idle, lastTap, method, q]);

  const advance = (practice: Question | null, finishedScored: boolean) => {
    const nextDone = done + (finishedScored ? 1 : 0);
    setDone(nextDone);
    setHint(0);
    setIdle(0);
    setLocked(false);
    if (practice) {
      setQ(practice);
      setExtra(true);
      return;
    }
    setExtra(false);
    if (nextDone >= specs.length) {
      onDone(starsFor(score.current, specs.length));
      return;
    }
    setSi(nextDone);
    saveResume(itemId, { done: nextDone, score: score.current });
    // Time is up: stop between questions, never in the middle of one.
    if (isTimeUp()) {
      onTimeUp();
      return;
    }
    setQ(generate(specs[nextDone]));
  };

  /** Records the finished question and fades (or raises) the help for this kind. */
  const record = () => {
    if (extra) return;
    logAttempt({ item: itemId, kind: spec.kind, wrongs: wrongs.current, help: help.current });
    const cur = useProgress.getState().support[spec.kind] ?? 2;
    const next = (wrongs.current > 0 ? Math.min(2, cur + 1) : Math.max(0, cur - 1)) as Support;
    setSupport(spec.kind, next);
  };

  const onAnswer = async (correct: boolean, customHint?: string, reveal?: boolean) => {
    if (locked) return;
    if (correct) {
      setLocked(true);
      sfx.ding();
      if (celebrate) void confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 }, scalar: 1.1 });
      if (wrongs.current === 0 && !extra) score.current++;
      record();
      await speak(praiseLine());
      await wait(250);
      advance(null, !extra);
      return;
    }
    sfx.soft();
    if (wrongs.current === 0 && !extra) logMistake({ item: itemId, kind: spec.kind });
    wrongs.current++;
    const next = (reveal || wrongs.current >= revealAt ? 3 : Math.max(hint, Math.min(2, wrongs.current))) as Hint;
    if (next === 3) {
      setLocked(true);
      record();
    }
    setHint(next);
    if (next < 3) {
      if (customHint) void speak(wrongLine(customHint));
      else if (method) {
        // Point to one step only (not the whole list): start again from step 1.
        setMethodStep(0);
        void speak(`Chưa đúng. Mình làm lại từ bước 1: ${method[0].text}.`);
      } else void speak("Chưa đúng. Con thử lại nhé.");
    } else void speak("Chưa đúng. Gấu làm cùng con nhé.");
  };

  const onRevealDone = () => {
    // After the bear solved it: one easier question of the same kind, with full help.
    const practice = extra ? null : generate(easier(spec));
    advance(practice, !extra);
  };

  const total = specs.length;
  const shown = Math.min(done + 1, total);
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center justify-center gap-2 py-2">
        {/* First–Then: what I do now, and what comes after. */}
        <span className="chip text-lg" aria-label={`Trước tiên làm ${total} câu, sau đó chọn sticker`}>
          ✏️ Làm {total} câu <span aria-hidden>→</span> 🎁 Chọn sticker
        </span>
        <span className="chip text-xl">
          {mode === "worksheet" ? "📝 " : ""}Câu {shown}/{total}
        </span>
        <div className="flex items-center gap-1.5" aria-hidden>
          {specs.map((_, i) => (
            <div
              key={i}
              className={`h-5 w-5 rounded-full border-4 border-white shadow ${i < done ? "bg-yellow-400" : i === done ? "bg-orange-400 ring-2 ring-orange-300" : "bg-white/50"}`}
            />
          ))}
        </div>
        {extra && <span className="chip text-lg">🔁 Luyện thêm</span>}
      </div>
      {method && <MethodBar steps={method} />}
      <div className="relative min-h-0 flex-1" onPointerDownCapture={() => setLastTap(Date.now())}>
        <Exercise key={q.uid} q={q} hint={hint} locked={locked} onAnswer={onAnswer} onRevealDone={onRevealDone} />
      </div>
    </div>
  );
}
