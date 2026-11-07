// ---------------------------------------------------------------------------
// Tiếng Việt: word bank + syllable tools (tách âm đầu / vần / thanh, đánh vần).
//
// Word bank rules (see CONTENT.md):
//   - `w` is the bare word the school uses, WITHOUT a classifier ("chó", not "con chó"):
//     "con" has âm c and "quả" has âm a, which would make sound questions contradictory.
//   - Northern words, as on the school worksheets.
//   - Emoji supported on older iPads (no very new emoji).
// ---------------------------------------------------------------------------
import type { Tone } from "../types";

// ---- Syllables ----

const TONE_MARK: Record<Tone, string> = { ngang: "", huyền: "̀", sắc: "́", hỏi: "̉", ngã: "̃", nặng: "̣" };
const MARK_TONE: Record<string, Tone> = { "̀": "huyền", "́": "sắc", "̉": "hỏi", "̃": "ngã", "̣": "nặng" };

/** Spoken name of each tone ("dấu sắc"). Gấu always says "dấu …" (one word per concept). */
export const TONE_NAME: Record<Tone, string> = { ngang: "không dấu", huyền: "dấu huyền", sắc: "dấu sắc", hỏi: "dấu hỏi", ngã: "dấu ngã", nặng: "dấu nặng" };

/** What each mark looks like, said literally (no metaphors). */
export const TONE_LOOK: Record<Tone, string> = {
  ngang: "không có dấu",
  huyền: "một nét nghiêng, đầu trên ở bên trái, nằm trên chữ",
  sắc: "một nét nghiêng, đầu trên ở bên phải, nằm trên chữ",
  hỏi: "giống dấu chấm hỏi nhỏ, nằm trên chữ",
  ngã: "một nét lượn sóng, nằm trên chữ",
  nặng: "một dấu chấm, nằm dưới chữ",
};

/** The mark drawn on a dotted circle, for big buttons. */
export const TONE_GLYPH: Record<Tone, string> = { ngang: "◌", huyền: "◌̀", sắc: "◌́", hỏi: "◌̉", ngã: "◌̃", nặng: "◌̣" };

const ONSETS = ["ngh", "ng", "nh", "ch", "kh", "gh", "ph", "th", "tr", "gi", "qu", "b", "c", "d", "đ", "g", "h", "k", "l", "m", "n", "p", "r", "s", "t", "v", "x"];
export const VOWELS = ["a", "ă", "â", "e", "ê", "i", "o", "ô", "ơ", "u", "ư", "y"];

/** How Gấu says a sound on its own (âm "b" is said "bờ"). */
const SOUND_SAY: Record<string, string> = {
  b: "bờ", c: "cờ", d: "dờ", đ: "đờ", g: "gờ", gh: "gờ kép", h: "hờ", k: "ca", kh: "khờ", ch: "chờ", l: "lờ", m: "mờ", n: "nờ",
  nh: "nhờ", ng: "ngờ", ngh: "ngờ kép", ph: "phờ", th: "thờ", tr: "trờ", s: "sờ", x: "xờ", r: "rờ", v: "vờ", t: "tờ", p: "pờ",
  gi: "di", qu: "quờ",
  a: "a", ă: "á", â: "ớ", e: "e", ê: "ê", i: "i", o: "o", ô: "ô", ơ: "ơ", u: "u", ư: "ư", y: "i dài",
};
export const soundSay = (s: string) => SOUND_SAY[s.toLowerCase()] ?? s;

export type Syl = { text: string; onset: string; rhyme: string; tone: Tone };

/** "bế" → { onset: "b", rhyme: "ê", tone: "sắc" }. */
export function parseSyl(text: string): Syl {
  const lower = text.toLowerCase();
  let tone: Tone = "ngang";
  const stripped = [...lower.normalize("NFD")]
    .filter((ch) => {
      if (MARK_TONE[ch]) {
        tone = MARK_TONE[ch];
        return false;
      }
      return true;
    })
    .join("")
    .normalize("NFC");
  const onset = ONSETS.find((o) => stripped.startsWith(o) && stripped.length > o.length) ?? "";
  return { text: lower, onset, rhyme: stripped.slice(onset.length), tone };
}

