"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ClassroomScene } from "./three/Classroom";
import { Caption } from "./Caption";
import type { WeekDef } from "@/content/types";
import { useProgress } from "@/lib/store";
import { weekStatuses } from "@/lib/progress";
import { speak } from "@/lib/speech";
import { sfx } from "@/lib/sfx";
import { KID } from "@/lib/kid";
import { subjectOf } from "@/content/subjects";
import { useSettings } from "@/lib/settings";
import { StickerAlbum } from "./StickerAlbum";

/** Inside the first classroom: this week's lessons are written on the blackboard. */
export function ClassroomScreen({
  week,
  greet,
  onOpen,
  onLeave,
}: {
  week: WeekDef;
  greet: boolean;
  onOpen: (lessonIndex: number | null) => void;
  onLeave: () => void;
}) {
  const { stars, review } = useProgress();
  const unlockAll = useSettings((s) => s.unlockAll);
  const flat = useSettings((s) => s.no3D);
  const statuses = weekStatuses(week, stars, review, unlockAll);
  const currentIdx = statuses.findIndex((s) => s.unlocked && !s.done);

  useEffect(() => {
    const sub = subjectOf(week).name;
    if (greet) void speak(`${KID.name} vào lớp rồi! Môn ${sub}, ${week.title}: ${week.topic}. ${KID.name} chọn bài trên bảng nhé.`, { caption: `${sub} · ${week.title}: ${week.topic}. ${KID.name} chọn bài trên bảng nhé! 👆` });
  }, [greet, week]);

  const select = (i: number) => {
    if (!statuses[i].unlocked) {
      sfx.soft();
      void speak("Con học xong bài trước rồi mới mở bài này nhé!");
      return;
    }
    sfx.tap();
    onOpen(i < week.lessons.length ? i : null);
  };

  const board = (
    <div className="flex h-full w-full flex-col p-[2%]" style={{ fontSize: "min(3.1cqw, 6.6cqh)" }}>
      <div className="mb-[1.5%] text-center font-extrabold text-white/95" style={{ fontSize: "1.5em", fontFamily: "var(--font-baloo)" }}>
        {subjectOf(week).icon} {subjectOf(week).name} · {week.title}: {week.topic}
      </div>
      <div className="grid flex-1 auto-rows-fr grid-cols-3 gap-[2%]">
        {statuses.map((st, i) => {
          const lesson = week.lessons[i];
          const isSheet = !lesson;
          const current = i === currentIdx;
          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.08 * i }}
              onClick={() => select(i)}
              className={`relative flex min-h-0 flex-col items-center justify-center rounded-[0.8em] border-2 border-dashed px-1 leading-tight ${
                st.unlocked ? "border-white/80 bg-white/10 text-white" : "border-white/30 text-white/40"
              } ${current ? "bg-yellow-200/25 ring-4 ring-yellow-300" : ""}`}
            >
              <span style={{ fontSize: "2em", lineHeight: 1.1 }} className={st.unlocked ? "" : "grayscale"}>
                {st.unlocked ? (isSheet ? "📝" : lesson.icon) : "🔒"}
              </span>
              <span className="text-center font-extrabold" style={{ fontSize: "1em" }}>
                {isSheet ? "Phiếu bài tập" : `Bài ${i + 1}: ${lesson.title}`}
              </span>
              <span style={{ fontSize: "0.9em" }}>
                {st.done ? "✅ Đã xong" : current ? "👉 Học bài này" : ""}
              </span>
              {st.review && <span className="absolute right-1 top-1">🔁</span>}
            </motion.button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="sky flex h-dvh flex-col">
      <main className="relative min-h-0 flex-1">
        {flat ? (
          <div className="grid h-full place-items-center p-4 pt-20">
            <div className="aspect-[16/9] w-full max-w-5xl overflow-hidden rounded-3xl border-[14px] border-amber-800 bg-[#2f5d46] shadow-2xl" style={{ containerType: "size" }}>
              {board}
            </div>
          </div>
        ) : (
          <ClassroomScene board={board} />
        )}
        <div className="absolute left-4 top-4 flex gap-3">
          <button className="btn btn-white !min-h-14 !text-xl" onClick={onLeave}>
            🏫 Ra sân trường
          </button>
          <StickerAlbum />
        </div>
      </main>
      <Caption />
    </div>
  );
}
