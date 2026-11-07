import { worksheetId } from "@/content/weeks";
import type { WeekDef } from "@/content/types";

export type NodeStatus = { done: boolean; unlocked: boolean; review: boolean; stars: number };

/** Lessons unlock in order; the worksheet unlocks after the last lesson. */
export function weekStatuses(week: WeekDef, stars: Record<string, number>, review: Record<string, boolean>): NodeStatus[] {
  const ids = [...week.lessons.map((l) => l.id), worksheetId(week)];
  let prevDone = true;
  return ids.map((id) => {
    const s = stars[id] ?? 0;
    const st = { done: s > 0, unlocked: prevDone, review: !!review[id], stars: s };
    prevDone = s > 0;
    return st;
  });
}
