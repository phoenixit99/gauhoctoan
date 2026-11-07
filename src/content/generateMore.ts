// Toán Tuần 5–11: so sánh (Đ/S, lớn nhất), gộp / tách số, phép cộng, phép trừ, hình phẳng.
// Same rules as generate.ts: every kind with a method fills `walk` with exactly as many method
// steps (methods.ts), using the question's real numbers. Lines with symbols go through `st()` so
// they are shown with "+ − =" but spoken as "cộng, trừ, bằng".
import { ANIMALS, FRUITS, THINGS, type Obj } from "./objects";
import type { Card, ChooseQ, Group, PairQ, Question, SelectQ, Spec, WalkStep } from "./types";
import { pick, shuffle } from "@/lib/vn";
import { LETTERS, SIGN_WORD, abc, compareNums, compareTowers, g, pointSign, rnd, signOf, spoken, st } from "./mathUtil";
import { SHAPES, SHAPE_LOOK, SHAPE_NAME, SHAPE_THINGS, shapeToken, type ShapeId } from "./shapes";

let seq = 0;
const uid = () => `m${++seq}`;

const DOT: Obj = { emoji: "🔵", name: "chấm" };
const DOT2: Obj = { emoji: "🔴", name: "chấm" };

/** Picks objects for a question (theme + "same pictures until mastered" are handled by the caller). */
type Pool = (base: Obj[], need?: number) => Obj[];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function numberChoice(base: Omit<ChooseQ, "options" | "answer" | "style" | "uid" | "type">, n: number, lo: number, hi: number): ChooseQ {
  const nums = abc(n, lo, hi);
  return { ...base, uid: uid(), type: "choose", style: "abc", options: nums.map((v) => ({ text: String(v) })), answer: nums.indexOf(n) };
}

/** "Đếm tiếp từ 5: 6, 7, 8." */
const countOn = (from: number, to: number) =>
  to <= from ? `Không cần đếm thêm.` : `Đếm tiếp từ ${from}: ${Array.from({ length: to - from }, (_, i) => from + i + 1).join(", ")}.`;

const dots = (n: number) => (n === 0 ? "Số 0: không có chấm nào." : `Gấu xếp ${n} chấm.`);

type Calc = { text: string; value: number };

/** A random "a + b" (or "a − b") with the given result. */
function calcFor(value: number, sub: boolean, max: number): Calc {
  // Zero only now and then (a + 0, a − 0 are allowed but should not fill the screen).
  const zero = Math.random() < 0.1;
  if (sub) {
    const a = zero || value >= max ? value : rnd(value + 1, max);
    return { text: `${a} − ${a - value}`, value };
  }
  const a = zero || value < 2 ? pick([0, value]) : rnd(1, value - 1);
  return { text: `${a} + ${value - a}`, value };
}

const calcSay = (c: Calc) => `${spoken(c.text)} bằng ${c.value}`;

