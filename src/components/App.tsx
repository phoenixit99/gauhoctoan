"use client";
import { useCallback, useState } from "react";
import { SchoolScreen } from "./SchoolScreen";
import { ClassroomScreen } from "./ClassroomScreen";
import { ItemScreen } from "./ItemScreen";
import type { LessonDef, WeekDef } from "@/content/types";
import { speak } from "@/lib/speech";
import { KID } from "@/lib/kid";

type Screen =
  | { name: "school"; start: "gate" | "yard" }
  | { name: "classroom"; week: WeekDef; greet: boolean }
  | { name: "item"; week: WeekDef; lesson: LessonDef | null };

/** Gate → yard → classroom (blackboard) → lesson. Leaving a lesson returns to the classroom. */
export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: "school", start: "gate" });
  const enterClass = useCallback((week: WeekDef) => setScreen({ name: "classroom", week, greet: true }), []);

  if (screen.name === "school") {
    return <SchoolScreen key={screen.start} start={screen.start} onEnterClass={enterClass} />;
  }

  if (screen.name === "classroom") {
    const { week } = screen;
    return (
      <ClassroomScreen
        week={week}
        greet={screen.greet}
        onOpen={(i) => setScreen({ name: "item", week, lesson: i === null ? null : week.lessons[i] })}
        onLeave={() => setScreen({ name: "school", start: "yard" })}
      />
    );
  }

  return (
    <ItemScreen
      key={`${screen.week.subject}-${screen.week.id}-${screen.lesson?.id ?? "ws"}`}
      week={screen.week}
      lesson={screen.lesson}
      onExit={() => {
        setScreen({ name: "classroom", week: screen.week, greet: false });
        void speak(`${KID.name} chọn bài tiếp theo trên bảng nhé!`);
      }}
    />
  );
}
