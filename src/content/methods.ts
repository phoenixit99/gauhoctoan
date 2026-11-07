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
import { isRhyme, sylls } from "./tv/words";

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
  "num-tf": [
    { icon: "👀", text: "Đọc phép so sánh" },
    { icon: "🧱", text: "Xếp khối trên hai số" },
    { icon: "📏", text: "Tháp nào cao hơn? Bằng nhau: hai tháp cao bằng nhau" },
    { icon: "✅", text: "Khớp với dấu thì ghi Đ. Không khớp thì ghi S" },
  ],
  extreme: (spec) => {
    const most = spec.kind === "extreme" && spec.mode === "max";
    if (spec.kind === "extreme" && spec.pictures)
      return [
        { icon: "🔢", text: "Đếm từng tranh" },
        { icon: "⚖️", text: most ? "Tìm số lớn nhất" : "Tìm số bé nhất" },
        { icon: "✅", text: most ? "Chọn tranh đó: nhiều nhất" : "Chọn tranh đó: ít nhất" },
      ];
    return [
      { icon: "🧱", text: "Xếp khối trên từng số" },
      { icon: "📏", text: most ? "Tìm tháp cao nhất" : "Tìm tháp thấp nhất" },
      { icon: "✅", text: most ? "Chọn số đó: số lớn nhất" : "Chọn số đó: số bé nhất" },
    ];
  },
  bond: (spec) =>
    spec.kind === "bond" && spec.mode === "join"
      ? [
          { icon: "🔢", text: "Đếm nhóm thứ nhất" },
          { icon: "🔢", text: "Đếm nhóm thứ hai" },
          { icon: "➕", text: "Đếm tiếp từ số thứ nhất" },
          { icon: "✏️", text: "Viết số ở trên" },
        ]
      : [
          { icon: "🔵", text: "Xếp chấm theo số ở trên" },
          { icon: "🔢", text: "Đếm nhóm thứ nhất" },
          { icon: "🔢", text: "Đếm nhóm còn lại" },
          { icon: "✏️", text: "Viết số còn thiếu" },
        ],
  add: (spec) => {
    if (spec.kind !== "add") return [];
    if (spec.terms === 3)
      return [
        { icon: "➕", text: "Cộng hai số đầu" },
        { icon: "➕", text: "Cộng tiếp số thứ ba" },
        { icon: "✏️", text: "Viết kết quả" },
      ];
    if (spec.missing)
      return [
        { icon: "🔵", text: "Xếp chấm cho số đã biết" },
        { icon: "➕", text: "Đếm tiếp đến kết quả" },
        { icon: "✏️", text: "Số chấm thêm vào là số cần điền" },
      ];
    return [
      { icon: "🔵", text: spec.pictures ? "Đếm nhóm thứ nhất" : "Xếp chấm cho số thứ nhất" },
      { icon: "🔵", text: spec.pictures ? "Đếm nhóm thứ hai" : "Xếp chấm cho số thứ hai" },
      { icon: "➕", text: "Đếm tiếp từ số thứ nhất" },
      { icon: "✏️", text: "Viết kết quả" },
    ];
  },
  sub: (spec) =>
    spec.kind === "sub" && spec.bond
      ? [
          { icon: "🔗", text: "Đọc số gồm hai số nào" },
          { icon: "✂️", text: "Bớt một số, còn lại số kia" },
          { icon: "✏️", text: "Viết kết quả" },
        ]
      : [
          { icon: "🔵", text: "Xếp chấm cho số đầu tiên" },
          { icon: "✂️", text: "Gạch bớt chấm" },
          { icon: "🔢", text: spec.kind === "sub" && spec.missing ? "Đếm số chấm bị gạch" : "Đếm số chấm còn lại" },
          { icon: "✏️", text: "Viết số vào ô trống" },
        ],
  "expr-sign": [
    { icon: "🧮", text: "Tính bên trái" },
    { icon: "🧮", text: "Tính bên phải" },
    { icon: "⚖️", text: "Số nào lớn hơn?" },
    { icon: "✏️", text: "Đầu nhọn chỉ vào số bé hơn. Bằng nhau: dấu =" },
  ],
  "calc-match": (spec) => [
    { icon: "🧮", text: "Tính phép tính bên trái" },
    { icon: "🔎", text: spec.kind === "calc-match" && spec.to === "expr" ? "Tìm phép tính có cùng kết quả" : "Tìm số là kết quả" },
    { icon: "🔗", text: "Nối" },
  ],
  "calc-select": [
    { icon: "👂", text: "Nhớ kết quả cần tìm" },
    { icon: "🧮", text: "Tính từng phép tính" },
    { icon: "✅", text: "Chọn phép tính có kết quả đó, rồi bấm Xong" },
  ],
  "shape-pick": [
    { icon: "👂", text: "Nghe tên hình, nhớ số cạnh" },
    { icon: "👀", text: "Xem cạnh của từng hình" },
    { icon: "✅", text: "Chọn hình đúng" },
  ],
  "shape-object": [
    { icon: "👀", text: "Nhìn vật" },
    { icon: "📏", text: "Xem cạnh của vật" },
    { icon: "✅", text: "Chọn hình giống vật" },
  ],
  "shape-match": [
    { icon: "👀", text: "Nhìn một vật" },
    { icon: "📏", text: "Xem cạnh của vật" },
    { icon: "🔗", text: "Nối với hình giống vật" },
  ],
  "shape-all": [
    { icon: "👂", text: "Nghe tên hình, nhớ số cạnh" },
    { icon: "👀", text: "Xem từng hình" },
    { icon: "✅", text: "Chọn tất cả hình đó, rồi bấm Xong" },
  ],
  "shape-count": [
    { icon: "👂", text: "Nhớ hình cần đếm" },
    { icon: "🔢", text: "Đếm từng hình đó" },
    { icon: "✅", text: "Chọn số" },
  ],
  "shape-pattern": [
    { icon: "👀", text: "Đọc từng hình" },
    { icon: "🔁", text: "Tìm nhóm hình lặp lại" },
    { icon: "✅", text: "Chọn hình tiếp theo trong nhóm" },
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
  "tv-rhyme": [
    { icon: "👂", text: "Nghe vần cần tìm" },
    { icon: "🗣️", text: "Nói tên từng hình" },
    { icon: "✅", text: "Chọn hình có vần đó" },
  ],
  "tv-correct-word": (spec) =>
    spec.kind === "tv-correct-word" && spec.pairs
      ? [
          { icon: "🗣️", text: "Nói tên hình" },
          { icon: "👂", text: "Đánh vần từng tiếng" },
          { icon: "✅", text: "Chọn từ viết đúng" },
        ]
      : [
          { icon: "🗣️", text: "Nói tên hình" },
          { icon: "👂", text: "Đánh vần, nghe dấu" },
          { icon: "✅", text: "Chọn từ có đúng dấu" },
        ],
  "tv-wrong": [
    { icon: "📖", text: "Đọc từng từ" },
    { icon: "🔎", text: "Tìm từ viết sai" },
    { icon: "✅", text: "Chọn tất cả từ viết sai, rồi bấm Xong" },
  ],
  "tv-fill": (spec) => {
    const rhyme = spec.kind === "tv-fill" && spec.letters.some(isRhyme);
    return [
      { icon: "🗣️", text: "Nói tên hình (hoặc nghe Gấu đọc)" },
      { icon: "👂", text: "Đánh vần tiếng đó" },
      { icon: "✅", text: rhyme ? "Chọn vần còn thiếu" : "Chọn chữ còn thiếu" },
    ];
  },
  "tv-cloze": [
    { icon: "📖", text: "Đọc câu" },
    { icon: "🔁", text: "Thử từng từ vào chỗ trống" },
    { icon: "✅", text: "Chọn từ đúng với câu" },
  ],
  "tv-order": [
    { icon: "📖", text: "Đọc từng thẻ" },
    { icon: "🔠", text: "Thẻ có chữ viết hoa đứng đầu. Chọn tiếp theo thứ tự" },
    { icon: "🗣️", text: "Đọc lại cả câu" },
  ],
  "tv-match": (spec) =>
    spec.kind === "tv-match" && spec.sentences
      ? [
          { icon: "📖", text: "Đọc phần đầu" },
          { icon: "🔁", text: "Tìm phần cuối hợp với phần đầu" },
          { icon: "🔗", text: spec.join === "từ" ? "Nối thành từ đúng" : "Nối thành câu đúng" },
        ]
      : [
          { icon: "🗣️", text: "Nói tên một hình" },
          { icon: "📖", text: "Tìm chữ giống tên hình" },
          { icon: "🔗", text: "Nối hình với chữ" },
        ],
  "tv-spell": (spec) => {
    const van = spec.kind === "tv-spell" && (spec.words ?? []).some((w) => sylls(w).some((x) => x.rhyme.length > 1));
    return [
      { icon: "👂", text: "Nghe tiếng, đánh vần" },
      { icon: "1️⃣", text: "Chọn âm đầu" },
      { icon: "2️⃣", text: van ? "Chọn âm thứ hai hoặc vần" : "Chọn âm thứ hai" },
      { icon: "✏️", text: "Chọn dấu" },
    ];
  },
};

