"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import type { LessonDef, WeekDef } from "@/content/types";
import { generate } from "@/content/generate";
import { worksheetId } from "@/content/weeks";
import { Orchard } from "./three/Orchard";
import { Caption } from "./Caption";
import { Exercise, Runner } from "./ex/Runner";
import { speak, stopSpeech } from "@/lib/speech";
import { sfx } from "@/lib/sfx";
import { wait } from "@/lib/vn";
import { useProgress, type Resume } from "@/lib/store";
import { useSettings } from "@/lib/settings";
import { pickStickers, type Sticker } from "@/content/stickers";
import { KID } from "@/lib/kid";
import { methodFor } from "@/content/methods";
import { setMethodStep } from "@/lib/method";
import { MethodBar } from "./MethodBar";
import { subjectOf } from "@/content/subjects";

type Step = "xem" | "choi" | "thu" | "sao";

// ---------- shared bits ----------

function BigCount({ n }: { n: number }) {
  return (
    <div className="pointer-events-none absolute right-6 top-4">
      <AnimatePresence mode="popLayout">
        {n > 0 && (
          <motion.div
            key={n}
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.6 }}
            className="grid h-28 w-28 place-items-center rounded-full bg-white text-7xl font-extrabold text-orange-500 shadow-xl ring-8 ring-orange-200"
          >
            {n}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Actions({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-[88px] items-center justify-center gap-4 py-2">{children}</div>;
}

// ---------- Xem: the bear demonstrates ----------

/** Orchard lesson: the bear picks 10 apples while counting aloud. */
function OrchardWatch({ onNext, onReplay }: { onNext: () => void; onReplay: () => void }) {
  const [basket, setBasket] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      await wait(400);
      if (!alive) return;
      await speak("Gấu hái táo nào! Con đếm cùng Gấu nhé. Mỗi quả chỉ đếm một lần.");
      for (let i = 0; i < 10 && alive; i++) {
        await wait(250);
        if (!alive) return;
        setBasket((b) => [...b, i]);
        sfx.pop();
        await wait(350);
        if (!alive) return;
        await speak(String(i + 1));
      }
      if (!alive) return;
      await speak("Có tất cả 10 quả táo!", { caption: "Có tất cả 10 quả táo! 🍎" });
      if (alive) setFinished(true);
    })();
    return () => {
      alive = false;
      stopSpeech();
    };
  }, []);

  return (
    <div className="flex h-full flex-col">
      <div className="relative min-h-0 flex-1">
        <Orchard apples={10} basket={basket} bearHappy={finished} />
        <BigCount n={basket.length} />
      </div>
      <Actions>
        {finished && (
          <>
            <button className="btn btn-white" onClick={onReplay}>
              🔄 Xem lại
            </button>
            <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} className="btn btn-orange" onClick={onNext}>
              Tiếp tục ▶
            </motion.button>
          </>
        )}
      </Actions>
    </div>
  );
}

