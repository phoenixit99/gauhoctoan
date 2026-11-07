// Turns a Tiếng Việt Spec into a concrete Question. Every question carries a `walk`:
// the bear's step-by-step walkthrough, matching the method steps in methods.ts.
import type { Card, ChooseQ, Option, PairQ, Question, ReadQ, SelectQ, Spec, SpellQ, SpellSlot, Tone, TraceQ, WalkStep } from "../types";
import { pick, shuffle } from "@/lib/vn";
import { STROKES } from "./strokes";
import {
  TONE_GLYPH,
  TONE_LOOK,
  TONE_NAME,
  ONE_TIENG,
  RANDOM_WORDS,
  VOWELS,
  hasSound,
  lacksSound,
  parseSyl,
  readAloud,
  soundSay,
  spellSyl,
  sylls,
  toneOf,
  toneTile,
  withTone,
  word,
  type Word,
} from "./words";

let seq = 0;
const uid = () => `tv${++seq}`;
const LETTERS = ["A", "B", "C", "D"];
const ALL_TONES: Tone[] = ["ngang", "huyền", "sắc", "hỏi", "ngã", "nặng"];

type TvSpec = Extract<Spec, { kind: `tv-${string}` }>;

/** "tiếng" for one syllable, "từ" for a word of several. */
const unit = (w: string) => (w.includes(" ") ? "từ" : "tiếng");

/** A one-syllable word whose vần is a single vowel (so tones and blanks are unambiguous). */
const simple = (w: string) => !w.includes(" ") && parseSyl(w).rhyme.length === 1;

/** n words with different pictures, none equal to `avoid`. */
function distinct(pool: Word[], n: number, avoid: Word[] = []): Word[] {
  const out: Word[] = [];
  for (const x of shuffle(pool)) {
    if (out.length >= n) break;
    if ([...avoid, ...out].some((y) => (x.emoji && y.emoji === x.emoji) || y.w === x.w)) continue;
    out.push(x);
  }
  if (out.length < n) throw new Error("Không đủ từ để làm câu hỏi");
  return out;
}

const picOption = (x: Word): Option => ({ groups: [{ emoji: x.emoji, n: 1, name: x.w }], label: x.w });
const names = (xs: Word[]) => xs.map((x) => x.w).join(", ");

function pictureChoice(base: { prompt: string; say: string; hint2: string; reveal: string; walk: WalkStep[] }, opts: Word[], answer: number): ChooseQ {
  return { ...base, uid: uid(), type: "choose", style: "cards", options: opts.map(picOption), answer };
}