export function generateMore(spec: Spec, P: Pool): Question {
  switch (spec.kind) {
    // ---------------- So sánh: Đúng / Sai ----------------
    case "num-tf": {
      const max = spec.max ?? 10;
      const a = rnd(0, max);
      const b = Math.random() < 0.25 ? a : rnd(0, max);
      const real = signOf(a, b);
      const wantTrue = Math.random() < 0.5;
      const shown = wantTrue ? real : pick([">", "<", "="].filter((s) => s !== real));
      const truth = shown === real;
      const text = `${a} ${shown} ${b}`;
      return {
        uid: uid(),
        type: "choose",
        style: "big",
        prompt: `Đúng hay sai? ${text}`,
        say: `Đúng hay sai? ${a} ${SIGN_WORD[shown]} ${b}.`,
        picture: { kind: "expr", parts: [a, shown, b] },
        options: [{ text: "Đ ✓" }, { text: "S ✗" }],
        answer: truth ? 0 : 1,
        count: { mode: "all" },
        hint2: "Gấu xếp khối trên hai số. Tháp nào cao hơn?",
        reveal: `${compareNums(a, b)} Câu này ${truth ? "đúng, ghi Đ" : "sai, ghi S"}.`,
        walk: [
          st(`Bước 1. Đọc: ${text}.`),
          { say: "Bước 2. Gấu xếp khối trên hai số.", show: [2] },
          { say: `Bước 3. ${compareTowers(a, b)}` },
          { ...st(`Bước 4. ${text}: ${truth ? "đúng. Ghi Đ." : "sai. Ghi S."}`), fill: true },
        ],
      };
    }

    // ---------------- Lớn nhất / bé nhất · nhiều nhất / ít nhất ----------------
    case "extreme": {
      const most = spec.mode === "max";
      if (spec.pictures) {
        const o = pick(P(ANIMALS, 1));
        const counts = shuffle(Array.from({ length: 9 }, (_, i) => i + 1)).slice(0, 3);
        const best = most ? Math.max(...counts) : Math.min(...counts);
        const answer = counts.indexOf(best);
        const word = most ? "nhiều" : "ít";
        return {
          uid: uid(),
          type: "choose",
          style: "cards",
          prompt: `Tranh nào có ${word} ${o.name} nhất?`,
          options: counts.map((n) => ({ groups: [g(o, n)] })),
          answer,
          count: { mode: "all" },
          hint2: `Gấu đánh số rồi. Tranh nào có ${word} nhất?`,
          reveal: `Tranh ${LETTERS[answer]} có ${best} ${o.name}. Tranh này có ${word} ${o.name} nhất.`,
          walk: [
            ...counts.map((n, i): WalkStep => ({ say: `${i === 0 ? "Bước 1. " : ""}Tranh ${LETTERS[i]} có ${n} ${o.name}.`, step: 0, focus: i })),
            { say: `Bước 2. ${counts.join(", ")}. Số ${most ? "lớn" : "bé"} nhất là ${best}.`, step: 1 },
            { say: `Bước 3. Tranh ${LETTERS[answer]} có ${word} ${o.name} nhất.`, step: 2, focus: answer, fill: true },
          ],
        };
      }
      const nums = shuffle(Array.from({ length: 11 }, (_, i) => i)).slice(0, 4);
      const best = most ? Math.max(...nums) : Math.min(...nums);
      const word = most ? "lớn" : "bé";
      const answer = nums.indexOf(best);
      return {
        uid: uid(),
        type: "choose",
        style: "big",
        prompt: `Số ${word} nhất là số nào?`,
        picture: { kind: "expr", parts: nums },
        options: nums.map((v) => ({ text: String(v) })),
        answer,
        count: { mode: "all" },
        hint2: `Gấu xếp khối trên từng số. Tháp nào ${most ? "cao" : "thấp"} nhất?`,
        reveal: `Số ${word} nhất là ${best}.`,
        walk: [
          { say: "Bước 1. Gấu xếp khối trên từng số.", show: [nums.length] },
          { say: `Bước 2. Tháp số ${best} ${most ? "cao" : "thấp"} nhất.` },
          { say: `Bước 3. Số ${word} nhất là ${best}.`, focus: answer, fill: true },
        ],
      };
    }

    // ---------------- Gộp / tách số ----------------
    case "bond": {
      const lo = spec.min ?? 3;
      const hi = spec.max ?? 10;
      const [o1, o2] = spec.pictures ? (() => {
        const o = pick(P([...ANIMALS, ...FRUITS], 1));
        return [o, o];
      })() : [DOT, DOT2];
      if (spec.mode === "split") {
        const n = rnd(Math.max(2, lo), hi);
        const a = rnd(1, n - 1);
        const b = n - a;
        const what = spec.pictures ? o1.name : "chấm";
        const q = numberChoice(
          {
            prompt: `${n} gồm ${a} và mấy?`,
            picture: { kind: "bond", whole: n, parts: [a, "☐"], groups: [g(o1, a), g(o2, b)], hidden: !spec.pictures },
            count: { mode: "all" },
            hint2: `Gấu xếp ${n} ${what}: nhóm thứ nhất ${a}. Nhóm còn lại có mấy ${what}?`,
            reveal: `${n} gồm ${a} và ${b}.`,
            walk: [
              { say: `Bước 1. Có ${n} ${what}, chia thành hai nhóm.`, show: [0, 0] },
              { say: `Bước 2. Nhóm thứ nhất có ${a} ${what}.`, count: 0 },
              { say: `Bước 3. Nhóm còn lại có ${b} ${what}.`, count: 1 },
              { say: `Bước 4. ${n} gồm ${a} và ${b}. Số cần điền là ${b}.`, fill: true },
            ],
          },
          b,
          0,
          Math.min(10, n),
        );
        return q;
      }
      const a = rnd(1, hi - 1);
      const b = rnd(1, Math.max(1, hi - a));
      const n = a + b;
      const what = spec.pictures ? o1.name : "chấm";
      return numberChoice(
        {
          prompt: `Gộp ${a} và ${b} được mấy?`,
          picture: { kind: "bond", whole: "☐", parts: [a, b], groups: [g(o1, a), g(o2, b)], hidden: !spec.pictures },
          count: { mode: "all" },
          hint2: `Có ${a} ${what} và ${b} ${what}. ${countOn(a, n)}`,
          reveal: `Gộp ${a} và ${b} được ${n}. ${n} gồm ${a} và ${b}.`,
          walk: [
            { say: `Bước 1. Nhóm thứ nhất có ${a} ${what}.`, count: 0 },
            { say: `Bước 2. Nhóm thứ hai có ${b} ${what}.`, count: 1 },
            { say: `Bước 3. ${countOn(a, n)}` },
            { say: `Bước 4. Gộp ${a} và ${b} được ${n}. ${n} gồm ${a} và ${b}.`, fill: true },
          ],
        },
        n,
        1,
        10,
      );
    }

    // ---------------- Phép cộng ----------------
    case "add": {
      const max = spec.max ?? 10;
      const pics = !!spec.pictures;
      const [o1, o2] = pics ? (() => {
        const [x, y] = shuffle(P([...ANIMALS, ...FRUITS], 2));
        return [x, y ?? x];
      })() : [DOT, DOT2];
      const what1 = pics ? o1.name : "chấm";
      const what2 = pics ? o2.name : "chấm";

      if (spec.terms === 3) {
        const n = rnd(3, max);
        const a = rnd(1, n - 2);
        const b = rnd(1, n - a - 1);
        const c = n - a - b;
        const text = `${a} + ${b} + ${c}`;
        return numberChoice(
          {
            prompt: `${text} = ?`,
            say: `${spoken(text)} bằng mấy?`,
            picture: { kind: "eq", parts: [a, "+", b, "+", c, "=", "☐"], groups: [g(DOT, a), g(DOT2, b), g(DOT, c)], hidden: true },
            count: { mode: "all" },
            hint2: spoken(`Cộng hai số đầu trước: ${a} + ${b} = ${a + b}.`),
            reveal: spoken(`${a} + ${b} = ${a + b}. ${a + b} + ${c} = ${n}.`),
            walk: [
              st(`Bước 1. Cộng hai số đầu: ${a} + ${b} = ${a + b}.`, { show: [0, 0] }),
              st(`Bước 2. Cộng tiếp số thứ ba: ${a + b} + ${c} = ${n}.`, { show: [0, 0, 0] }),
              st(`Bước 3. ${text} = ${n}.`, { fill: true }),
            ],
          },
          n,
          0,
          10,
        );
      }

      if (spec.missing) {
        const n = rnd(2, max);
        const known = rnd(1, n - 1);
        const need = n - known;
        const blankFirst = Math.random() < 0.4;
        const parts = blankFirst ? ["☐", "+", known, "=", n] : [known, "+", "☐", "=", n];
        const text = parts.join(" ");
        return numberChoice(
          {
            prompt: `Số nào điền vào ô trống? ${text}`,
            say: `Số nào điền vào ô trống? ${spoken(text)}.`,
            picture: { kind: "eq", parts, groups: [g(o1, known), g(o2, need)], hidden: !pics },
            count: { mode: "focus", group: 0 },
            hint2: `Có ${known}. Mình đếm tiếp đến ${n}. Đếm thêm được mấy?`,
            reveal: `${countOn(known, n)} Thêm ${need}. Số cần điền là ${need}.`,
            walk: [
              { say: `Bước 1. Số đã biết là ${known}. ${pics ? `Có ${known} ${what1}.` : dots(known)}`, count: 0 },
              { say: `Bước 2. ${countOn(known, n)}`, count: 1 },
              { ...st(`Bước 3. Thêm ${need} ${what2}. Số cần điền là ${need}.`), fill: true },
            ],
          },
          need,
          0,
          10,
        );
      }

      const n = rnd(1, max);
      const a = Math.random() < 0.1 ? n : rnd(0, n);
      const b = n - a;
      const text = `${a} + ${b}`;
      return numberChoice(
        {
          prompt: `${text} = ?`,
          say: `${spoken(text)} bằng mấy?`,
          picture: { kind: "eq", parts: [a, "+", b, "=", "☐"], groups: [g(o1, a), g(o2, b)], hidden: !pics },
          count: { mode: "all" },
          hint2: `Có ${a} ${what1} và ${b} ${what2}. ${countOn(a, n)}`,
          reveal: spoken(`${text} = ${n}.`),
          walk: [
            { say: `Bước 1. Số thứ nhất là ${a}. ${pics ? `Có ${a} ${what1}.` : dots(a)}`, count: 0 },
            { say: `Bước 2. Số thứ hai là ${b}. ${pics ? `Có ${b} ${what2}.` : b === 0 ? "Số 0: không thêm chấm nào." : `Gấu xếp thêm ${b} chấm.`}`, count: 1 },
            { say: `Bước 3. ${countOn(a, n)}` },
            { ...st(`Bước 4. ${text} = ${n}.`), fill: true },
          ],
        },
        n,
        0,
        10,
      );
    }

    // ---------------- Phép trừ ----------------
    case "sub": {
      const max = spec.max ?? 10;
      const pics = !!spec.pictures;
      const o = pics ? pick(P([...ANIMALS, ...FRUITS, ...THINGS.slice(0, 6)], 1)) : DOT;
      const what = pics ? o.name : "chấm";
      const n = rnd(2, max);
      const b = rnd(1, n - 1);
      const r = n - b;
      const group: Group = { ...g(o, n), gone: b };

      if (spec.bond) {
        const text = `${n} − ${b}`;
        return numberChoice(
          {
            prompt: `${n} gồm ${r} và ${b}. ${text} = ?`,
            say: `${n} gồm ${r} và ${b}. ${spoken(text)} bằng mấy?`,
            picture: { kind: "eq", parts: [n, "−", b, "=", "☐"], groups: [group], hidden: true },
            count: { mode: "all" },
            hint2: `${n} gồm ${r} và ${b}. Bớt ${b}, còn lại mấy?`,
            reveal: spoken(`${n} gồm ${r} và ${b}. ${text} = ${r}.`),
            walk: [
              { say: `Bước 1. ${n} gồm ${r} và ${b}.`, show: [0] },
              { say: `Bước 2. Bớt ${b}, còn lại ${r}.`, cross: true },
              { ...st(`Bước 3. ${text} = ${r}.`), fill: true },
            ],
          },
          r,
          0,
          10,
        );
      }

      if (spec.missing) {
        const parts = [n, "−", "☐", "=", r];
        const text = parts.join(" ");
        return numberChoice(
          {
            prompt: `Số nào điền vào ô trống? ${text}`,
            say: `Số nào điền vào ô trống? ${spoken(text)}.`,
            picture: { kind: "eq", parts, groups: [group], hidden: !pics },
            count: { mode: "all" },
            hint2: `Có ${n} ${what}. Còn lại ${r}. Đã bớt đi mấy ${what}?`,
            reveal: spoken(`${n} − ${b} = ${r}. Số cần điền là ${b}.`),
            walk: [
              { say: `Bước 1. Có ${n} ${what}.`, show: [0] },
              { say: `Bước 2. Giữ lại ${r} ${what}. Gạch các ${what} còn lại.`, cross: true },
              { say: `Bước 3. Có ${b} ${what} bị gạch.` },
              { ...st(`Bước 4. ${n} − ${b} = ${r}. Số cần điền là ${b}.`), fill: true },
            ],
          },
          b,
          0,
          10,
        );
      }

      const text = `${n} − ${b}`;
      return numberChoice(
        {
          prompt: `${text} = ?`,
          say: `${spoken(text)} bằng mấy?`,
          picture: { kind: "eq", parts: [n, "−", b, "=", "☐"], groups: [group], hidden: !pics },
          count: { mode: "all" },
          hint2: `Có ${n} ${what}. Gạch bớt ${b}. Còn lại mấy ${what}?`,
          reveal: spoken(`${text} = ${r}.`),
          walk: [
            { say: `Bước 1. Có ${n} ${what}.`, show: [0] },
            { say: `Bước 2. Gạch bớt ${b} ${what}.`, cross: true },
            { say: `Bước 3. Đếm số ${what} còn lại: ${Array.from({ length: r }, (_, i) => i + 1).join(", ")}. Còn lại ${r}.` },
            { ...st(`Bước 4. ${text} = ${r}.`), fill: true },
          ],
        },
        r,
        0,
        10,
      );
    }

    // ---------------- So sánh phép tính với số ----------------
    case "expr-sign": {
      const max = spec.max ?? 10;
      const v = rnd(2, max);
      const left = calcFor(v, !!spec.sub, max);
      const other = Math.random() < 0.3 ? v : Math.max(0, Math.min(10, v + pick([-2, -1, 1, 2])));
      const exprFirst = Math.random() < 0.6;
      const L = exprFirst ? { text: left.text, value: v } : { text: String(other), value: other };
      const R = exprFirst ? { text: String(other), value: other } : { text: left.text, value: v };
      const s = signOf(L.value, R.value);
      const side = (c: Calc, name: string) => (c.text.length > 2 ? st(`${name}: ${c.text} = ${c.value}.`) : { say: `${name} là ${c.value}.` });
      const s1 = side(L, "Bước 1. Bên trái");
      const s2 = side(R, "Bước 2. Bên phải");
      return {
        uid: uid(),
        type: "choose",
        style: "big",
        prompt: "Điền dấu >, <, = vào ô trống",
        say: `Chọn dấu đúng giữa ${spoken(L.text)} và ${spoken(R.text)}.`,
        picture: { kind: "expr", parts: [L.text.length > 2 ? L.text : L.value, "☐", R.text.length > 2 ? R.text : R.value] },
        options: [{ text: ">" }, { text: "<" }, { text: "=" }],
        answer: [">", "<", "="].indexOf(s),
        hint2: `Tính phép tính trước. ${L.text.length > 2 ? calcSay(L) : calcSay(R)}.`,
        reveal: `${L.value} ${SIGN_WORD[s]} ${R.value}. Mình chọn dấu ${SIGN_WORD[s]}.`,
        walk: [s1, s2, { say: `Bước 3. ${compareNums(L.value, R.value)}` }, { say: `Bước 4. ${pointSign(L.value, R.value)}`, fill: true }],
      };
    }

    // ---------------- Nối phép tính ----------------
    case "calc-match": {
      const max = spec.max ?? 10;
      const sub = !!spec.sub;
      const values = shuffle(Array.from({ length: max - 1 }, (_, i) => i + 2)).slice(0, 4);
      const lefts = values.map((v) => calcFor(v, sub, max));
      const rights: Calc[] = values.map((v, i) => {
        if (spec.to === "number") return { text: String(v), value: v };
        let c = calcFor(v, sub, max);
        for (let k = 0; k < 8 && c.text === lefts[i].text; k++) c = calcFor(v, sub, max);
        return c;
      });
      const order = shuffle(values.map((_, i) => i));
      const right: Card[] = order.map((i) => ({ text: rights[i].text, say: spoken(rights[i].text) }));
      const answer = values.map((_, i) => order.indexOf(i));
      const left: Card[] = lefts.map((c) => ({ text: c.text, say: spoken(c.text) }));
      const q: PairQ = {
        uid: uid(),
        type: "pair",
        prompt: spec.to === "number" ? "Nối phép tính với kết quả" : "Nối hai phép tính có cùng kết quả",
        say: spec.to === "number" ? "Con tính, rồi nối phép tính với kết quả đúng nhé." : "Con tính, rồi nối hai phép tính có cùng kết quả nhé.",
        left,
        right,
        answer,
        hint2: `Con tính từng phép tính bên trái. ${calcSay(lefts[0])}.`,
        walk: lefts.flatMap((c, i): WalkStep[] => [
          { ...st(`Bước 1. Tính: ${c.text} = ${c.value}.`), step: 0, focus: i },
          spec.to === "number"
            ? { say: `Bước 2. Tìm số ${c.value}.`, step: 1 }
            : { ...st(`Bước 2. Tìm phép tính bằng ${c.value}: ${rights[i].text}.`), step: 1 },
          { ...st(`Bước 3. Nối ${c.text} với ${rights[i].text}.`), step: 2, pair: [i, answer[i]] },
        ]),
      };
      return q;
    }

    // ---------------- Chọn tất cả phép tính có kết quả … ----------------
    case "calc-select": {
      const sub = !!spec.sub;
      const target = pick(sub ? [3, 4, 5, 6] : [6, 7, 8, 9, 10]);
      const nRight = pick([2, 3]);
      const texts = new Set<string>();
      const calcs: Calc[] = [];
      const add = (v: number, s: boolean) => {
        for (let k = 0; k < 20; k++) {
          const c = calcFor(v, s, 10);
          if (!texts.has(c.text)) {
            texts.add(c.text);
            calcs.push(c);
            return;
          }
        }
      };
      for (let k = 0; k < 50 && calcs.length < nRight; k++) add(target, sub ? true : Math.random() < 0.5);
      for (let k = 0; k < 200 && calcs.length < 6; k++) {
        const v = rnd(1, 10);
        if (v !== target) add(v, sub ? Math.random() < 0.6 : Math.random() < 0.5);
      }
      const cards: Card[] = shuffle(calcs).map((c) => ({ text: c.text, say: spoken(c.text) }));
      const value = (c: Card) => calcs.find((x) => x.text === c.text)!.value;
      const correct = cards.map((c, i) => (value(c) === target ? i : -1)).filter((i) => i >= 0);
      const q: SelectQ = {
        uid: uid(),
        type: "select",
        prompt: `Chọn tất cả phép tính có kết quả bằng ${target}`,
        say: `Con chọn tất cả phép tính có kết quả bằng ${target}, rồi bấm Xong.`,
        cards,
        correct,
        hint2: `Con tính từng phép tính. Phép tính nào bằng ${target} thì chọn.`,
        walk: [
          { say: `Bước 1. Kết quả cần tìm là ${target}.`, step: 0 },
          ...cards.map((c, i): WalkStep => {
            const v = value(c);
            return { ...st(`${c.text} = ${v}: ${v === target ? "chọn" : "không chọn"}.`), step: 1, focus: i, pick: v === target ? i : undefined };
          }),
          { say: `Bước 3. Có ${correct.length} phép tính bằng ${target}. Bấm Xong.`, step: 2 },
        ],
      };
      return q;
    }

    // ---------------- Hình phẳng ----------------
    case "shape-pick": {
      const ask = pick(SHAPES);
      const opts = shuffle([ask, ...shuffle(SHAPES.filter((s) => s !== ask)).slice(0, 2)]);
      const answer = opts.indexOf(ask);
      return {
        uid: uid(),
        type: "choose",
        style: "cards",
        prompt: `Chọn ${SHAPE_NAME[ask]}`,
        say: `Hình nào là ${SHAPE_NAME[ask]}?`,
        options: opts.map((s) => ({ groups: [shapeGroup(s, 1)], label: SHAPE_NAME[s] })),
        answer,
        hint2: `${cap(SHAPE_NAME[ask])} ${SHAPE_LOOK[ask]}.`,
        reveal: `Hình ${LETTERS[answer]} là ${SHAPE_NAME[ask]}.`,
        walk: [
          { say: `Bước 1. ${cap(SHAPE_NAME[ask])} ${SHAPE_LOOK[ask]}.`, step: 0 },
          ...opts.map((s, i): WalkStep => ({ say: `Hình ${LETTERS[i]} ${SHAPE_LOOK[s]}: ${SHAPE_NAME[s]}.`, step: 1, focus: i, labels: true })),
          { say: `Bước 3. Hình ${LETTERS[answer]} là ${SHAPE_NAME[ask]}.`, step: 2, focus: answer, fill: true },
        ],
      };
    }

    case "shape-object": {
      const thing = pick(SHAPE_THINGS);
      const opts = shuffle([thing.shape, ...shuffle(SHAPES.filter((s) => s !== thing.shape)).slice(0, 2)]);
      const answer = opts.indexOf(thing.shape);
      return {
        uid: uid(),
        type: "choose",
        style: "cards",
        prompt: `${cap(thing.name)} có dạng hình gì?`,
        picture: { kind: "card", emoji: thing.emoji },
        options: opts.map((s) => ({ groups: [shapeGroup(s, 1)], label: SHAPE_NAME[s] })),
        answer,
        hint2: `Gấu nói tên từng hình: ${opts.map((s) => SHAPE_NAME[s]).join(", ")}.`,
        reveal: `${cap(thing.name)} có dạng ${SHAPE_NAME[thing.shape]}.`,
        walk: [
          { say: `Bước 1. Đây là ${thing.name}.` },
          { say: `Bước 2. ${cap(thing.name)} ${SHAPE_LOOK[thing.shape]}.`, labels: true },
          { say: `Bước 3. ${cap(thing.name)} có dạng ${SHAPE_NAME[thing.shape]}. Đáp án ${LETTERS[answer]}.`, focus: answer, fill: true },
        ],
      };
    }

    case "shape-match": {
      const things = SHAPES.map((s) => pick(SHAPE_THINGS.filter((t) => t.shape === s)));
      const order = shuffle(SHAPES.map((_, i) => i));
      const left: Card[] = shuffle(things).map((t) => ({ emoji: t.emoji, say: t.name }));
      const leftThings = left.map((c) => things.find((t) => t.name === c.say)!);
      const right: Card[] = order.map((i) => ({ emoji: shapeToken(SHAPES[i]), text: SHAPE_NAME[SHAPES[i]], say: SHAPE_NAME[SHAPES[i]] }));
      const answer = leftThings.map((t) => order.indexOf(SHAPES.indexOf(t.shape)));
      const q: PairQ = {
        uid: uid(),
        type: "pair",
        prompt: "Nối mỗi vật với hình phù hợp",
        say: "Con nối mỗi vật với hình có cùng dạng nhé.",
        left,
        right,
        answer,
        walk: leftThings.flatMap((t, i): WalkStep[] => [
          { say: `Bước 1. Đây là ${t.name}.`, step: 0, focus: i },
          { say: `Bước 2. ${cap(t.name)} ${SHAPE_LOOK[t.shape]}.`, step: 1 },
          { say: `Bước 3. Nối ${t.name} với ${SHAPE_NAME[t.shape]}.`, step: 2, pair: [i, answer[i]] },
        ]),
      };
      return q;
    }

    case "shape-all": {
      const ask = pick(SHAPES);
      const nRight = pick([2, 3]);
      const others = SHAPES.filter((s) => s !== ask);
      const items = shuffle([...Array<ShapeId>(nRight).fill(ask), ...Array.from({ length: 7 - nRight }, () => pick(others))]);
      const cards: Card[] = items.map((s) => ({ emoji: shapeToken(s), say: SHAPE_NAME[s] }));
      const correct = items.map((s, i) => (s === ask ? i : -1)).filter((i) => i >= 0);
      const q: SelectQ = {
        uid: uid(),
        type: "select",
        prompt: `Chọn tất cả ${SHAPE_NAME[ask]}`,
        say: `Con chọn tất cả ${SHAPE_NAME[ask]}, rồi bấm Xong.`,
        cards,
        correct,
        quiet: true,
        hint2: `${cap(SHAPE_NAME[ask])} ${SHAPE_LOOK[ask]}. Con tìm các hình như vậy.`,
        walk: [
          { say: `Bước 1. ${cap(SHAPE_NAME[ask])} ${SHAPE_LOOK[ask]}.`, step: 0 },
          ...items.map((s, i): WalkStep => ({ say: `Hình này là ${SHAPE_NAME[s]}: ${s === ask ? "chọn" : "không chọn"}.`, step: 1, focus: i, pick: s === ask ? i : undefined })),
          { say: `Bước 3. Có ${correct.length} ${SHAPE_NAME[ask]}. Bấm Xong.`, step: 2 },
        ],
      };
      return q;
    }

    case "shape-count": {
      const kinds = shuffle(SHAPES).slice(0, 3);
      const counts = shuffle([rnd(1, 2), rnd(3, 4), rnd(5, 6)]);
      const groups = kinds.map((s, i) => shapeGroup(s, counts[i]));
      const order = shuffle(groups.flatMap((gr, i) => Array<number>(gr.n).fill(i)));
      const t = rnd(0, 2);
      const ask = kinds[t];
      const n = counts[t];
      const q = numberChoice(
        {
          prompt: `Trong hình có mấy ${SHAPE_NAME[ask]}?`,
          picture: { kind: "scene", groups, order },
          count: { mode: "focus", group: t },
          hint2: `${cap(SHAPE_NAME[ask])} ${SHAPE_LOOK[ask]}. Con chỉ đếm ${SHAPE_NAME[ask]} thôi nhé.`,
          reveal: "",
          walk: [
            { say: `Bước 1. ${cap(SHAPE_NAME[ask])} ${SHAPE_LOOK[ask]}.` },
            { say: `Bước 2. Có ${n} ${SHAPE_NAME[ask]}.`, count: t },
            { say: "", fill: true },
          ],
        },
        n,
        1,
        7,
      );
      q.reveal = `Có ${n} ${SHAPE_NAME[ask]}. Đáp án ${LETTERS[q.answer]}.`;
      q.walk![2].say = `Bước 3. Có ${n} ${SHAPE_NAME[ask]}. Đáp án ${LETTERS[q.answer]}.`;
      return q;
    }

    case "shape-pattern": {
      const kinds = shuffle(SHAPES);
      const units: ShapeId[][] = [
        [kinds[0], kinds[1]],
        [kinds[0], kinds[1], kinds[2]],
        [kinds[0], kinds[0], kinds[1]],
        [kinds[0], kinds[1], kinds[1]],
      ];
      const unitShapes = pick(units);
      const len = unitShapes.length * 3 + (unitShapes.length === 2 ? 2 : 0);
      const seqShapes = Array.from({ length: len }, (_, i) => unitShapes[i % unitShapes.length]);
      const ask = rnd(unitShapes.length * 2, len - 1);
      const right = seqShapes[ask];
      const opts = shuffle([right, ...shuffle(SHAPES.filter((s) => s !== right)).slice(0, 2)]);
      const answer = opts.indexOf(right);
      const short = (s: ShapeId) => SHAPE_NAME[s].replace("hình ", "");
      return {
        uid: uid(),
        type: "choose",
        style: "cards",
        prompt: "Hình nào đặt vào dấu ?",
        say: "Hình nào đặt vào dấu hỏi?",
        picture: { kind: "pattern", items: seqShapes.map((s) => shapeToken(s)), ask, answer: shapeToken(right) },
        options: opts.map((s) => ({ groups: [shapeGroup(s, 1)], label: SHAPE_NAME[s] })),
        answer,
        hint2: `Các hình lặp lại theo nhóm: ${unitShapes.map(short).join(", ")}.`,
        reveal: `Dấu hỏi là hình thứ ${(ask % unitShapes.length) + 1} trong nhóm: ${SHAPE_NAME[right]}.`,
        walk: [
          { say: `Bước 1. Đọc từng hình: ${seqShapes.slice(0, ask).map(short).join(", ")}.`, show: [ask] },
          { say: `Bước 2. Nhóm hình lặp lại là: ${unitShapes.map(short).join(", ")}.` },
          {
            say: `Bước 3. Dấu hỏi là hình thứ ${(ask % unitShapes.length) + 1} trong nhóm: ${SHAPE_NAME[right]}. Đáp án ${LETTERS[answer]}.`,
            focus: answer,
            fill: true,
            labels: true,
          },
        ],
      };
    }

    default:
      throw new Error(`Không có bộ sinh câu hỏi cho dạng ${spec.kind}`);
  }
}

const shapeGroup = (s: ShapeId, n: number): Group => ({ emoji: shapeToken(s), name: SHAPE_NAME[s], n });