/** Any lesson: show the goal, then the bear solves one example (hint level 3 = full walkthrough). */
function DemoWatch({ lesson, onNext, onReplay }: { lesson: LessonDef; onNext: () => void; onReplay: () => void }) {
  const [phase, setPhase] = useState<"goal" | "demo" | "done">("goal");
  const [q] = useState(() => generate(lesson.demo));
  const method = methodFor(lesson.demo);

  // Goal screen: say the goal, then read the method steps one by one, lighting each up.
  useEffect(() => {
    if (phase !== "goal") return;
    let alive = true;
    setMethodStep(-1);
    (async () => {
      await speak(`Bài hôm nay: ${lesson.title}. ${lesson.goal}`, { caption: lesson.goal });
      if (!method) return;
      await wait(300);
      if (!alive) return;
      await speak(`Mình làm theo ${method.length} bước.`);
      for (let i = 0; i < method.length && alive; i++) {
        setMethodStep(i);
        await speak(`Bước ${i + 1}: ${method[i].text}.`);
        await wait(250);
      }
      if (alive) setMethodStep(-1);
    })();
    return () => {
      alive = false;
      stopSpeech();
      setMethodStep(-1);
    };
  }, [lesson, method, phase]);

  if (phase === "goal") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-6 p-6 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.6 }} className="text-9xl">
          {lesson.icon}
        </motion.div>
        <h2 className="text-5xl font-extrabold text-amber-800">{lesson.title}</h2>
        <p className="max-w-2xl rounded-3xl bg-white/90 px-6 py-4 text-3xl font-bold shadow-md">💡 {lesson.goal}</p>
        {method && <MethodBar steps={method} vertical />}
        <button
          className="btn btn-orange"
          onClick={() => {
            stopSpeech();
            setPhase("demo");
          }}
        >
          👀 Xem Gấu làm mẫu
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex justify-center pt-1">
        <span className="chip text-xl">👀 Gấu làm mẫu</span>
      </div>
      {method && <MethodBar steps={method} />}
      <div className="relative min-h-0 flex-1">
        <Exercise q={q} hint={3} locked onAnswer={() => {}} onRevealDone={() => setPhase("done")} />
      </div>
      <Actions>
        {phase === "done" && (
          <>
            <button className="btn btn-white" onClick={onReplay}>
              🔄 Xem lại
            </button>
            <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} className="btn btn-orange" onClick={onNext}>
              Con tự làm nhé ▶
            </motion.button>
          </>
        )}
      </Actions>
    </div>
  );
}

// ---------- Chơi: free play in 3D ----------

function OrchardPlay({ onNext }: { onNext: () => void }) {
  const [basket, setBasket] = useState<number[]>([]);
  const [reached, setReached] = useState(false);

  useEffect(() => {
    void speak(`Đến lượt ${KID.name}! Chạm vào từng quả táo để hái và đếm nhé.`);
    return () => stopSpeech();
  }, []);

  const tap = (i: number) => {
    const next = basket.includes(i) ? basket.filter((x) => x !== i) : [...basket, i];
    setBasket(next);
    sfx.pop();
    if (next.length === 10) {
      setReached(true);
      void speak("10! Giỏ có 10 quả táo. Đúng rồi!", { caption: "10! Giỏ có 10 quả táo. Đúng rồi! ✅" });
      if (useSettings.getState().celebrate) void confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
    } else if (next.length > 0) {
      void speak(String(next.length));
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="relative min-h-0 flex-1">
        <Orchard apples={10} basket={basket} onTapApple={tap} bearHappy={basket.length === 10} />
        <BigCount n={basket.length} />
      </div>
      <Actions>
        <button
          className="btn btn-white"
          onClick={() => {
            setBasket([]);
            sfx.tap();
            void speak("Mình hái lại từ đầu nhé!");
          }}
        >
          🔄 Hái lại
        </button>
        {reached && (
          <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} className="btn btn-orange" onClick={onNext}>
            Làm bài nhé ▶
          </motion.button>
        )}
      </Actions>
    </div>
  );
}

// ---------- Xong rồi: always the same screen, then the child picks a reward ----------

