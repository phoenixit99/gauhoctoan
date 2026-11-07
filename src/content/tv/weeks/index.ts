// Tiếng Việt weeks (in order). To add a week: create tv-XX.ts and add it below.
import { tv01 } from "./tv-01";
import { tv02 } from "./tv-02";
import { tv03 } from "./tv-03";
import { tv04 } from "./tv-04";
import type { WeekDef } from "../../types";

export const TV_WEEKS: WeekDef[] = [tv01, tv02, tv03, tv04];