export const sylls = (w: string): Syl[] => w.replace(/[.,!?]/g, "").split(/\s+/).filter(Boolean).map(parseSyl);

/** Put a tone mark on a single-vowel rhyme: ("ê", "sắc") → "ế". */
export function withTone(rhyme: string, tone: Tone): string {
  if (rhyme.length !== 1) throw new Error(`withTone only handles one vowel: ${rhyme}`);
  return (rhyme + TONE_MARK[tone]).normalize("NFC");
}

export const toneOf = (w: string): Tone => parseSyl(w).tone;

/** Word without tone marks ("bế" → "bê"). */
export const toneless = (w: string) => sylls(w).map((s) => s.onset + s.rhyme).join(" ");

/** Vần with a double vowel or glide (cua, dừa, hoa, chuối…): we never say these "have âm a / u / o". */
const COMPLEX = /uô|ươ|iê|yê|ua|ưa|ia|oa|oe|uy|uâ/;

/** Does the word clearly contain âm `s`? (as âm đầu, or as the first vowel of a plain vần: cá, cam, táo) */
export const hasSound = (w: string, s: string) =>
  sylls(w).some((x) => x.onset === s || (VOWELS.includes(s) && !COMPLEX.test(x.rhyme) && x.rhyme.startsWith(s)));

/** Âm that sound the same (or are written by a rule): a distractor must contain none of them. */
const SAME_SOUND = [["g", "gh"], ["ng", "ngh"], ["c", "k", "qu"], ["s", "x"], ["ch", "tr"], ["d", "gi", "r"]];

/**
 * Safe distractor: the letter(s) of `s` do not appear anywhere (so "chó" never stands in for âm c),
 * and neither do letters with the same sound ("gà" is never a distractor for âm gh).
 */
export const lacksSound = (w: string, s: string) => {
  const t = toneless(w);
  const group = SAME_SOUND.find((gr) => gr.includes(s)) ?? [s];
  return [s, ...group].every((x) => !t.includes(x));
};

/** Is `s` a vần of several letters (an, ao, ia…), not an âm? */
export const isRhyme = (s: string) => s.length > 1 && !ONSETS.includes(s);

/** "âm" or "vần" — the word Gấu uses for `s`. */
export const unitOf = (s: string) => (isRhyme(s) ? "vần" : "âm");

/** Does a tiếng of the word have exactly vần `r`? */
export const hasRhyme = (w: string, r: string) => sylls(w).some((x) => x.rhyme === r);

/** Safe distractor for vần `r`: the letters of `r` appear nowhere (so "bóng" never stands in for vần on). */
export const lacksRhyme = (w: string, r: string) => !toneless(w).includes(r);

/** The tone-marked vần of a tiếng, taken from the real word ("tắm" → "ắm"), so no tone placement rule is needed. */
export const rhymeText = (syl: Syl) => syl.text.slice(syl.onset.length);

/** Đánh vần one syllable, the way it is taught: "bờ, ê, bê, sắc, bế". */
export function spellSyl(text: string): string {
  const s = parseSyl(text);
  const base = s.onset + s.rhyme;
  const parts: string[] = [];
  if (s.onset) parts.push(soundSay(s.onset), s.rhyme.length === 1 ? soundSay(s.rhyme) : s.rhyme, base);
  else parts.push(s.rhyme.length === 1 ? soundSay(s.rhyme) : s.rhyme);
  if (s.tone !== "ngang") parts.push(TONE_NAME[s.tone].replace("dấu ", ""), s.text);
  return parts.join(", ");
}