function DoneStep({ title, onMap, onAgain }: { title: string; onMap: () => void; onAgain: () => void }) {
  const [choices] = useState(() => pickStickers(useProgress.getState().stickers, 3));
  const [got, setGot] = useState<Sticker | "dance" | null>(null);
  const addSticker = useProgress((s) => s.addSticker);

  useEffect(() => {
    sfx.star();
    void speak(`Xong rồi! ${KID.name} làm xong ${title}. Con chọn một phần thưởng nhé.`, { caption: `Xong rồi! Con chọn một phần thưởng 🎁` });
  }, [title]);

  const choose = (c: Sticker | "dance") => {
    if (got) return;
    sfx.pop();
    setGot(c);
    if (c === "dance") void speak("Gấu nhảy cho con xem nhé!");
    else {
      addSticker(c.emoji);
      void speak(`Con chọn sticker ${c.name}. Sticker đã vào bộ sưu tập của con.`);
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 overflow-y-auto p-4">
      <div className="text-8xl" aria-hidden>
        ✅
      </div>
      <h2 className="text-center text-5xl font-extrabold text-amber-800">Xong rồi: {title}</h2>
      {!got && (
        <>
          <div className="chip text-2xl">🎁 Con chọn một phần thưởng</div>
          <div className="flex flex-wrap justify-center gap-4">
            {choices.map((c) => (
              <button key={c.emoji} onClick={() => choose(c)} className="flex min-h-36 min-w-36 flex-col items-center justify-center gap-1 rounded-[2rem] border-b-8 border-sky-300 bg-white p-3 shadow-xl">
                <span className="text-7xl">{c.emoji}</span>
                <span className="text-lg font-extrabold text-sky-800">Sticker</span>
              </button>
            ))}
            <button onClick={() => choose("dance")} className="flex min-h-36 min-w-36 flex-col items-center justify-center gap-1 rounded-[2rem] border-b-8 border-amber-400 bg-white p-3 shadow-xl">
              <span className="text-7xl">🐻</span>
              <span className="text-lg font-extrabold text-amber-800">Gấu nhảy</span>
            </button>
          </div>
        </>
      )}
      {got && (
        <>
          {got === "dance" ? (
            <motion.div
              animate={{ y: [0, -30, 0, -30, 0], rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 1.6, repeat: 2 }}
              className="text-9xl"
            >
              🐻
            </motion.div>
          ) : (
            <div className="grid h-44 w-44 place-items-center rounded-[2.5rem] bg-white text-9xl shadow-xl ring-8 ring-yellow-300">{got.emoji}</div>
          )}
          <div className="flex flex-wrap justify-center gap-4">
            <button className="btn btn-white" onClick={onAgain}>
              🔄 Làm lại
            </button>
            <button className="btn btn-green" onClick={onMap}>
              🏫 Về lớp học
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ---------- Screen ----------

const STEP_META: Record<Step, { label: string; icon: string }> = {
  xem: { label: "Xem", icon: "👀" },
  choi: { label: "Chơi", icon: "🖐️" },
  thu: { label: "Làm bài", icon: "✏️" },
  sao: { label: "Xong", icon: "✅" },
};

/** A lesson (Xem → [Chơi] → Làm bài → Sao) or a week's worksheet (Làm bài → Sao). */
export function ItemScreen({
  week,
  lesson,
  onExit,
}: {
  week: WeekDef;
  lesson: LessonDef | null; // null = the week's worksheet
  onExit: () => void;
}) {
  const steps: Step[] = lesson ? (lesson.play ? ["xem", "choi", "thu", "sao"] : ["xem", "thu", "sao"]) : ["thu", "sao"];
  const id = lesson ? lesson.id : worksheetId(week);
  // Left early last time? Offer to continue from that question.
  const [resume, setResume] = useState<Resume | null>(() => useProgress.getState().resume[id] ?? null);
  const [step, setStep] = useState<Step>(resume ? "thu" : steps[0]);
  const [run, setRun] = useState(0);
  const [started, setStarted] = useState(!!lesson && !resume); // worksheets (and resumes) open with an intro card
  const [startAt, setStartAt] = useState<Resume | undefined>(undefined);
  const finish = useProgress((s) => s.finish);
  const title = lesson ? lesson.title : `Phiếu bài tập ${week.title}`;
  const stepIdx = steps.indexOf(step);
  const next = () => setStep(steps[stepIdx + 1]);

  useEffect(() => {
    if (resume) void speak(`Lần trước con làm đến câu ${resume.done + 1}. Con làm tiếp nhé?`);
    else if (!lesson) void speak(`Phiếu bài tập ${subjectOf(week).name}, ${week.title}: ${week.topic}. Con làm từng câu nhé!`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson, week]);

  return (
    <div className="sky flex h-dvh flex-col">
      <header className="flex items-center gap-3 pl-4 pr-36 pt-3">
        <button
          aria-label="Về lớp học"
          className="btn btn-white !min-h-14 !min-w-14 !px-0 !text-3xl"
          onClick={() => {
            stopSpeech();
            onExit();
          }}
        >
          🏫
        </button>
        <div className="chip truncate text-xl">
          {lesson ? lesson.icon : "📝"} {subjectOf(week).name} · {week.title} · {title}
        </div>
        <div className="ml-auto flex gap-2">
          {steps.map((s, i) => (
            <div
              key={s}
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-lg font-extrabold shadow ${
                i === stepIdx ? "bg-orange-400 text-white" : i < stepIdx ? "bg-green-400 text-white" : "bg-white/70 text-amber-900/50"
              }`}
            >
              <span>{i < stepIdx ? "✓" : STEP_META[s].icon}</span>
              <span className="hidden md:inline">{STEP_META[s].label}</span>
            </div>
          ))}
        </div>
      </header>

      <main className="min-h-0 flex-1">
        {step === "xem" &&
          lesson &&
          (lesson.play === "orchard" ? (
            <OrchardWatch key={run} onNext={next} onReplay={() => setRun((r) => r + 1)} />
          ) : (
            <DemoWatch key={run} lesson={lesson} onNext={next} onReplay={() => setRun((r) => r + 1)} />
          ))}
        {step === "choi" && <OrchardPlay onNext={next} />}
        {step === "thu" && !started && resume && (
          <div className="flex h-full flex-col items-center justify-center gap-6 p-6 text-center">
            <div className="text-9xl">{lesson ? lesson.icon : "📝"}</div>
            <h2 className="text-5xl font-extrabold text-amber-800">{title}</h2>
            <p className="max-w-2xl rounded-3xl bg-white/90 px-6 py-4 text-3xl font-bold shadow-md">
              Lần trước con làm đến câu {resume.done + 1}/{(lesson ? lesson.practice : week.worksheet).length}.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                className="btn btn-white"
                onClick={() => {
                  stopSpeech();
                  useProgress.getState().saveResume(id, null);
                  setResume(null);
                  setStartAt(undefined);
                  setStarted(!!lesson);
                  setStep(steps[0]);
                }}
              >
                🔄 Làm lại từ đầu
              </button>
              <button
                className="btn btn-orange"
                onClick={() => {
                  stopSpeech();
                  setStartAt(resume);
                  setResume(null);
                  setStarted(true);
                }}
              >
                ▶ Làm tiếp câu {resume.done + 1}
              </button>
            </div>
          </div>
        )}
        {step === "thu" && !started && !resume && (
          <div className="flex h-full flex-col items-center justify-center gap-6 p-6 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.6 }} className="text-9xl">
              📝
            </motion.div>
            <h2 className="text-5xl font-extrabold text-amber-800">
              Phiếu bài tập {subjectOf(week).name} · {week.title}
            </h2>
            <p className="max-w-2xl rounded-3xl bg-white/90 px-6 py-4 text-3xl font-bold shadow-md">
              {week.topic} · {week.worksheet.length} câu
            </p>
            <button className="btn btn-orange" onClick={() => setStarted(true)}>
              ✏️ Bắt đầu làm bài
            </button>
          </div>
        )}
        {step === "thu" && started && (
          <Runner
            key={run}
            itemId={id}
            specs={lesson ? lesson.practice : week.worksheet}
            mode={lesson ? "practice" : "worksheet"}
            startAt={startAt}
            onDone={(s) => {
              finish(id, s);
              setStartAt(undefined);
              setStep("sao");
            }}
            onTimeUp={() => {
              stopSpeech();
              onExit();
            }}
          />
        )}
        {step === "sao" && (
          <DoneStep
            title={title}
            onMap={onExit}
            onAgain={() => {
              setRun((r) => r + 1);
              setStarted(!!lesson);
              setStep(steps[0]);
            }}
          />
        )}
      </main>

      <Caption />
    </div>
  );
}
