// ---------------------------------------------------------------------------
// Phương pháp: one fixed step-by-step routine per question kind.
// The child sees the same steps, in the same words, every time that kind of
// question appears (lesson, practice, worksheet), so the method is predictable.
//
// Rules for writing steps (see CONTENT.md):
//   - short, literal, one action per step, no metaphors
//   - one word per concept: "lớn hơn / bé hơn" for numbers, "nhiều hơn / ít hơn" for groups
//   - comparison methods always say what to do when the two sides are equal
//
// Each generator in generate.ts fills `walk` with the same number of steps, using
// the question's real numbers, so the bear's walkthrough lights up step by step.
// ---------------------------------------------------------------------------
import type { Spec } from "./types";

export type MethodStep = { icon: string; text: string };

type MethodDef = MethodStep[] | ((spec: Spec) => MethodStep[]);

export const METHODS: Partial<Record<Spec["kind"], MethodDef>> = {
  sign: [
    { icon: "🧱", text: "Xếp khối trên số bên trái" },
    { icon: "🧱", text: "Xếp khối trên số bên phải" },
    { icon: "📏", text: "Tháp nào cao hơn?" },
    { icon: "✏️", text: "Đầu nhọn chỉ vào số bé hơn. Bằng nhau: dấu =" },
  ],
  "picture-sign": [
    { icon: "🔢", text: "Đếm nhóm bên trái" },
    { icon: "🔢", text: "Đếm nhóm bên phải" },
    { icon: "⚖️", text: "Số nào lớn hơn?" },
    { icon: "✏️", text: "Đầu nhọn chỉ vào số bé hơn. Bằng nhau: dấu =" },
  ],
  "attr-compare": [
    { icon: "🔢", text: "Đếm loại thứ nhất" },
    { icon: "🔢", text: "Đếm loại thứ hai" },
    { icon: "⚖️", text: "Số nào lớn hơn?" },
    { icon: "✅", text: "Số lớn hơn là loại nhiều hơn. Bằng nhau: chọn “bằng nhau”" },
  ],
  "pick-number": [
    { icon: "👀", text: "Đọc phép so sánh" },
    { icon: "🔁", text: "Thử từng số vào ô trống" },
    { icon: "✅", text: "Chọn số làm phép so sánh đúng" },
  ],
  "adjust-counts": [
    { icon: "👀", text: "Đọc số hình mỗi hàng cần có" },
    { icon: "➕", text: "Hàng trên: thêm cho đủ" },
    { icon: "➕", text: "Hàng dưới: thêm cho đủ" },
    { icon: "✅", text: "Đếm lại để kiểm tra" },
  ],

  // ---------------- Tiếng Việt ----------------
  // Words Gấu always uses: "âm" (a sound: âm bờ), "tiếng" (one syllable: bé), "từ" (a word of
  // several tiếng: bí đỏ), "dấu" (dấu huyền, dấu sắc… never "thanh"), "đánh vần" (bờ, e, be, sắc, bé).
  "tv-read": [
    { icon: "👆", text: "Chạm vào một thẻ" },
    { icon: "👂", text: "Nghe Gấu đánh vần và đọc" },
    { icon: "🗣️", text: "Đọc theo Gấu" },
  ],
  "tv-trace": [
    { icon: "🟢", text: "Đặt ngón tay vào chấm xanh" },
    { icon: "✍️", text: "Kéo theo đường chấm" },
    { icon: "🔴", text: "Dừng ở chấm đỏ" },
  ],
  "tv-tone": [
    { icon: "👂", text: "Nghe tên dấu" },
    { icon: "👀", text: "Nhớ hình của dấu đó" },
    { icon: "✅", text: "Chọn dấu có hình đó" },
  ],
  "tv-tone-word": (spec) => [
    spec.kind === "tv-tone-word" && spec.pictures ? { icon: "🗣️", text: "Nói tên từng hình" } : { icon: "📖", text: "Đọc từng tiếng" },
    { icon: "👂", text: "Tìm dấu của mỗi tiếng" },
    { icon: "✅", text: "Chọn tiếng có dấu cần tìm" },
  ],
  "tv-sound": [
    { icon: "👂", text: "Nghe âm cần tìm" },
    { icon: "🗣️", text: "Nói tên từng hình" },
    { icon: "✅", text: "Chọn hình có âm đó" },
  ],
  "tv-sound-all": (spec) => [
    { icon: "👂", text: "Nghe âm cần tìm" },
    spec.kind === "tv-sound-all" && spec.words ? { icon: "📖", text: "Đọc từng tiếng" } : { icon: "🗣️", text: "Nói tên từng hình" },
    { icon: "✅", text: "Chọn tất cả cái có âm đó, rồi bấm Xong" },
  ],
  "tv-word-pic": [
    { icon: "📖", text: "Đọc chữ" },
    { icon: "🗣️", text: "Nói tên từng hình" },
    { icon: "✅", text: "Chọn hình đúng với chữ" },
  ],
  "tv-correct-word": [
    { icon: "🗣️", text: "Nói tên hình" },
    { icon: "👂", text: "Đánh vần, nghe dấu" },
    { icon: "✅", text: "Chọn từ có đúng dấu" },
  ],
  "tv-fill": [
    { icon: "🗣️", text: "Nói tên hình" },
    { icon: "👂", text: "Đánh vần tiếng đó" },
    { icon: "✅", text: "Chọn chữ còn thiếu" },
  ],
  "tv-match": (spec) =>
    spec.kind === "tv-match" && spec.sentences
      ? [
          { icon: "📖", text: "Đọc phần đầu" },
          { icon: "🔁", text: "Tìm phần cuối hợp với phần đầu" },
          { icon: "🔗", text: "Nối thành câu đúng" },
        ]
      : [
          { icon: "🗣️", text: "Nói tên một hình" },
          { icon: "📖", text: "Tìm chữ giống tên hình" },
          { icon: "🔗", text: "Nối hình với chữ" },
        ],
  "tv-spell": [
    { icon: "👂", text: "Nghe tiếng, đánh vần" },
    { icon: "1️⃣", text: "Chọn âm đầu" },
    { icon: "2️⃣", text: "Chọn âm thứ hai" },
    { icon: "✏️", text: "Chọn dấu" },
  ],
};

export function methodFor(spec?: Spec): MethodStep[] | undefined {
  if (!spec) return undefined;
  const m = METHODS[spec.kind];
  return typeof m === "function" ? m(spec) : m;
}
