// ---------------------------------------------------------------------------
// Content model. A week file (src/content/weeks/tuan-XX.ts) lists lessons and a
// worksheet as arrays of `Spec`s. A Spec is a *recipe*: every time it runs, the
// generator (generate.ts) makes a fresh concrete Question with random numbers,
// so the child can't memorise answers.
// ---------------------------------------------------------------------------

/** Exercise recipes. Each maps to one worksheet question format. */
export type Spec =
  // ---- Numbers 0–10 ----
  | { kind: "count"; min?: number; max?: number; dice?: boolean } // Có bao nhiêu …? (A/B/C) · dice = chấm như mặt xúc xắc
  | { kind: "basket"; min?: number; max?: number } // 3D: bỏ n quả táo vào giỏ
  | { kind: "make10"; min?: number; max?: number } // Để có 10 cần thêm …? (options are groups)
  | { kind: "sequence"; dir: "up" | "down"; style: "train" | "flags"; blanks?: number; to?: number } // Số? (đoàn tàu / dây cờ), 0→to
  | { kind: "scene-count"; max?: number } // Đếm số lượng trong tranh (một loại trong tranh nhiều loại)
  | { kind: "color-n"; min?: number; max?: number } // Tô màu n hình (theo mẫu)
  | { kind: "color-legend"; max?: number } // Tô màu theo yêu cầu: Số 1 màu vàng…
  | { kind: "match"; pairs?: number; min?: number; max?: number } // Nối nhóm với số
  // ---- More / fewer / equal ----
  | { kind: "pick-more" } // Chọn tranh có nhiều con vật hơn
  | { kind: "add-equal" } // Thêm bao nhiêu … để bằng …? (A/B/C)
  | { kind: "true-false" } // Đúng ghi Đ, sai ghi S
  | { kind: "adjust-more" } // Vẽ thêm để nhiều hơn
  | { kind: "adjust-equal" } // Vẽ thêm hoặc gạch bớt để bằng
  // ---- Signs >, <, = ----
  | { kind: "sign"; max?: number } // Điền dấu >, <, =
  | { kind: "picture-sign" } // Viết phép so sánh từ tranh
  | { kind: "pick-number" } // Nối ô trống với số thích hợp (7 > ☐)
  | { kind: "adjust-counts" } // Vẽ thêm hình cho thích hợp (2 < 3)
  | { kind: "attr-compare" } // Có ☐ quả xanh và ☐ quả vàng — loại nào nhiều hơn?
  | { kind: "num-tf"; max?: number } // Đúng ghi Đ, sai ghi S: 8 > 9
  | { kind: "extreme"; mode: "max" | "min"; pictures?: boolean } // số lớn nhất / bé nhất · tranh nhiều nhất / ít nhất
  // ---- Gộp, tách, cộng, trừ ----
  | { kind: "bond"; mode: "split" | "join"; min?: number; max?: number; pictures?: boolean } // 8 gồm 5 và ☐ · gộp hai nhóm
  | { kind: "add"; max?: number; pictures?: boolean; terms?: 2 | 3; missing?: boolean } // 2 + 4 = ☐ · 6 + ☐ = 8 · 3 + 4 + 1
  | { kind: "sub"; max?: number; pictures?: boolean; missing?: boolean; bond?: boolean } // 7 − 3 = ☐ · 4 − ☐ = 3
  | { kind: "expr-sign"; max?: number; sub?: boolean } // 3 + 2 ☐ 6
  | { kind: "calc-match"; to: "number" | "expr"; sub?: boolean; max?: number } // Nối phép tính với kết quả / phép tính bằng nhau
  | { kind: "calc-select"; sub?: boolean } // Chọn tất cả phép tính có kết quả bằng 10
  // ---- Hình phẳng ----
  | { kind: "shape-pick" } // Chọn hình tròn
  | { kind: "shape-object" } // Vật này có dạng hình gì?
  | { kind: "shape-match" } // Nối mỗi vật với tên hình
  | { kind: "shape-all" } // Chọn tất cả hình tam giác
  | { kind: "shape-count" } // Trong hình có mấy hình vuông?
  | { kind: "shape-pattern" } // Hình thích hợp đặt vào dấu ?
  // ---- Tiếng Việt (src/content/tv/) ----
  | { kind: "tv-read"; items: string[] } // Luyện đọc: chạm thẻ, Gấu đánh vần rồi đọc
  | { kind: "tv-trace"; strokes: StrokeId[] } // Tập viết nét: kéo ngón tay theo đường chấm
  | { kind: "tv-tone"; tones: Tone[] } // Dấu huyền là dấu nào? (chọn hình dấu)
  | { kind: "tv-tone-word"; tones: Tone[]; pictures?: boolean; words?: string[] } // Tiếng có dấu sắc là? (chữ hoặc hình)
  | { kind: "tv-sound"; sounds: string[] } // Vật chứa tiếng có âm a là? (hình)
  | { kind: "tv-sound-all"; sounds: string[]; words?: string[] } // Chọn tất cả hình (hoặc tiếng) có âm b
  | { kind: "tv-word-pic"; words?: string[] } // Hình đúng với tiếng hổ dữ là?
  | { kind: "tv-rhyme"; rhymes: string[]; words?: string[] } // Tiếng có vần on là? (hình; hoặc chỉ chữ khi có `words`)
  | { kind: "tv-correct-word"; words?: string[]; pairs?: [string, string][] } // Khoanh vào từ viết đúng: cà / cá · pairs = [đúng, sai]
  | { kind: "tv-wrong"; items: [string, string | null][] } // Đánh dấu X vào từ viết sai: [chữ hiện ra, cách viết đúng / null nếu đã đúng]
  | { kind: "tv-fill"; letters: string[]; words?: string[] } // Điền d hay đ: …ế · g / gh · vần am / ăm / âm
  | { kind: "tv-cloze"; items: ClozeItem[] } // Chọn từ điền vào chỗ trống trong câu
  | { kind: "tv-match"; words?: string[]; sentences?: [string, string][]; join?: "từ" | "câu" } // Đọc và nối: chữ ↔ hình, hoặc nối thành từ / câu
  | { kind: "tv-order"; sentences: string[][] } // Sắp xếp các từ thành câu (các phần theo đúng thứ tự)
  | { kind: "tv-spell"; words?: string[]; model?: boolean; letters?: string[] }; // Viết tên sự vật / tập viết: ghép âm đầu + âm thứ hai (vần) + dấu

