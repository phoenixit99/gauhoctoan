// Register every week here (in order). To add a week: create tuan-XX.ts and add it below.
import { tuan01 } from "./tuan-01";
import { tuan02 } from "./tuan-02";
import { tuan03 } from "./tuan-03";
import { tuan04 } from "./tuan-04";
import type { LessonDef, WeekDef } from "../types";

export const WEEKS: WeekDef[] = [tuan01, tuan02, tuan03, tuan04];

export const weekById = (id: number) => WEEKS.find((w) => w.id === id);

/** Progress id of a week's worksheet. Toán keeps "t4-ws" (saved progress depends on it); Tiếng Việt uses "tv4-ws". */
export const worksheetId = (w: WeekDef) => `${w.subject === "tv" ? "tv" : "t"}${w.id}-ws`;

export function findLesson(id: string): { week: WeekDef; lesson: LessonDef } | undefined {
  for (const week of WEEKS) {
    const lesson = week.lessons.find((l) => l.id === id);
    if (lesson) return { week, lesson };
  }
}