/** What Gấu says for a reading card: a letter, a syllable / word (spelled, then read), or a sentence (read). */
export function readAloud(item: string): string {
  const t = item.trim();
  if (/[.!?]$/.test(t)) return t;
  const lower = t.toLowerCase();
  if (SOUND_SAY[lower] && !VOWELS.includes(lower)) return `âm ${soundSay(lower)}`;
  if (VOWELS.includes(lower)) return `âm ${lower}`;
  if (isRhyme(lower) && !lower.includes(" ") && parseSyl(lower).onset === "" && parseSyl(lower).tone === "ngang") return `vần ${lower}`;
  const words = t.split(/\s+/);
  if (words.length === 1) return `${spellSyl(t)}.`;
  return `${words.map((x) => `${spellSyl(x)}.`).join(" ")} ${t}.`;
}

/** Tone tiles in "ghép tiếng": the mark, or the words "không dấu". */
export const toneTile = (t: Tone) => (t === "ngang" ? "không dấu" : TONE_GLYPH[t]);
export const tileTone = (tile: string): Tone => (Object.keys(TONE_GLYPH) as Tone[]).find((t) => toneTile(t) === tile) ?? "ngang";

// ---- Word bank ----

/** `late`: the word has a vần of several letters (an, ao, ia…). Only used where a week names it, or in vần questions. */
export type Word = { w: string; emoji: string; late?: boolean };