/** One "chọn từ điền vào chỗ trống" sentence. `s` contains "…" where the word goes. */
export type ClozeItem = { s: string; options: string[]; answer: string; emoji?: string };

/** Vietnamese tones. "ngang" = no mark. */
export type Tone = "ngang" | "huyền" | "sắc" | "hỏi" | "ngã" | "nặng";

/** Basic handwriting strokes (Tuần 1 Tiếng Việt). Shapes are in src/content/tv/strokes.ts. */
export type StrokeId =
  | "ngang"
  | "so"
  | "xien-phai"
  | "xien-trai"
  | "cong-ho-phai"
  | "cong-ho-trai"
  | "cong-kin"
  | "moc-xuoi"
  | "moc-nguoc"
  | "moc-hai-dau"
  | "khuyet-tren"
  | "khuyet-duoi";

/** `emoji` may also be a shape token ("shape:tron:#e53935", see shapes.ts). `gone` = how many of the last items are crossed out (phép trừ). */
export type Group = { emoji: string; n: number; name: string; gone?: number };

export type Picture =
  | { kind: "rows"; groups: Group[] } // one row per group, columns aligned (good for pairing)
  | { kind: "side"; groups: Group[] } // boxes side by side
  | { kind: "scene"; groups: Group[]; order: number[] } // one mixed box; order = group index per item
  | { kind: "expr"; parts: (string | number)[] } // e.g. [7, "☐", 5]
  | { kind: "dice"; n: number } // dots laid out like a dice face (0–10)
  | { kind: "legend"; items: { num: number; color: string; label: string }[]; ask: number } // colour key + the number asked
  | { kind: "card"; emoji: string; parts?: string[]; mark?: string; answer?: string } // one big picture (+ word with a blank "☐"; mark = tone shown above the blank; answer = text that fills it)
  | { kind: "eq"; parts: (string | number)[]; groups?: Group[]; hidden?: boolean } // 2 + 4 = ☐ (groups above it; hidden = only shown once counted)
  | { kind: "bond"; whole: number | "☐"; parts: [number | "☐", number | "☐"]; groups?: Group[]; hidden?: boolean } // sơ đồ tách / gộp số
  | { kind: "pattern"; items: string[]; ask: number; answer: string } // dãy hình lặp lại, "?" ở vị trí ask
  | { kind: "sentence"; text: string; emoji?: string }; // câu có chỗ trống "…"

/** `label` = the written word under a picture card (shown when `labels` is on). */
export type Option = { text?: string; groups?: Group[]; label?: string };

/** A card in Tiếng Việt exercises: a picture, a written word / sentence part, or both. */
export type Card = { emoji?: string; text?: string; say: string };

/**
 * One step of the bear's walkthrough, matching the kind's method step with the same index
 * (methods.ts). `say` uses this question's real numbers.
 */
