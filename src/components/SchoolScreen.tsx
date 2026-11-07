"use client";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SchoolScene, type Place, type SchoolPhase } from "./three/School";
import { Caption } from "./Caption";
import { SUBJECTS, type SubjectDef } from "@/content/subjects";
import type { WeekDef } from "@/content/types";
import { useProgress } from "@/lib/store";
import { weekStatuses } from "@/lib/progress";
import { hasVietnameseVoice, speak, unlockSpeech } from "@/lib/speech";
import { sfx } from "@/lib/sfx";
import { KID, useKid } from "@/lib/kid";
import { useSettings } from "@/lib/settings";

/**
 * The story: the boy stands at the school gate → walks into the yard → picks a subject
 * (Toán / Tiếng Việt) → picks a week's learning material ("học liệu") → walks into the
 * first classroom on the left. Subject and week are two separate steps, so the child
 * always sees which subject is chosen.
 */
export function SchoolScreen({ start, onEnterClass }: { start: "gate" | "yard"; onEnterClass: (w: WeekDef) => void }) {
  const kidName = useKid((s) => s.name) || KID.name;
  const [phase, setPhase] = useState<SchoolPhase>(start);
  const [skip, setSkip] = useState(0);
  const [week, setWeek] = useState<WeekDef | null>(null);
  const [subject, setSubject] = useState<SubjectDef | null>(null);
  const [fading, setFading] = useState(false);
  const { stars, review, setLastWeek } = useProgress();
  const flat = useSettings((s) => s.no3D);

  useEffect(() => {
    if (start === "yard") void speak(`Hôm nay ${KID.name} học môn nào?`);
  }, [start]);

  const onArrived = useCallback(() => {
    setPhase((p) => {
      if (p === "walkIn") {
        void speak(`${KID.name} đến sân trường rồi! Hôm nay ${KID.name} học môn nào?`, { caption: `${KID.name} đến sân trường rồi! Hôm nay học môn nào? 👇` });
        return "yard";
      }
      if (p === "walkToClass") {
        setFading(true);
        return p;
      }
      return p;
    });
  }, []);

  useEffect(() => {
    if (!fading || !week) return;
    const t = setTimeout(() => onEnterClass(week), 450);
    return () => clearTimeout(t);
  }, [fading, week, onEnterClass]);

  const begin = () => {
    unlockSpeech();
    sfx.unlock();
    sfx.ding();
    if (flat) {
      // No 3D: skip the walk, go straight to the yard.
      void speak(`Chào ${KID.name}! Hôm nay ${KID.name} học môn nào?`);
      setPhase("yard");
      return;
    }
    void speak(`Chào ${KID.name}! Mình cùng vào trường nhé!`);
    setPhase("walkIn");
  };

  const pickSubject = (s: SubjectDef | null) => {
    sfx.tap();
    setSubject(s);
    if (s) void speak(`Môn ${s.name}. ${KID.name} chọn học liệu tuần nào?`);
    else void speak(`Hôm nay ${KID.name} học môn nào?`);
  };

  const pickWeek = (w: WeekDef) => {
    sfx.tap();
    setWeek(w);
    setLastWeek(w.id);
    void speak(`Môn ${subject?.name ?? ""}, ${w.title}: ${w.topic}. Mình vào lớp nhé!`);
    if (flat) {
      onEnterClass(w);
      return;
    }
    setPhase("walkToClass");
  };

  const onPlace = (p: Place) => {
    sfx.tap();
    void speak(p.say);
  };

  const walking = phase === "walkIn" || phase === "walkToClass";

  return (
    <div className="sky relative flex h-dvh flex-col">
      <main className="relative min-h-0 flex-1" onClick={walking ? () => setSkip((s) => s + 1) : undefined}>
        {flat ? (
          <div className="grid h-full place-items-center text-[10rem] leading-none" aria-hidden>
            🏫
          </div>
        ) : (
          <SchoolScene phase={phase} skip={skip} onArrived={onArrived} onPlace={onPlace} />
        )}

        {phase === "gate" && (
          <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2 sm:right-8">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="rounded-3xl bg-white/90 px-5 py-2 text-right shadow-md"
            >
              <div className="text-4xl font-extrabold text-amber-800">Gấu Đi Học</div>
              <div className="text-lg font-bold text-amber-800/80">Cùng {kidName} học Toán và Tiếng Việt lớp 1</div>
            </motion.div>
            <button className="btn btn-orange breathe !min-h-24 !px-12 !text-4xl" onClick={begin}>
              Bắt đầu ▶
            </button>
            <NoVoiceHint />
          </div>
        )}

        {walking && (
          <button className="btn btn-white absolute right-4 top-20 !min-h-14 !text-xl" onClick={() => setSkip((s) => s + 1)}>
            Bỏ qua ⏩
          </button>
        )}

        {phase === "yard" && !subject && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute inset-x-0 bottom-2 flex flex-col items-center gap-2 px-3"
          >
            <div className="chip text-xl">🎒 Chọn môn học</div>
            <div className="flex flex-wrap justify-center gap-4 pb-2">
              {SUBJECTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => pickSubject(s)}
                  className="flex min-w-56 flex-col items-center rounded-3xl border-b-8 bg-white px-6 py-3 shadow-xl active:translate-y-1"
                  style={{ borderColor: s.color }}
                >
                  <span className="text-5xl">{s.icon}</span>
                  <span className="text-3xl font-extrabold" style={{ color: s.color }}>
                    {s.name}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === "yard" && subject && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute inset-x-0 bottom-2 flex flex-col items-center gap-2 px-3"
          >
            <div className="flex items-center gap-2">
              <button className="btn btn-white !min-h-12 !text-lg" onClick={() => pickSubject(null)}>
                ◀ Đổi môn
              </button>
              <div className="chip text-xl" style={{ color: subject.color }}>
                {subject.icon} {subject.name} · Chọn học liệu
              </div>
            </div>
            <div className="flex max-w-full gap-3 overflow-x-auto px-1 pb-2">
              {subject.weeks.map((w) => {
                const st = weekStatuses(w, stars, review);
                const got = st.filter((s) => s.done).length;
                const done = st.every((s) => s.done);
                return (
                  <button
                    key={`${w.subject}-${w.id}`}
                    onClick={() => pickWeek(w)}
                    className="flex min-w-44 shrink-0 flex-col items-start rounded-3xl border-b-8 bg-white px-4 py-2 text-left shadow-xl active:translate-y-1"
                    style={{ borderColor: w.dark }}
                  >
                    <span className="text-2xl font-extrabold" style={{ color: w.dark }}>
                      {done ? "✅" : "📗"} {w.title}
                    </span>
                    <span className="max-w-48 text-sm font-bold leading-tight opacity-80">{w.topic}</span>
                    <span className="mt-1 text-sm font-extrabold">
                      ✅ {got}/{st.length} bài
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {fading && <motion.div className="absolute inset-0 bg-amber-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} />}
        </AnimatePresence>
      </main>
      <Caption />
    </div>
  );
}

function NoVoiceHint() {
  // Shown only when the device has no Vietnamese voice installed (voices load async).
  const [missing, setMissing] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMissing(!hasVietnameseVoice()), 1200);
    return () => clearTimeout(t);
  }, []);
  if (!missing) return null;
  return (
    <p className="max-w-md rounded-2xl bg-white/80 px-3 text-center text-base font-semibold text-amber-900/80">
      Máy chưa có giọng đọc tiếng Việt, nên lời của Gấu sẽ hiện thành chữ.{" "}
      {isAppleTouch()
        ? "Phụ huynh vào Cài đặt → Trợ năng → Nội dung được đọc → Giọng nói → Tiếng Việt, tải giọng “Linh”, rồi mở lại app."
        : "Phụ huynh có thể cài giọng tiếng Việt trong phần cài đặt của máy."}
    </p>
  );
}

/** iPhone/iPad. iPadOS Safari reports itself as a Mac, so check for a touch screen too. */
function isAppleTouch() {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
}