export const WORDS: Word[] = [
  { w: "bà", emoji: "👵" },
  { w: "bé", emoji: "👶" },
  { w: "bố", emoji: "👨" },
  { w: "bò", emoji: "🐄" },
  { w: "bơ", emoji: "🥑" },
  { w: "ba", emoji: "3️⃣" },
  { w: "ba ba", emoji: "🐢" },
  { w: "cá", emoji: "🐟" },
  { w: "cú", emoji: "🦉" },
  { w: "cờ", emoji: "🚩" },
  { w: "cỏ", emoji: "🌱" },
  { w: "cua", emoji: "🦀" },
  { w: "cam", emoji: "🍊" },
  { w: "táo", emoji: "🍎" },
  { w: "đào", emoji: "🍑" },
  { w: "dừa", emoji: "🥥" },
  { w: "kéo", emoji: "✂️" },
  { w: "ô", emoji: "☂️" },
  { w: "chó", emoji: "🐶" },
  { w: "gà", emoji: "🐔" },
  { w: "lá", emoji: "🍃" },
  { w: "nhà", emoji: "🏠" },
  { w: "hổ", emoji: "🐯" },
  { w: "hà mã", emoji: "🦛" },
  { w: "hoa", emoji: "🌸" },
  { w: "khỉ", emoji: "🐒" },
  { w: "chè", emoji: "🍵" },
  { w: "kẹo", emoji: "🍬" },
  { w: "xe", emoji: "🚲" },
  { w: "dê", emoji: "🐐" },
  { w: "dế", emoji: "🦗" },
  { w: "dù", emoji: "🪂" },
  { w: "đò", emoji: "🛶" },
  { w: "đũa", emoji: "🥢" },
  { w: "sư tử", emoji: "🦁" },
  { w: "bí đỏ", emoji: "🎃" },
  { w: "kì đà", emoji: "🦎" },
  { w: "lá khô", emoji: "🍂" },
  { w: "lá chè", emoji: "🌿" },
  { w: "đi bộ", emoji: "🚶" },
  { w: "ô tô", emoji: "🚗" },
  { w: "nho", emoji: "🍇" },
  { w: "mắt", emoji: "👀" },
  { w: "gấu", emoji: "🐻" },
  { w: "chuối", emoji: "🍌" },
  { w: "cà chua", emoji: "🍅" },
  { w: "cà tím", emoji: "🍆" },
  { w: "hổ dữ", emoji: "🐯" },
  // ---- Tuần 5–11 (âm g, gh, gi, m, n, nh, ng, ngh, r, s, t, th, tr, ph, qu, v, x, y; vần) ----
  ...[
    // âm / vần một chữ cái
    { w: "mẹ", emoji: "👩" },
    { w: "mũ", emoji: "🧢" },
    { w: "ngô", emoji: "🌽" },
    { w: "ghế", emoji: "🪑" },
    { w: "giỏ", emoji: "🧺" },
    { w: "nghé", emoji: "🐃" },
    { w: "ngủ", emoji: "😴" },
    { w: "sò", emoji: "🐚" },
    { w: "thỏ", emoji: "🐰" },
    { w: "thư", emoji: "✉️" },
    { w: "tre", emoji: "🎋" },
    { w: "phở", emoji: "🍜" },
    { w: "quà", emoji: "🎁" },
    { w: "ca nô", emoji: "🚤" },
    { w: "cụ già", emoji: "👴" },
    { w: "ghế gỗ", emoji: "🪑" },
    { w: "ghế đá", emoji: "🪑" },
    { w: "giỏ ngô", emoji: "🧺" },
    { w: "giá đỗ", emoji: "🌱" },
    { w: "mỏ", emoji: "🦜" },
    { w: "nghe", emoji: "🎧" },
    { w: "ghẹ", emoji: "" },
    { w: "nụ", emoji: "🌷" },
    { w: "nổ", emoji: "💥" },
    { w: "y tá", emoji: "👩‍⚕️" },
    { w: "củ nghệ", emoji: "" },
    // vần
    { w: "sữa", emoji: "🥛" },
    { w: "thìa", emoji: "🥄" },
    { w: "mưa", emoji: "🌧️" },
    { w: "ngựa", emoji: "🐴" },
    { w: "cửa", emoji: "🚪" },
    { w: "mèo", emoji: "🐱" },
    { w: "nấm", emoji: "🍄" },
    { w: "tắm", emoji: "🛀" },
    { w: "voi", emoji: "🐘" },
    { w: "cơm", emoji: "🍚" },
    { w: "tôm", emoji: "🦐" },
    { w: "kem", emoji: "🍦" },
    { w: "chim", emoji: "🐦" },
    { w: "tai", emoji: "👂" },
    { w: "nồi", emoji: "🍲" },
    { w: "mây", emoji: "☁️" },
    { w: "lều", emoji: "⛺" },
    { w: "cầu", emoji: "🌉" },
    { w: "rau", emoji: "🥬" },
    { w: "dâu", emoji: "🍓" },
    { w: "sao", emoji: "⭐" },
    { w: "cáo", emoji: "🦊" },
    { w: "dao", emoji: "🔪" },
    { w: "son", emoji: "💄" },
    { w: "lợn", emoji: "🐷" },
    { w: "bốn", emoji: "4️⃣" },
    { w: "đàn", emoji: "🎸" },
    { w: "khăn", emoji: "🧣" },
    { w: "cân", emoji: "⚖️" },
    { w: "nến", emoji: "🕯️" },
    { w: "kèn", emoji: "🎺" },
    { w: "pin", emoji: "🔋" },
    { w: "nai", emoji: "🦌" },
    { w: "tay", emoji: "✋" },
    { w: "cây", emoji: "🌳" },
    { w: "dơi", emoji: "🦇" },
    { w: "chổi", emoji: "🧹" },
    { w: "rìu", emoji: "🪓" },
    { w: "cừu", emoji: "🐑" },
    { w: "ớt", emoji: "🌶️" },
    { w: "tất", emoji: "🧦" },
    { w: "bát", emoji: "🥣" },
    { w: "sóc", emoji: "🐿️" },
    { w: "mực", emoji: "🦑" },
    { w: "bút", emoji: "✏️" },
    { w: "nhạc", emoji: "🎵" },
    { w: "lạc", emoji: "🥜" },
    { w: "tía tô", emoji: "🌿" },
    { w: "sữa chua", emoji: "🥛" },
    { w: "quả dừa", emoji: "🥥" },
    { w: "bến xe", emoji: "🚏" },
    { w: "ăn cơm", emoji: "🍚" },
    { w: "đèn pin", emoji: "🔦" },
    { w: "bạn thân", emoji: "👭" },
    { w: "quả cam", emoji: "🍊" },
    { w: "nắm cơm", emoji: "🍙" },
    { w: "tam ca", emoji: "👯" },
    { w: "thủ môn", emoji: "🥅" },
    { w: "thợ sơn", emoji: "👷" },
    { w: "ngựa vằn", emoji: "🦓" },
    { w: "cái lều", emoji: "⛺" },
    { w: "châu chấu", emoji: "🦗" },
    { w: "rau củ", emoji: "🥕" },
    { w: "mèo con", emoji: "🐱" },
    { w: "dưa hấu", emoji: "🍉" },
    { w: "câu cá", emoji: "🎣" },
    { w: "gấu trúc", emoji: "🐼" },
    { w: "tức giận", emoji: "😠" },
    { w: "ốc sên", emoji: "🐌" },
    { w: "học bài", emoji: "📖" },
    { w: "tắc kè", emoji: "" },
    { w: "hạt lạc", emoji: "🥜" },
    { w: "bột mì", emoji: "🌾" },
    { w: "sốt cao", emoji: "🤒" },
    { w: "cái vợt", emoji: "🏸" },
    { w: "rửa bát", emoji: "🍽️" },
    { w: "mặt trời", emoji: "☀️" },
    { w: "con sóc", emoji: "🐿️" },
    { w: "bác sĩ", emoji: "👨‍⚕️" },
    { w: "áo ấm", emoji: "🧥" },
    { w: "hạt dẻ", emoji: "🌰" },
    { w: "máy bay", emoji: "✈️" },
  ].map((x) => ({ ...x, late: x.w.split(" ").some((t) => parseSyl(t).rhyme.length > 1) })),
];