export type WalkStep = {
  say: string;
  caption?: string; // shown text, when it differs from what is spoken (e.g. "b" shown, "bờ" spoken)
  step?: number; // method step to light up (default: this walk step's index)
  focus?: number; // highlight this option / card while speaking
  labels?: boolean; // ChooseQ / SelectQ: from now on, show the written word under each picture card
  pick?: number; // SelectQ: mark this card as chosen · SpellQ: choose this tile (index into the slot's tiles)
  pair?: [number, number]; // PairQ: connect left i with right j
  show?: number[]; // ChooseQ: set `counted` (badges / blocks) before speaking
  count?: number; // ChooseQ: count this group aloud one by one (1, 2, 3…) before speaking
  fill?: boolean; // ChooseQ: show the answer now
  row?: 0 | 1; // AdjustQ: after speaking, fix this row one picture at a time, counting aloud
  cross?: boolean; // ChooseQ: cross out the `gone` items now (phép trừ)
};

type Base = {
  uid: string;
  prompt: string; // shown (may contain digits & signs)
  say?: string; // spoken, if different from prompt
  walk?: WalkStep[]; // step-by-step walkthrough (hint 3 / demo), when the kind has a method
};

export type ChooseQ = Base & {
  type: "choose";
  picture?: Picture;
  options: Option[];
  answer: number; // index into options
  style: "abc" | "big" | "cards"; // A. 4  |  big round buttons  |  picture cards
  count?: { mode: "focus"; group: number } | { mode: "all" }; // how hint 2 helps count
  hint2: string;
  reveal: string;
};

export type SequenceQ = Base & {
  type: "sequence";
  style: "train" | "flags";
  values: number[];
  blanks: number[]; // indices into values
  choices: number[][]; // for each blank (same order), the 3 number buttons
};

export type MatchQ = Base & {
  type: "match";
  groups: Group[];
  numbers: number[]; // shuffled
};

export type AdjustQ = Base & {
  type: "adjust";
  rows: [Group, Group];
  editable: [boolean, boolean];
  goal: { kind: "equal" } | { kind: "more"; row: 0 | 1 } | { kind: "counts"; counts: [number, number]; sign: string };
};

export type BasketQ = Base & { type: "basket"; n: number };

export type ColorQ = Base & { type: "color"; n: number; total: number; emoji: string; name: string };

// ---- Tiếng Việt question types ----

/** Luyện đọc: tap each card to hear it spelled and read. */
export type ReadQ = Base & { type: "read"; cards: { text: string; spell: string }[] };

/** Chọn tất cả: tap every correct card, then "Xong". */
export type SelectQ = Base & { type: "select"; cards: Card[]; correct: number[]; hint2?: string; quiet?: boolean }; // quiet: tapping a picture does not say its name

/** Nối: tap a left card, then the matching right card. answer[i] = right index for left i. */
export type PairQ = Base & { type: "pair"; left: Card[]; right: Card[]; answer: number[]; hint2?: string };

/** Ghép tiếng: for each syllable, pick âm đầu, âm thứ hai and dấu from tiles. */
export type SpellSlot = { role: "onset" | "rhyme" | "tone"; label: string; tiles: string[]; answer: number };
export type SpellQ = Base & {
  type: "spell";
  emoji?: string; // picture to name (viết tên sự vật)
  model?: string; // word to copy (tập viết)
  syllables: { text: string; slots: SpellSlot[] }[]; // âm đầu (left out when the tiếng has none) · âm thứ hai / vần · dấu
};

/** Sắp xếp thành câu: tap the parts in order. `parts` are shuffled; `order[k]` = index of the k-th part. */
export type OrderQ = Base & { type: "order"; parts: string[]; order: number[]; sentence: string };

/** Tập viết nét: drag along a dotted stroke from the green dot to the red dot. */
export type TraceQ = Base & { type: "trace"; stroke: StrokeId; name: string; d: string };

export type Question = ChooseQ | SequenceQ | MatchQ | AdjustQ | BasketQ | ColorQ | ReadQ | SelectQ | PairQ | SpellQ | TraceQ | OrderQ;

// ---- Course structure ----

export type LessonDef = {
  id: string; // e.g. "t2-l1"
  title: string;
  icon: string;
  goal: string; // one line: what the child learns (shown + spoken)
  play?: "orchard"; // optional 3D free-play step
  demo: Spec; // "Gấu làm mẫu": the bear solves one example
  practice: Spec[]; // the scored quiz (usually 5)
};

export type Subject = "toan" | "tv";

export type WeekDef = {
  subject: Subject;
  id: number; // school week number
  title: string; // "Tuần 2"
  topic: string; // "Các số từ 0 đến 10"
  dates?: string;
  color: string;
  dark: string;
  lessons: LessonDef[];
  worksheet: Spec[]; // "Phiếu bài tập" mock, mirrors the school worksheet order
};