export function methodFor(spec?: Spec): MethodStep[] | undefined {
  if (!spec) return undefined;
  const m = METHODS[spec.kind];
  return typeof m === "function" ? m(spec) : m;
}

/**
 * Progress key for a spec: support level (prompt fading), attempts and mastery are kept per method,
 * not per kind, because some kinds have variants with a different routine (add vs add with a missing
 * number). The default variant keeps the bare kind, so progress saved before variants existed still counts.
 */
export function methodKey(spec: Spec): string {
  const v = variantOf(spec);
  return v ? `${spec.kind}:${v}` : spec.kind;
}

/** Name of the variant (shown to the parent after the kind's label), or "" for the default one. */
export function variantOf(spec: Spec): string {
  switch (spec.kind) {
    case "add":
      return spec.terms === 3 ? "ba số" : spec.missing ? "số còn thiếu" : spec.pictures ? "từ tranh" : "";
    case "sub":
      return spec.bond ? "từ số gồm" : spec.missing ? "số còn thiếu" : "";
    case "bond":
      return spec.mode === "join" ? "gộp" : "";
    case "extreme":
      if (spec.pictures) return spec.mode === "min" ? "tranh ít nhất" : "tranh nhiều nhất";
      return spec.mode === "min" ? "bé nhất" : "";
    case "calc-match":
      return spec.to === "expr" ? "hai phép tính" : "";
    case "tv-correct-word":
      return spec.pairs ? "chính tả" : "";
    case "tv-tone-word":
      return spec.pictures ? "hình" : "";
    case "tv-sound-all":
      return spec.words ? "chữ" : "";
    case "tv-match":
      return spec.sentences ? (spec.join === "từ" ? "thành từ" : "thành câu") : "";
    case "tv-fill":
      return spec.letters.some(isRhyme) ? "vần" : "";
    case "tv-spell":
      return (spec.words ?? []).some((w) => sylls(w).some((x) => x.rhyme.length > 1)) ? "vần" : "";
    default:
      return "";
  }
}