/**
 * Words only used when a week names them: look-alike or repeated pictures
 * (🍃 lá vs 🌿 lá chè vs 🍂 lá khô; 🪑 ghế vs ghế gỗ…), or words without a picture.
 */
const NAMED_ONLY = [
  "lá chè", "lá khô", "ghế gỗ", "ghế đá", "giỏ ngô", "giá đỗ", "mỏ", "nghe", "ghẹ", "nụ", "nổ", "y tá", "củ nghệ",
  "tía tô", "sữa chua", "quả dừa", "ăn cơm", "quả cam", "tam ca", "cái lều", "châu chấu", "mèo con", "tắc kè",
  "hạt lạc", "con sóc", "nắm cơm", "thợ sơn", "rau củ",
];

/**
 * Pictures shared by two different words (no better emoji on older iPads). Only used where a week
 * names the word, never in the same question: 🌿 lá chè / tía tô · 🦗 dế / châu chấu · 🌱 cỏ / giá đỗ · 🪑 ghế gỗ / ghế đá.
 */
export const SHARED_EMOJI_OK = [["lá chè", "tía tô"], ["dế", "châu chấu"], ["cỏ", "giá đỗ"], ["hổ", "hổ dữ"], ["ghế gỗ", "ghế đá"]];

/** Pool for randomly chosen pictures (words a child can name before learning vần of several letters). */
export const RANDOM_WORDS = WORDS.filter((x) => !NAMED_ONLY.includes(x.w) && !x.late && x.emoji);

/** One-tiếng words, for "Tiếng nào có âm …?" questions. */
export const ONE_TIENG = RANDOM_WORDS.filter((x) => !x.w.includes(" "));

/** One-tiếng words for "Tiếng nào có vần …?" questions (vần words included). */
export const RHYME_WORDS = WORDS.filter((x) => !NAMED_ONLY.includes(x.w) && x.emoji && !x.w.includes(" "));

export const word = (w: string): Word => {
  const x = WORDS.find((o) => o.w === w);
  if (!x) throw new Error(`Từ chưa có trong kho: ${w}`);
  return x;
};

/** A word from the bank, or the bare text with no picture (for words the bank has no picture for). */
export const wordOrText = (w: string): Word => WORDS.find((o) => o.w === w) ?? { w, emoji: "" };

