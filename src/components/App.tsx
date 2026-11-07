"use client";
import { useCallback, useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import { SchoolScreen } from "./SchoolScreen";
import { ClassroomScreen } from "./ClassroomScreen";
import { ItemScreen } from "./ItemScreen";
import { BreakOverlay } from "./BreakOverlay";
import { TimeUpScreen } from "./TimeUpScreen";
import { ParentPanel } from "./ParentPanel";
import { HoldButton } from "./HoldButton";
import type { LessonDef, WeekDef } from "@/content/types";
import { speak, stopSpeech } from "@/lib/speech";
import { sfx } from "@/lib/sfx";
import { KID, useKid } from "@/lib/kid";
import { KidSetup } from "./KidSetup";
import { useSettings } from "@/lib/settings";
import { usePause } from "@/lib/pause";
import { useSession } from "@/lib/session";

type Screen =
  | { name: "setup" }
  | { name: "school"; start: "gate" | "yard" }
  | { name: "classroom"; week: WeekDef; greet: boolean }
  | { name: "item"; week: WeekDef; lesson: LessonDef | null };

/** Counts learning time inside lessons (not during a break) and flags when the parent's limit is reached. */
function useSessionClock(inLesson: boolean) {
  const sessionMin = useSettings((s) => s.sessionMin);
  const paused = usePause((s) => s.paused);
  useEffect(() => {
    if (!sessionMin || !inLesson || paused) return;
    const t = setInterval(() => {
      const { learnedMs, timeUp } = useSession.getState();
      const next = learnedMs + 1000;
      useSession.setState({ learnedMs: next, timeUp: timeUp || next >= sessionMin * 60_000 });
    }, 1000);
    return () => clearInterval(t);
  }, [sessionMin, inLesson, paused]);
  // Parent removed the limit (or made it longer): lift the stop.
  useEffect(() => {
    const { learnedMs } = useSession.getState();
    if (!sessionMin || learnedMs < sessionMin * 60_000) useSession.setState({ timeUp: false });
  }, [sessionMin]);
}

/** Gate → yard → classroom (blackboard) → lesson. Leaving a lesson returns to the classroom. */
export default function App() {
  // First launch on this device: ask for the child's name and boy/girl before the school gate.
  const [screen, setScreen] = useState<Screen>(() => (useKid.getState().name ? { name: "school", start: "gate" } : { name: "setup" }));
  const [onBreak, setOnBreak] = useState(false);
  const [parent, setParent] = useState(false);
  const enterClass = useCallback((week: WeekDef) => setScreen({ name: "classroom", week, greet: true }), []);
  const reduceMotion = useSettings((s) => s.reduceMotion);
  const softColors = useSettings((s) => s.softColors);
  const timeUp = useSession((s) => s.timeUp);
  useSessionClock(screen.name === "item");

  useEffect(() => {
    document.documentElement.classList.toggle("calm", reduceMotion);
    document.documentElement.classList.toggle("soft", softColors);
  }, [reduceMotion, softColors]);

  if (screen.name === "setup") {
    return <KidSetup onDone={() => setScreen({ name: "school", start: "gate" })} />;
  }

  let page: React.ReactNode;
  if (screen.name === "school") {
    page = <SchoolScreen key={screen.start} start={screen.start} onEnterClass={enterClass} />;
  } else if (screen.name === "classroom") {
    const { week } = screen;
    page = (
      <ClassroomScreen
        week={week}
        greet={screen.greet}
        onOpen={(i) => setScreen({ name: "item", week, lesson: i === null ? null : week.lessons[i] })}
        onLeave={() => setScreen({ name: "school", start: "yard" })}
      />
    );
  } else {
    page = (
      <ItemScreen
        key={`${screen.week.subject}-${screen.week.id}-${screen.lesson?.id ?? "ws"}`}
        week={screen.week}
        lesson={screen.lesson}
        onExit={() => {
          setScreen({ name: "classroom", week: screen.week, greet: false });
          if (!useSession.getState().timeUp) void speak(`${KID.name} chọn bài tiếp theo trên bảng nhé!`);
        }}
      />
    );
  }

  return (
    <MotionConfig reducedMotion={reduceMotion ? "always" : "user"}>
      {page}

      {/* Same two buttons, same place, on every screen. */}
      <div className="fixed right-3 top-3 z-20 flex items-center gap-2">
        {screen.name !== "item" && (
          <HoldButton label="Phụ huynh: giữ 2 giây để mở cài đặt" onHold={() => setParent(true)} className="btn btn-white !min-h-14 !min-w-14 !px-0 !text-2xl opacity-70">
            ⚙️
          </HoldButton>
        )}
        <button
          className="btn btn-white !min-h-14 !px-4 !text-xl"
          onClick={() => {
            sfx.tap();
            setOnBreak(true);
          }}
        >
          😌 Nghỉ
        </button>
      </div>

      {onBreak && <BreakOverlay onClose={() => setOnBreak(false)} />}
      {timeUp && screen.name !== "item" && !parent && <TimeUpScreen />}
      {parent && (
        <ParentPanel
          onClose={() => {
            stopSpeech();
            setParent(false);
          }}
        />
      )}
    </MotionConfig>
  );
}
