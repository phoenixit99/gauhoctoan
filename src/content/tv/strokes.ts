// Basic handwriting strokes (Tiếng Việt Tuần 1). Paths are drawn in a 100×100 box and
// start where the child puts their finger (green dot) and end at the red dot.
// To swap a shape (e.g. xiên phải / xiên trái), change only the `d` here.
import type { StrokeId } from "../types";

export const STROKES: Record<StrokeId, { name: string; d: string }> = {
  ngang: { name: "nét ngang", d: "M 20 50 L 80 50" },
  so: { name: "nét sổ", d: "M 50 15 L 50 85" },
  // As labelled on the school worksheet: xiên phải = "\", xiên trái = "/".
  "xien-phai": { name: "nét xiên phải", d: "M 32 15 L 68 85" },
  "xien-trai": { name: "nét xiên trái", d: "M 68 15 L 32 85" },
  "cong-ho-phai": { name: "nét cong hở phải", d: "M 66 26 A 26 30 0 1 0 66 74" },
  "cong-ho-trai": { name: "nét cong hở trái", d: "M 34 26 A 26 30 0 1 1 34 74" },
  "cong-kin": { name: "nét cong kín", d: "M 50 18 A 26 32 0 1 0 50 82 A 26 32 0 0 0 61 21" },
  "moc-xuoi": { name: "nét móc xuôi", d: "M 32 85 L 32 42 Q 32 20 50 20 Q 68 20 68 42 L 68 85" },
  "moc-nguoc": { name: "nét móc ngược", d: "M 36 15 L 36 64 Q 36 85 54 85 Q 66 85 70 72" },
  "moc-hai-dau": { name: "nét móc hai đầu", d: "M 24 52 Q 24 30 38 30 Q 50 30 50 46 L 50 64 Q 50 80 63 80 Q 76 80 76 62" },
  "khuyet-tren": { name: "nét khuyết trên", d: "M 38 72 C 50 58 62 38 58 20 C 55 6 40 8 44 26 L 47 90" },
  "khuyet-duoi": { name: "nét khuyết dưới", d: "M 54 10 L 54 70 C 54 92 36 92 38 78 C 40 64 55 58 66 52" },
};
