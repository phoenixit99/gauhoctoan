// Turns a Tiếng Việt Spec into a concrete Question. Every question carries a `walk`:
// the bear's step-by-step walkthrough, matching the method steps in methods.ts.
import type { Card, ChooseQ, Option, OrderQ, PairQ, Question, ReadQ, SelectQ, Spec, SpellQ, SpellSlot, Tone, TraceQ, WalkStep } from "../types";
import { pick, shuffle } from "@/lib/vn";
import { STROKES } from "./strokes";
import {
  TONE_GLYPH,
  TONE_LOOK,
  TONE_NAME,
  ONE_TIENG,
  RANDOM_WORDS,
  RHYME_WORDS,
  VOWELS,
  hasRhyme,
  hasSound,
  isRhyme,
  lacksRhyme,
  rhymeText,
  wordOrText,
  type Syl,
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

    // ---------------- Tìm vần ----------------
    case "tv-rhyme": {
      const pool = spec.words ? spec.words.map(word) : RHYME_WORDS;
      const usable = spec.rhymes.filter((r) => pool.some((x) => hasRhyme(x.w, r)));
      if (!usable.length) throw new Error(`Không có hình cho vần ${spec.rhymes.join(", ")}`);
      const r = pick(usable);
      const right = pick(pool.filter((x) => hasRhyme(x.w, r)));
      const others = distinct(
        (spec.words ? pool : RHYME_WORDS).filter((x) => lacksRhyme(x.w, r)),
        2,
        [right],
      );
      const opts = shuffle([right, ...others]);
      const answer = opts.indexOf(right);
      return pictureChoice(
        {
          prompt: `Tiếng có vần ${r} là:`,
          say: `Tiếng nào có vần ${r}? Các hình là: ${names(opts)}.`,
          hint2: `Gấu nói tên từng hình: ${names(opts)}. Tiếng nào có vần ${r}?`,
          reveal: `${cap(right.w)} có vần ${r}.`,
          walk: [
            { say: `Bước 1. Vần ${r}.`, step: 0 },
            ...opts.map((x, i): WalkStep => ({ say: `${x.w}: ${x === right ? "có" : "không có"} vần ${r}.`, step: 1, focus: i, labels: true })),
            { say: `Bước 3. ${cap(right.w)} có vần ${r}. Đáp án ${LETTERS[answer]}.`, step: 2, focus: answer, fill: true },
          ],
        },
        opts,
        answer,
      );
    }

    // ---------------- Từ viết đúng ----------------
    case "tv-correct-word": {
      if (spec.pairs) {
        const [rightW, wrongW] = pick(spec.pairs);
        const pic = wordOrText(rightW);
        const opts = shuffle([rightW, wrongW]);
        const answer = opts.indexOf(rightW);
        const why = spellingReason(rightW, wrongW);
        const named = pic.emoji ? `Hình này là ${rightW}.` : `Gấu đọc: ${rightW}.`;
        const q: ChooseQ = {
          uid: uid(),
          type: "choose",
          style: "abc",
          prompt: "Chọn từ viết đúng:",
          say: `${named} Chọn từ viết đúng.`,
          picture: pic.emoji ? { kind: "card", emoji: pic.emoji } : undefined,
          options: opts.map((text) => ({ text })),
          answer,
          hint2: why.say,
          reveal: `${why.say} Từ viết đúng là ${rightW}.`,
          walk: [
            { say: `Bước 1. ${named}` },
            { say: `Bước 2. ${why.say}`, caption: `Bước 2. ${why.caption}` },
            { say: `Bước 3. Từ viết đúng là ${rightW}.`, focus: answer, fill: true },
          ],
        };
        return q;
      }
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

    // ---------------- Từ viết sai ----------------
    case "tv-wrong": {
      const items = shuffle(spec.items);
      const cards: Card[] = items.map(([w]) => ({ text: w, say: w }));
      const correct = items.map(([, fix], i) => (fix ? i : -1)).filter((i) => i >= 0);
      const q: SelectQ = {
        uid: uid(),
        type: "select",
        prompt: "Chọn tất cả từ viết sai",
        say: "Con đọc từng từ. Chọn tất cả từ viết sai, rồi bấm Xong.",
        cards,
        correct,
        hint2: `Có ${correct.length} từ viết sai. Con đọc chậm từng từ.${items.some(([w, fix]) => fix && ruleBased(fix, w)) ? " Nhớ: trước i, e, ê viết gh và ngh." : ""}`,
        walk: [
          { say: "Bước 1. Gấu đọc từng từ.", step: 0 },
          ...items.map(([w, fix], i): WalkStep => {
            if (!fix) return { say: `${w}: viết đúng.`, step: 1, focus: i };
            const why = spellingReason(fix, w);
            return { say: `${w}: viết sai. Viết đúng là ${fix}. ${why.say}`, caption: `${w}: viết sai. Viết đúng là ${fix}. ${why.caption}`, step: 1, focus: i, pick: i };
          }),
          { say: `Bước 3. Có ${correct.length} từ viết sai. Bấm Xong.`, step: 2 },
        ],
      };
      return q;
    }

    // ---------------- Điền âm / vần ----------------
    case "tv-fill": {
      const letters = spec.letters;
      const rhymeBlank = letters.every((l) => VOWELS.includes(l) || isRhyme(l));
      const fits = (s: Syl) => (rhymeBlank ? letters.includes(s.rhyme) : letters.includes(s.onset));
      const pool = (spec.words ? spec.words.map(wordOrText) : RANDOM_WORDS).filter((x) => sylls(x.w).some(fits));
      if (!pool.length) throw new Error(`Không có từ để điền ${letters.join("/")}`);
      const right = pick(pool);
      const syl = sylls(right.w);
      const k = pick(syl.map((s, i) => (fits(s) ? i : -1)).filter((i) => i >= 0));
      const target = syl[k];
      const missing = rhymeBlank ? target.rhyme : target.onset;
      const parts: string[] = [];
      syl.forEach((s, i) => {
        if (i > 0) parts.push(" ");
        if (i !== k) parts.push(s.text);
        else if (rhymeBlank) parts.push(s.onset, "☐");
        else parts.push("☐", s.text.slice(s.onset.length));
      });
      const fillText = rhymeBlank ? rhymeText(target) : missing;
      const opts = [...letters];
      const answer = opts.indexOf(missing);
      const u = rhymeBlank && letters.some(isRhyme) ? "vần" : "chữ";
      const named = right.emoji ? `Hình này là ${right.w}.` : `Gấu đọc: ${right.w}.`;
      const rule = fillRule(letters, target);
      const q: ChooseQ = {
        uid: uid(),
        type: "choose",
        style: "big",
        prompt: `Điền ${letters.join(" hay ")}:`,
        say: `Điền ${letters.map(soundSay).join(" hay ")}. ${named}`,
        picture: { kind: "card", emoji: right.emoji, parts, mark: rhymeBlank && target.tone !== "ngang" ? TONE_GLYPH[target.tone] : undefined, answer: fillText },
        options: opts.map((text) => ({ text })),
        answer,
        hint2: rule ? rule.say : `Đánh vần: ${spellSyl(target.text)}.`,
        reveal: `${cap(right.w)}. ${cap(u)} còn thiếu là ${missing}.`,
        walk: [
          { say: `Bước 1. ${named}` },
          { say: `Bước 2. Đánh vần: ${spellSyl(target.text)}.`, caption: `Bước 2. Đánh vần: ${target.text}.` },
          rule
            ? { say: `Bước 3. ${rule.say} ${cap(u)} còn thiếu là ${soundSay(missing)}.`, caption: `Bước 3. ${rule.caption} ${cap(u)} còn thiếu là ${missing}.`, focus: answer, fill: true }
            : { say: `Bước 3. ${cap(u)} còn thiếu là ${soundSay(missing)}.`, caption: `Bước 3. ${cap(u)} còn thiếu là ${missing}.`, focus: answer, fill: true },
        ],
      };
      return q;
    }

    // ---------------- Chọn từ điền vào câu ----------------
    case "tv-cloze": {
      const it = pick(spec.items);
      const opts = shuffle(it.options);
      const answer = opts.indexOf(it.answer);
      const full = (w: string) => it.s.replace("…", w);
      const blankSay = it.s.replace("…", "chỗ trống");
      const q: ChooseQ = {
        uid: uid(),
        type: "choose",
        style: "abc",
        prompt: "Chọn từ điền vào chỗ trống:",
        say: `${it.emoji ? "Nhìn hình. " : ""}Chọn từ điền vào chỗ trống. ${blankSay}`,
        picture: { kind: "sentence", text: it.s, emoji: it.emoji },
        options: opts.map((text) => ({ text })),
        answer,
        hint2: `Thử từng từ: ${opts.map(full).join(" ")}`,
        reveal: `Câu đúng là: ${full(it.answer)}`,
        walk: [
          { say: `Bước 1. Đọc câu: ${blankSay}`, caption: `Bước 1. Đọc câu: ${it.s}`, step: 0 },
          ...opts.map((w, i): WalkStep => ({ say: `Thử từ ${w}: ${full(w)}`, step: 1, focus: i })),
          { say: `Bước 3. Từ ${it.answer} đúng với câu${it.emoji ? " và với hình" : ""}. Câu đúng là: ${full(it.answer)}`, step: 2, focus: answer, fill: true },
        ],
      };
      return q;
    }

    // ---------------- Nối ----------------
    case "tv-match": {
      if (spec.sentences) {
        const isWord = spec.join === "từ";
        const left = spec.sentences.map(([a]) => ({ text: a, say: a }));
        const rightOrder = shuffle(spec.sentences.map((_, i) => i));
        const right = rightOrder.map((i) => ({ text: spec.sentences![i][1], say: spec.sentences![i][1] }));
        const answer = spec.sentences.map((_, i) => rightOrder.indexOf(i));
        const q: PairQ = {
          uid: uid(),
          type: "pair",
          prompt: isWord ? "Nối để tạo thành từ" : "Nối để thành câu",
          say: isWord ? "Con nối hai tiếng để tạo thành từ nhé." : "Con nối phần đầu với phần cuối để thành câu nhé.",
          left,
          right,
          answer,
          walk: spec.sentences.flatMap(([a, b], i): WalkStep[] => [
            { say: `Bước 1. Phần đầu: ${a}.`, step: 0, focus: i },
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

    // ---------------- Sắp xếp thành câu ----------------
    case "tv-order": {
      const ordered = pick(spec.sentences);
      let idx = shuffle(ordered.map((_, i) => i));
      for (let t = 0; t < 5 && idx.every((v, i) => v === i); t++) idx = shuffle(idx);
      const parts = idx.map((i) => ordered[i]);
      const order = ordered.map((_, k) => idx.indexOf(k));
      const sentence = ordered.join(" ");
      const q: OrderQ = {
        uid: uid(),
        type: "order",
        prompt: "Sắp xếp thành câu",
        say: "Con chạm vào từng thẻ theo đúng thứ tự để thành câu nhé.",
        parts,
        order,
        sentence,
        walk: [
          { say: `Bước 1. Gấu đọc từng thẻ: ${parts.map(bare).join(", ")}.`, step: 0 },
          ...ordered.map((p, k): WalkStep => ({
            say: k === 0 ? `Bước 2. Thẻ có chữ viết hoa đứng đầu câu: ${bare(p)}.` : `Tiếp theo: ${bare(p)}.`,
            step: 1,
            pick: order[k],
          })),
          { say: `Bước 3. Đọc lại câu: ${sentence}`, step: 2 },
        ],
      };
      return q;
    }

    // ---------------- Ghép tiếng (viết) ----------------
    case "tv-spell": {
      const w = pick(spec.words ?? RANDOM_WORDS.filter((x) => sylls(x.w).every((s) => s.onset && s.rhyme.length === 1)).map((x) => x.w));
      const emoji = spec.model ? undefined : word(w).emoji;
      const onsetPool = spec.letters?.filter((l) => !VOWELS.includes(l)) ?? ["b", "c", "d", "đ", "h", "k", "kh", "ch", "l"];
      const slot = (role: SpellSlot["role"], label: string, right: string, pool: string[]): SpellSlot => {
        const tiles = shuffle([right, ...shuffle(pool.filter((x) => x !== right)).slice(0, 2)]);
        return { role, label, tiles, answer: tiles.indexOf(right) };
      };
      const syllables = sylls(w).map((s) => ({
        text: s.text,
        slots: [
          ...(s.onset ? [slot("onset", "Âm đầu", s.onset, [...new Set([...onsetPool, ...DEFAULT_ONSETS])])] : []),
          s.rhyme.length > 1
            ? slot("rhyme", "Vần", s.rhyme, rhymeLike(s.rhyme))
            : slot("rhyme", "Âm thứ hai", s.rhyme, SINGLE_VOWELS.filter((v) => !(s.rhyme === "y" && v === "i"))),
          slot("tone", "Dấu", toneTile(s.tone), ALL_TONES.map(toneTile)),
        ],
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
          const get = (role: SpellSlot["role"]) => sy.slots.find((x) => x.role === role)!;
          const rhymeWord = p.rhyme.length > 1 ? "Vần" : "Âm thứ hai";
          return [
            { say: `Bước 1. Tiếng ${sy.text}. Đánh vần: ${spellSyl(sy.text)}.`, caption: `Bước 1. Tiếng ${sy.text}.`, step: 0 },
            ...(p.onset
              ? [{ say: `Bước 2. Âm đầu là ${soundSay(p.onset)}.`, caption: `Bước 2. Âm đầu là ${p.onset}.`, step: 1, pick: get("onset").answer }]
              : [{ say: "Bước 2. Tiếng này không có âm đầu.", step: 1 }]),
            {
              say: `Bước 3. ${rhymeWord} là ${p.rhyme.length > 1 ? p.rhyme : soundSay(p.rhyme)}.`,
              caption: `Bước 3. ${rhymeWord} là ${p.rhyme}.`,
              step: 2,
              pick: get("rhyme").answer,
            },
            { say: `Bước 4. ${cap(TONE_NAME[p.tone])}. Được tiếng ${sy.text}.`, step: 3, pick: get("tone").answer },
          ];
        }),
      };
      return q;
    }
  }
}

/** A sentence part without its final punctuation, for reading it inside a longer line. */
const bare = (p: string) => p.replace(/[.!?]+$/, "");

const DEFAULT_ONSETS = ["b", "c", "d", "đ", "h", "l", "m", "n", "t", "s"];
const SINGLE_VOWELS = ["a", "e", "ê", "i", "o", "ô", "ơ", "u", "ư"];
const ALL_RHYMES = [
  "ia", "ua", "ưa", "an", "ăn", "ân", "on", "ôn", "ơn", "en", "ên", "in", "un", "am", "ăm", "âm", "om", "ôm", "ơm", "em", "êm", "im", "um",
  "ai", "ay", "ây", "oi", "ôi", "ơi", "ao", "eo", "au", "âu", "êu", "iu", "ưu", "ac", "ăc", "âc", "oc", "ôc", "uc", "ưc", "at", "ăt", "ât", "ot", "ôt", "ơt",
];

/** Distractor vần for a tile: same first letter or same last letter (ăm → am, âm, ăn). */
function rhymeLike(r: string): string[] {
  const near = ALL_RHYMES.filter((x) => x !== r && (x[0] === r[0] || x.at(-1) === r.at(-1)));
  return near.length >= 2 ? near : ALL_RHYMES.filter((x) => x !== r);
}

/** Letters that sound the same and follow a written rule: g / gh, ng / ngh, c / k. */
const RULE_PAIRS: { a: string; b: string; say: string; caption: string }[] = [
  { a: "g", b: "gh", say: "Trước i, e, ê viết gờ kép. Còn lại viết gờ.", caption: "Trước i, e, ê viết gh. Còn lại viết g." },
  { a: "ng", b: "ngh", say: "Trước i, e, ê viết ngờ kép. Còn lại viết ngờ.", caption: "Trước i, e, ê viết ngh. Còn lại viết ng." },
  { a: "c", b: "k", say: "Trước i, e, ê viết ca. Còn lại viết cờ.", caption: "Trước i, e, ê viết k. Còn lại viết c." },
];
const FRONT = ["i", "e", "ê", "y"];

/** For fills of g/gh, ng/ngh, c/k: the written rule applied to this tiếng. For s/x, ch/tr, d/gi: "nhớ cách viết". */
function fillRule(letters: string[], target: Syl): { say: string; caption: string } | null {
  const pair = RULE_PAIRS.find((p) => letters.includes(p.a) && letters.includes(p.b));
  const first = target.rhyme.charAt(0);
  if (pair && (target.onset === pair.a || target.onset === pair.b)) {
    const use = FRONT.includes(first) ? pair.b : pair.a;
    return {
      say: `${pair.say} Sau âm đầu là ${soundSay(first)}, nên viết ${soundSay(use)}.`,
      caption: `${pair.caption} Sau âm đầu là ${first}, nên viết ${use}.`,
    };
  }
  const sameSound = [["s", "x"], ["ch", "tr"], ["d", "gi"], ["d", "r"]];
  if (sameSound.some(([a, b]) => letters.includes(a) && letters.includes(b)) && !rhymeOnly(letters)) {
    return { say: `Gấu đọc từ. Nhớ cách viết: ${target.text} viết bằng ${soundSay(target.onset)}.`, caption: `Gấu đọc từ. Nhớ cách viết: ${target.text} viết bằng ${target.onset}.` };
  }
  return null;
}

const rhymeOnly = (letters: string[]) => letters.every((l) => VOWELS.includes(l) || isRhyme(l));

/** Is the difference between the two spellings a written rule (g / gh, ng / ngh, c / k)? */
function ruleBased(right: string, wrong: string): boolean {
  return sylls(right).some((r, i) => {
    const w = sylls(wrong)[i];
    return !!w && r.onset !== w.onset && RULE_PAIRS.some((p) => [p.a, p.b].includes(r.onset) && [p.a, p.b].includes(w.onset));
  });
}

/** Why `right` is written that way and `wrong` is not, said literally. */
function spellingReason(right: string, wrong: string): { say: string; caption: string } {
  const R = sylls(right);
  const W = sylls(wrong);
  const k = Math.max(0, R.findIndex((s, i) => !W[i] || s.text !== W[i].text));
  const r = R[k];
  const w = W[k] ?? r;
  if (r.onset !== w.onset) {
    const rule = RULE_PAIRS.find((p) => [p.a, p.b].includes(r.onset) && [p.a, p.b].includes(w.onset));
    if (rule)
      return {
        say: `${rule.say} Sau âm đầu là ${soundSay(r.rhyme.charAt(0))}, nên viết ${soundSay(r.onset)}.`,
        caption: `${rule.caption} Sau âm đầu là ${r.rhyme.charAt(0)}, nên viết ${r.onset}.`,
      };
    const said = `Đánh vần: ${spellSyl(r.text)}.`;
    const same = [["s", "x"], ["ch", "tr"], ["d", "gi"], ["d", "r"], ["gi", "r"]].some(([a, b]) => [a, b].includes(r.onset) && [a, b].includes(w.onset));
    if (same) return { say: `Nhớ cách viết: ${r.text} viết bằng ${soundSay(r.onset)}.`, caption: `Nhớ cách viết: ${r.text} viết bằng ${r.onset}.` };
    return { say: said, caption: `Đánh vần: ${r.text}.` };
  }
  if (r.tone !== w.tone && r.rhyme === w.rhyme) return { say: `Đánh vần: ${spellSyl(r.text)}. ${cap(r.text)} có ${TONE_NAME[r.tone]}.`, caption: `${cap(r.text)} có ${TONE_NAME[r.tone]}.` };
  return { say: `Đánh vần: ${spellSyl(r.text)}.`, caption: `Đánh vần: ${r.text}.` };
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