export function generateTV(spec: TvSpec): Question {
  switch (spec.kind) {
    // ---------------- Luyện đọc ----------------
    case "tv-read": {
      const cards = spec.items.map((text) => ({ text, spell: readAloud(text) }));
      const q: ReadQ = {
        uid: uid(),
        type: "read",
        prompt: "Chạm vào từng thẻ. Nghe Gấu đọc, rồi đọc theo.",
        cards,
        walk: [
          { say: "Bước 1. Gấu chạm vào từng thẻ.", step: 0 },
          ...cards.map((c, i): WalkStep => ({ say: c.spell, caption: c.text, step: 1, focus: i })),
          { say: "Bước 3. Con đọc theo Gấu nhé.", step: 2 },
        ],
      };
      return q;
    }

    // ---------------- Tập viết nét ----------------
    case "tv-trace": {
      const id = pick(spec.strokes);
      const s = STROKES[id];
      const q: TraceQ = {
        uid: uid(),
        type: "trace",
        prompt: `Tô ${s.name}`,
        say: `Con tô ${s.name}. Bắt đầu ở chấm xanh.`,
        stroke: id,
        name: s.name,
        d: s.d,
        walk: [
          { say: "Bước 1. Đặt ngón tay vào chấm xanh." },
          { say: "Bước 2. Kéo theo đường chấm." },
          { say: `Bước 3. Dừng ở chấm đỏ. Đây là ${s.name}.` },
        ],
      };
      return q;
    }

    // ---------------- Dấu thanh ----------------
    case "tv-tone": {
      const ask = pick(spec.tones);
      // Always three marks to choose from: the one asked + two others.
      const opts = shuffle([ask, ...shuffle(ALL_TONES.filter((t) => t !== ask && t !== "ngang" && (spec.tones.length < 3 || spec.tones.includes(t)))).slice(0, 2)]);
      const answer = opts.indexOf(ask);
      const q: ChooseQ = {
        uid: uid(),
        type: "choose",
        style: "big",
        prompt: `${cap(TONE_NAME[ask])} là dấu nào?`,
        options: opts.map((t) => ({ text: TONE_GLYPH[t] })),
        answer,
        hint2: `${cap(TONE_NAME[ask])} là ${TONE_LOOK[ask]}.`,
        reveal: `Đây là ${TONE_NAME[ask]}.`,
        walk: [
          { say: `Bước 1. Gấu tìm ${TONE_NAME[ask]}.` },
          { say: `Bước 2. ${cap(TONE_NAME[ask])} là ${TONE_LOOK[ask]}.` },
          { say: `Bước 3. Dấu ${LETTERS[answer]} có hình đó. Đây là ${TONE_NAME[ask]}.`, focus: answer, fill: true },
        ],
      };
      return q;
    }

    case "tv-tone-word": {
      const t = pick(spec.tones);
      const pool = (spec.words ? spec.words.map((w) => (spec.pictures ? word(w) : { w, emoji: "" })) : RANDOM_WORDS).filter((x) => !x.w.includes(" "));
      const right = pick(pool.filter((x) => toneOf(x.w) === t));
      const others = distinct(pool.filter((x) => toneOf(x.w) !== t), 2, [right]);
      const opts = shuffle([right, ...others]);
      const answer = opts.indexOf(right);
      const per = opts.map((x, i): WalkStep => ({ say: `${x.w}: ${TONE_NAME[toneOf(x.w)]}.`, step: 1, focus: i }));
      const base = {
        prompt: `Tiếng có ${TONE_NAME[t]} là:`,
        say: spec.pictures ? `Tiếng nào có ${TONE_NAME[t]}? Các hình là: ${names(opts)}.` : `Tiếng nào có ${TONE_NAME[t]}? ${names(opts)}.`,
        hint2: spec.pictures ? `Gấu nói tên từng hình: ${names(opts)}. Tiếng nào có ${TONE_NAME[t]}?` : `${cap(TONE_NAME[t])} là ${TONE_LOOK[t]}.`,
        reveal: `Tiếng ${right.w} có ${TONE_NAME[t]}.`,
        walk: [
          spec.pictures ? { say: `Bước 1. Gấu nói tên từng hình: ${names(opts)}.`, labels: true, step: 0 } : { say: `Bước 1. Đọc từng tiếng: ${names(opts)}.`, step: 0 },
          ...per,
          { say: `Bước 3. Tiếng ${right.w} có ${TONE_NAME[t]}. Đáp án ${LETTERS[answer]}.`, step: 2, focus: answer, fill: true },
        ] as WalkStep[],
      };
      if (spec.pictures) return pictureChoice(base, opts, answer);
      return { ...base, uid: uid(), type: "choose", style: "abc", options: opts.map((x) => ({ text: x.w })), answer };
    }

    // ---------------- Tìm âm ----------------
    case "tv-sound": {
      const s = pick(spec.sounds);
      const right = pick(ONE_TIENG.filter((x) => hasSound(x.w, s)));
      const others = distinct(
        ONE_TIENG.filter((x) => lacksSound(x.w, s)),
        2,
        [right],
      );
      const opts = shuffle([right, ...others]);
      const answer = opts.indexOf(right);
      const ss = soundSay(s);
      return pictureChoice(
        {
          prompt: `Hình có âm ${s} là:`,
          say: `Tiếng nào có âm ${ss}? Các hình là: ${names(opts)}.`,
          hint2: `Gấu nói tên từng hình: ${names(opts)}. Tiếng nào có âm ${ss}?`,
          reveal: `${cap(right.w)} có âm ${ss}.`,
          walk: [
            { say: `Bước 1. Âm ${ss}.`, caption: `Bước 1. Âm ${s}.`, step: 0 },
            ...opts.map(
              (x, i): WalkStep => ({
                say: `${x.w}: ${x === right ? "có" : "không có"} âm ${ss}.`,
                caption: `${x.w}: ${x === right ? "có" : "không có"} âm ${s}.`,
                step: 1,
                focus: i,
                labels: true,
              }),
            ),
            { say: `Bước 3. ${cap(right.w)} có âm ${ss}. Đáp án ${LETTERS[answer]}.`, caption: `Bước 3. ${cap(right.w)} có âm ${s}. Đáp án ${LETTERS[answer]}.`, step: 2, focus: answer, fill: true },
          ],
        },
        opts,
        answer,
      );
    }

    case "tv-sound-all": {
      const s = pick(spec.sounds);
      const ss = soundSay(s);
      let cards: Card[];
      let isPic: boolean;
      if (spec.words) {
        isPic = false;
        cards = shuffle(spec.words).map((w) => ({ text: w, say: w }));
      } else {
        isPic = true;
        const candidates = ONE_TIENG.filter((x) => hasSound(x.w, s));
        const nRight = Math.min(pick([2, 3]), new Set(candidates.map((x) => x.emoji)).size);
        const rights = distinct(candidates, nRight);
        const wrongs = distinct(ONE_TIENG.filter((x) => lacksSound(x.w, s)), 6 - nRight, rights);
        cards = shuffle([...rights, ...wrongs]).map((x) => ({ emoji: x.emoji, text: x.w, say: x.w }));
      }
      const correct = cards.map((c, i) => (hasSound(c.say, s) ? i : -1)).filter((i) => i >= 0);
      const q: SelectQ = {
        uid: uid(),
        type: "select",
        prompt: isPic ? `Chọn tất cả hình có âm ${s}` : `Chọn tất cả tiếng có âm ${s}`,
        say: isPic ? `Con chọn tất cả hình có âm ${ss}, rồi bấm Xong.` : `Con chọn tất cả tiếng có âm ${ss}, rồi bấm Xong.`,
        cards,
        correct,
        walk: [
          { say: `Bước 1. Âm ${ss}.`, caption: `Bước 1. Âm ${s}.`, step: 0 },
          ...cards.map(
            (c, i): WalkStep => ({
              say: `${c.say}: ${correct.includes(i) ? "có" : "không có"} âm ${ss}.`,
              caption: `${c.say}: ${correct.includes(i) ? "có" : "không có"} âm ${s}.`,
              step: 1,
              focus: i,
              labels: true,
              pick: correct.includes(i) ? i : undefined,
            }),
          ),
          { say: `Bước 3. Có ${correct.length} ${isPic ? "hình" : "tiếng"} có âm ${ss}. Bấm Xong.`, caption: `Bước 3. Có ${correct.length} ${isPic ? "hình" : "tiếng"} có âm ${s}. Bấm Xong.`, step: 2 },
        ],
      };
      return q;
    }

    // ---------------- Đọc và chọn hình ----------------
    case "tv-word-pic": {
      const pool = spec.words ? spec.words.map(word) : RANDOM_WORDS;
      const right = pick(pool);
      const opts = shuffle([right, ...distinct(RANDOM_WORDS, 2, [right])]);
      const answer = opts.indexOf(right);
      const u = unit(right.w);
      return pictureChoice(
        {
          prompt: `Hình đúng với ${u} “${right.w}” là:`,
          say: `Hình nào đúng với ${u} ${right.w}?`,
          hint2: `Gấu nói tên từng hình: ${names(opts)}.`,
          reveal: `Hình này là ${right.w}.`,
          walk: [
            { say: `Bước 1. Đọc ${u}: ${readAloud(right.w)}`, caption: `Bước 1. Đọc ${u}: ${right.w}` },
            { say: `Bước 2. Gấu nói tên từng hình: ${names(opts)}.`, labels: true },
            { say: `Bước 3. Hình ${LETTERS[answer]} là ${right.w}.`, focus: answer, fill: true },
          ],
        },
        opts,
        answer,
      );
    }

    // ---------------- Từ viết đúng ----------------
    case "tv-correct-word": {
      const pool = (spec.words ? spec.words.map(word) : RANDOM_WORDS).filter((x) => simple(x.w) && parseSyl(x.w).onset);
      const right = pick(pool);
      const p = parseSyl(right.w);
      const wrongTone = pick(ALL_TONES.filter((t) => t !== p.tone && t !== "ngang"));
      const wrong = p.onset + withTone(p.rhyme, wrongTone);
      const opts = shuffle([right.w, wrong]);
      const answer = opts.indexOf(right.w);
      const q: ChooseQ = {
        uid: uid(),
        type: "choose",
        style: "abc",
        prompt: "Chọn từ viết đúng:",
        say: `Hình này là ${right.w}. Chọn từ viết đúng.`,
        picture: { kind: "card", emoji: right.emoji },
        options: opts.map((text) => ({ text })),
        answer,
        hint2: `${cap(right.w)} có ${TONE_NAME[p.tone]}.`,
        reveal: `${cap(right.w)} có ${TONE_NAME[p.tone]}. Đáp án là ${right.w}.`,
        walk: [
          { say: `Bước 1. Hình này là ${right.w}.` },
          { say: `Bước 2. Đánh vần: ${spellSyl(right.w)}. ${cap(right.w)} có ${TONE_NAME[p.tone]}.` },
          { say: `Bước 3. Từ viết đúng là ${right.w}.`, focus: answer, fill: true },
        ],
      };
      return q;
    }

    // ---------------- Điền âm ----------------
    case "tv-fill": {
      const letters = spec.letters;
      const vowelBlank = letters.every((l) => VOWELS.includes(l));
      const pool = (spec.words ? spec.words.map(word) : RANDOM_WORDS).filter((x) =>
        sylls(x.w).some((s) => (vowelBlank ? s.rhyme.length === 1 && letters.includes(s.rhyme) : letters.includes(s.onset))),
      );
      const right = pick(pool);
      const syl = sylls(right.w);
      const k = syl.findIndex((s) => (vowelBlank ? s.rhyme.length === 1 && letters.includes(s.rhyme) : letters.includes(s.onset)));
      const target = syl[k];
      const missing = vowelBlank ? target.rhyme : target.onset;
      const parts: string[] = [];
      syl.forEach((s, i) => {
        if (i > 0) parts.push(" ");
        if (i !== k) parts.push(s.text);
        else if (vowelBlank) parts.push(s.onset, "☐");
        else parts.push("☐", s.text.slice(s.onset.length));
      });
      const fillText = vowelBlank ? withTone(missing, target.tone) : missing;
      const opts = [...letters];
      const answer = opts.indexOf(missing);
      const q: ChooseQ = {
        uid: uid(),
        type: "choose",
        style: "big",
        prompt: `Điền ${letters.join(" hay ")}:`,
        say: `Điền ${letters.map(soundSay).join(" hay ")}. Hình này là ${right.w}.`,
        picture: { kind: "card", emoji: right.emoji, parts, mark: vowelBlank && target.tone !== "ngang" ? TONE_GLYPH[target.tone] : undefined, answer: fillText },
        options: opts.map((text) => ({ text })),
        answer,
        hint2: `Đánh vần: ${spellSyl(target.text)}.`,
        reveal: `${cap(right.w)}. Chữ còn thiếu là ${missing}.`,
        walk: [
          { say: `Bước 1. Hình này là ${right.w}.` },
          { say: `Bước 2. Đánh vần: ${spellSyl(target.text)}.`, caption: `Bước 2. Đánh vần: ${target.text}.` },
          { say: `Bước 3. Chữ còn thiếu là ${soundSay(missing)}.`, caption: `Bước 3. Chữ còn thiếu là ${missing}.`, focus: answer, fill: true },
        ],
      };
      return q;
    }

    // ---------------- Nối ----------------
    case "tv-match": {
      if (spec.sentences) {
        const left = spec.sentences.map(([a]) => ({ text: a, say: a }));
        const rightOrder = shuffle(spec.sentences.map((_, i) => i));
        const right = rightOrder.map((i) => ({ text: spec.sentences![i][1], say: spec.sentences![i][1] }));
        const answer = spec.sentences.map((_, i) => rightOrder.indexOf(i));
        const q: PairQ = {
          uid: uid(),
          type: "pair",
          prompt: "Nối để thành câu",
          say: "Con nối phần đầu với phần cuối để thành câu nhé.",
          left,
          right,
          answer,
          walk: spec.sentences.flatMap(([a, b], i): WalkStep[] => [
            { say: `Bước 1. Phần đầu: ${a}.`, step: 0 },
            { say: `Bước 2. Ghép với phần cuối: ${a} ${b}`, step: 1 },
            { say: `Bước 3. Nối ${a} với ${b}`, step: 2, pair: [i, answer[i]] },
          ]),
        };
        return q;
      }
      const ws = spec.words ? spec.words.map(word) : distinct(RANDOM_WORDS, 4);
      const left = ws.map((x) => ({ emoji: x.emoji, say: x.w }));
      const rightOrder = shuffle(ws.map((_, i) => i));
      const right = rightOrder.map((i) => ({ text: ws[i].w, say: ws[i].w }));
      const answer = ws.map((_, i) => rightOrder.indexOf(i));
      const q: PairQ = {
        uid: uid(),
        type: "pair",
        prompt: "Đọc và nối",
        say: "Con đọc chữ, rồi nối với hình đúng nhé.",
        left,
        right,
        answer,
        walk: ws.flatMap((x, i): WalkStep[] => [
          { say: `Bước 1. Hình này là ${x.w}.`, step: 0, focus: i },
          { say: `Bước 2. Tìm chữ ${x.w}.`, step: 1 },
          { say: `Bước 3. Nối hình với chữ ${x.w}.`, step: 2, pair: [i, answer[i]] },
        ]),
      };
      return q;
    }

    // ---------------- Ghép tiếng (viết) ----------------
    case "tv-spell": {
      const w = pick(spec.words ?? RANDOM_WORDS.filter((x) => sylls(x.w).every((s) => s.onset && s.rhyme.length === 1)).map((x) => x.w));
      const emoji = spec.model ? undefined : word(w).emoji;
      const onsetPool = spec.letters?.filter((l) => !VOWELS.includes(l)) ?? ["b", "c", "d", "đ", "h", "k", "kh", "ch", "l"];
      const vowelPool = ["a", "e", "ê", "i", "o", "ô", "ơ", "u", "ư"];
      const slot = (label: string, right: string, pool: string[]): SpellSlot => {
        const tiles = shuffle([right, ...shuffle(pool.filter((x) => x !== right)).slice(0, 2)]);
        return { label, tiles, answer: tiles.indexOf(right) };
      };
      const syllables = sylls(w).map((s) => ({
        text: s.text,
        slots: [
          slot("Âm đầu", s.onset, onsetPool),
          slot("Âm thứ hai", s.rhyme, vowelPool),
          slot("Dấu", toneTile(s.tone), ALL_TONES.map(toneTile)),
        ] as [SpellSlot, SpellSlot, SpellSlot],
      }));
      const u = unit(w);
      const q: SpellQ = {
        uid: uid(),
        type: "spell",
        prompt: spec.model ? `Viết: ${w}` : "Viết tên hình này",
        say: spec.model ? `Con ghép ${u} ${w} nhé.` : `Hình này là ${w}. Con ghép ${u} ${w} nhé.`,
        emoji,
        model: spec.model ? w : undefined,
        syllables,
        walk: syllables.flatMap((sy): WalkStep[] => {
          const p = parseSyl(sy.text);
          return [
            { say: `Bước 1. Tiếng ${sy.text}. Đánh vần: ${spellSyl(sy.text)}.`, caption: `Bước 1. Tiếng ${sy.text}.`, step: 0 },
            { say: `Bước 2. Âm đầu là ${soundSay(p.onset)}.`, caption: `Bước 2. Âm đầu là ${p.onset}.`, step: 1, pick: sy.slots[0].answer },
            { say: `Bước 3. Âm thứ hai là ${soundSay(p.rhyme)}.`, caption: `Bước 3. Âm thứ hai là ${p.rhyme}.`, step: 2, pick: sy.slots[1].answer },
            { say: `Bước 4. ${cap(TONE_NAME[p.tone])}. Được tiếng ${sy.text}.`, step: 3, pick: sy.slots[2].answer },
          ];
        }),
      };
      return q;
    }
  }
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
