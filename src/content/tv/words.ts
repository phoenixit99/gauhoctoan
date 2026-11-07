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

export type Word = { w: string; emoji: string };

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
];

/** Words only used when a week names them (look-alike pictures: 🍃 lá vs 🌿 lá chè vs 🍂 lá khô). */
const NAMED_ONLY = ["lá chè", "lá khô"];

/** Pool for randomly chosen pictures. */
export const RANDOM_WORDS = WORDS.filter((x) => !NAMED_ONLY.includes(x.w));

/** One-tiếng words, for "Tiếng nào có âm …?" questions. */
export const ONE_TIENG = RANDOM_WORDS.filter((x) => !x.w.includes(" "));

export const word = (w: string): Word => {
  const x = WORDS.find((o) => o.w === w);
  if (!x) throw new Error(`Từ chưa có trong kho: ${w}`);
  return x;
};

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
  b: "bờ", c: "cờ", d: "dờ", đ: "đờ", g: "gờ", gh: "gờ", h: "hờ", k: "ca", kh: "khờ", ch: "chờ", l: "lờ", m: "mờ", n: "nờ",
  nh: "nhờ", ng: "ngờ", ngh: "ngờ", ph: "phờ", th: "thờ", tr: "trờ", s: "sờ", x: "xờ", r: "rờ", v: "vờ", t: "tờ", p: "pờ",
  a: "a", ă: "á", â: "ớ", e: "e", ê: "ê", i: "i", o: "o", ô: "ô", ơ: "ơ", u: "u", ư: "ư", y: "i",
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

/** Safe distractor: the letter(s) of `s` do not appear anywhere (so "chó" never stands in for âm c). */
export const lacksSound = (w: string, s: string) => !toneless(w).includes(s);

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
  const words = t.split(/\s+/);
  if (words.length === 1) return `${spellSyl(t)}.`;
  return `${words.map((x) => `${spellSyl(x)}.`).join(" ")} ${t}.`;
}

/** Tone tiles in "ghép tiếng": the mark, or the words "không dấu". */
export const toneTile = (t: Tone) => (t === "ngang" ? "không dấu" : TONE_GLYPH[t]);
export const tileTone = (tile: string): Tone => (Object.keys(TONE_GLYPH) as Tone[]).find((t) => toneTile(t) === tile) ?? "ngang";
