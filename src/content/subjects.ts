// The two subjects shown in the school yard. Each has its own weeks and its own progress ids.
import type { Subject, WeekDef } from "./types";
import { WEEKS } from "./weeks";
import { TV_WEEKS } from "./tv/weeks";

export type SubjectDef = { id: Subject; name: string; icon: string; color: string; weeks: WeekDef[] };

export const SUBJECTS: SubjectDef[] = [
  { id: "toan", name: "Toán", icon: "🔢", color: "#e08a00", weeks: WEEKS },
  { id: "tv", name: "Tiếng Việt", icon: "🔤", color: "#0277bd", weeks: TV_WEEKS },
];

export const subjectOf = (w: WeekDef) => SUBJECTS.find((s) => s.id === w.subject)!;
