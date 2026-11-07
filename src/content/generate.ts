// Turns a Spec (recipe) into a concrete Question with random numbers.
import { ANIMALS, COLOR_PAIRS, FRUITS, THINGS, objectPool, type Obj } from "./objects";
import { isMastered, useProgress } from "@/lib/store";
import { settings } from "@/lib/settings";
import type { ChooseQ, Question, Spec } from "./types";
import { pick, shuffle } from "@/lib/vn";
import { generateTV } from "./tv/generate";
import { LETTERS, SIGN_WORD, abc, blocks, compareNums, compareTowers, g, pointSign, rnd, signOf } from "./mathUtil";
import { generateMore } from "./generateMore";
import { methodKey } from "./methods";

let seq = 0;
const uid = () => `q${++seq}`;

export { SIGN_WORD };

/** Two different objects. */
function twoObjs(pool: Obj[]): [Obj, Obj] {
  const [a, b] = shuffle(pool);
  return [a, b];
}

function numberChoice(base: Omit<ChooseQ, "options" | "answer" | "style" | "uid" | "type">, n: number, lo: number, hi: number): ChooseQ {
  const nums = abc(n, lo, hi);
  return { ...base, uid: uid(), type: "choose", style: "abc", options: nums.map((v) => ({ text: String(v) })), answer: nums.indexOf(n) };
}

/**
 * A similar but easier recipe (smaller numbers), used for the extra question after the bear
 * solved one. Kinds without a size setting stay the same; the extra question still gets full help.
 */
export function easier(spec: Spec): Spec {
  switch (spec.kind) {
    case "count":
    case "basket":
    case "color-n": {
      const lo = spec.min ?? 1;
      const hi = spec.max ?? (spec.kind === "color-n" ? 5 : 10);
      return { ...spec, max: Math.max(lo, Math.ceil(hi * 0.6)) };
    }
    case "sign":
    case "num-tf":
    case "expr-sign":
    case "add":
    case "sub":
    case "calc-match":
      return { ...spec, max: Math.min(spec.max ?? 10, 5) };
    case "bond":
      return { ...spec, min: Math.min(spec.min ?? 3, 3), max: Math.min(spec.max ?? 10, 5) };
    case "scene-count":
      return { ...spec, max: Math.min(spec.max ?? 9, 5) };
    default:
      return spec;
  }
}

export function generate(spec: Spec): Question {
  if (spec.kind.startsWith("tv-")) return generateTV(spec as Parameters<typeof generateTV>[0]);
  return generateMath(spec);
}

function generateMath(spec: Spec): Question {
  // Same pictures until the child has mastered this kind; the chosen theme replaces the pools.
  const fixed = !isMastered(useProgress.getState().attempts, methodKey(spec));
  const theme = settings().theme;
  const P = (base: Obj[], need = 1) => objectPool(base, need, fixed, theme);
  switch (spec.kind) {
    case "count": {
      const lo = spec.min ?? 1;
      const hi = spec.max ?? 10;
      const n = rnd(lo, hi);
      if (spec.dice) {
        const q = numberChoice(
          {
            prompt: "Có mấy chấm tròn?",
            picture: { kind: "dice", n },
            count: { mode: "all" },
            hint2: `Gấu đánh số từng chấm rồi. Có mấy chấm?`,
            reveal: "",
          },
          n,
          Math.max(0, lo - 1),
          hi,
        );
        q.reveal = `Có ${n} chấm tròn. Đáp án là số ${n}.`;
        return q;
      }
      const o = pick(P([...ANIMALS, ...FRUITS]));
      const q = numberChoice(
        {
          prompt: `Có bao nhiêu ${o.name} trong hình?`,
          picture: { kind: "rows", groups: [g(o, n)] },
          count: { mode: "focus", group: 0 },
          hint2: n === 0 ? "Trong ô có con nào không? Không có thì là số 0." : "Con chọn số nào?",
          reveal: "",
        },
        n,
        Math.max(0, lo - 1),
        hi,
      );
      q.reveal = n === 0 ? `Không có ${o.name} nào. Đáp án ${LETTERS[q.answer]}: số 0.` : `Có ${n} ${o.name}. Đáp án ${LETTERS[q.answer]}: số ${n}.`;
      return q;
    }

    case "basket": {
      const n = rnd(spec.min ?? 1, spec.max ?? 10);
      return { uid: uid(), type: "basket", n, prompt: `Bỏ ${n} quả táo vào giỏ 🧺`, say: `Con hãy bỏ ${n} quả táo vào giỏ nhé!` };
    }

    case "make10": {
      const have = rnd(spec.min ?? 4, spec.max ?? 8);
      const need = 10 - have;
      const o = pick(P(FRUITS));
      const nums = abc(need, 1, 9);
      const counting = Array.from({ length: need }, (_, i) => have + i + 1).join(", ");
      return {
        uid: uid(),
        type: "choose",
        style: "cards",
        prompt: `Để có 10 ${o.name} cần thêm mấy ${o.name}?`,
        picture: { kind: "rows", groups: [g(o, have)] },
        options: nums.map((v) => ({ groups: [g(o, v)] })),
        answer: nums.indexOf(need),
        count: { mode: "focus", group: 0 },
        hint2: `Đã có ${have}. Mình đếm tiếp đến 10: ${counting}. Đếm thêm được mấy ${o.name}?`,
        reveal: `Có ${have}, đếm tiếp ${counting}. Cần thêm ${need} ${o.name}.`,
      };
    }

    case "sequence": {
      const top = spec.to ?? 10;
      const values = Array.from({ length: top + 1 }, (_, i) => (spec.dir === "up" ? i : top - i));
      const k = Math.min(spec.blanks ?? 4, top - 1);
      // Never blank the first value (the child needs a starting point).
      const blanks = shuffle(Array.from({ length: top }, (_, i) => i + 1))
        .slice(0, k)
        .sort((a, b) => a - b);
      const choices = blanks.map((i) => shuffle(abc(values[i], 0, top)));
      return {
        uid: uid(),
        type: "sequence",
        style: spec.style,
        values,
        blanks,
        choices,
        prompt: spec.dir === "up" ? `Số? Điền số còn thiếu (đếm xuôi từ 0 đến ${top})` : `Số? Điền số còn thiếu (đếm ngược từ ${top} về 0)`,
        say: spec.dir === "up" ? `Con điền số còn thiếu nhé. Mình đếm từ 0 đến ${top}.` : `Con điền số còn thiếu nhé. Mình đếm ngược từ ${top} về 0.`,
      };
    }

    case "scene-count": {
      const objs = shuffle(P([...ANIMALS.slice(0, 6), ...THINGS.slice(0, 3)], 3)).slice(0, 3);
      const max = spec.max ?? 9;
      const counts = max <= 5 ? [rnd(1, max), rnd(1, max), rnd(1, max)] : shuffle([rnd(1, 3), rnd(4, 6), rnd(7, max)]);
      const groups = objs.map((o, i) => g(o, counts[i]));
      const order = shuffle(groups.flatMap((gr, i) => Array<number>(gr.n).fill(i)));
      const t = rnd(0, 2);
      const q = numberChoice(
        {
          prompt: `Trong tranh có mấy ${groups[t].name}? ${groups[t].emoji}`,
          say: `Trong tranh có mấy ${groups[t].name}?`,
          picture: { kind: "scene", groups, order },
          count: { mode: "focus", group: t },
          hint2: `Con chỉ đếm ${groups[t].name} thôi nhé. Chọn số nào?`,
          reveal: "",
        },
        groups[t].n,
        1,
        Math.max(5, max),
      );
      q.reveal = `Có ${groups[t].n} ${groups[t].name}. Đáp án ${LETTERS[q.answer]}.`;
      return q;
    }

    case "match": {
      const pairs = spec.pairs ?? 4;
      const nums = shuffle(Array.from({ length: (spec.max ?? 10) - (spec.min ?? 6) + 1 }, (_, i) => (spec.min ?? 6) + i)).slice(0, pairs);
      const objs = shuffle(P(FRUITS, pairs)).slice(0, pairs);
      return {
        uid: uid(),
        type: "match",
        groups: nums.map((n, i) => g(objs[i], n)),
        numbers: shuffle(nums),
        prompt: "Nối đúng: chạm vào nhóm, rồi chạm vào số",
        say: "Con nối mỗi nhóm với số đúng nhé. Chạm vào một nhóm, rồi chạm vào số.",
      };
    }

    case "color-n": {
      const n = rnd(spec.min ?? 1, spec.max ?? 5);
      const o = pick([FRUITS[1], FRUITS[0], THINGS[0], THINGS[2], THINGS[3]]);
      return {
        uid: uid(),
        type: "color",
        n,
        total: 5,
        emoji: o.emoji,
        name: o.name,
        prompt: `Tô màu ${n} ${o.name}`,
        say: `Con chạm để tô màu ${n} ${o.name} nhé.`,
      };
    }

    case "color-legend": {
      const COLORS = [
        { color: "#fdd835", label: "vàng", emoji: "🟡" },
        { color: "#1e88e5", label: "xanh biển", emoji: "🔵" },
        { color: "#e53935", label: "đỏ", emoji: "🔴" },
        { color: "#43a047", label: "xanh lá", emoji: "🟢" },
        { color: "#8e24aa", label: "tím", emoji: "🟣" },
      ];
      const max = spec.max ?? 5;
      const colors = shuffle(COLORS).slice(0, max);
      const items = colors.map((c, i) => ({ num: i + 1, color: c.color, label: c.label }));
      const ask = rnd(1, max);
      const opts = shuffle(colors.map((c, i) => ({ ...c, i }))).slice(0, 3);
      if (!opts.some((o) => o.i === ask - 1)) opts[0] = { ...colors[ask - 1], i: ask - 1 };
      const options = shuffle(opts);
      return {
        uid: uid(),
        type: "choose",
        style: "big",
        prompt: `Số ${ask} tô màu gì?`,
        say: `Nhìn bảng màu nhé. Số ${ask} tô màu gì?`,
        picture: { kind: "legend", items, ask },
        options: options.map((o) => ({ text: `${o.emoji} ${o.label}` })),
        answer: options.findIndex((o) => o.i === ask - 1),
        hint2: `Con tìm số ${ask} trong bảng màu nhé.`,
        reveal: `Số ${ask} tô màu ${colors[ask - 1].label}.`,
      };
    }

    case "pick-more": {
      const [a, b] = twoObjs(P(ANIMALS, 2));
      let x = rnd(1, 8);
      let y = rnd(1, 8);
      while (x === y) y = rnd(1, 8);
      if (Math.random() < 0.5) [x, y] = [y, x];
      const ans = x > y ? 0 : 1;
      return {
        uid: uid(),
        type: "choose",
        style: "cards",
        prompt: "Chạm vào bức tranh có nhiều hình hơn",
        options: [{ groups: [g(a, x)] }, { groups: [g(b, y)] }],
        answer: ans,
        count: { mode: "all" },
        hint2: "Gấu đã đánh số rồi. Bức tranh nào có nhiều hơn?",
        reveal: `Tranh này có ${Math.max(x, y)} ${(ans === 0 ? a : b).name}. ${Math.max(x, y)} lớn hơn ${Math.min(x, y)}, nên tranh này nhiều hơn.`,
      };
    }

    case "add-equal": {
      const [a, b] = twoObjs(P(ANIMALS, 2));
      const want = rnd(3, 8);
      const have = rnd(1, want - 1);
      const need = want - have;
      const q = numberChoice(
        {
          prompt: `Thêm bao nhiêu ${a.name} để số ${a.name} bằng số ${b.name}?`,
          picture: { kind: "rows", groups: [g(a, have), g(b, want)] },
          count: { mode: "all" },
          hint2: `Mỗi ${a.name} đứng trên một ${b.name}. Còn mấy ${b.name} chưa có bạn?`,
          reveal: "",
        },
        need,
        1,
        9,
      );
      q.reveal = `Có ${have} ${a.name} và ${want} ${b.name}. Cần thêm ${need} ${a.name}.`;
      return q;
    }

    case "true-false": {
      const [a, b] = twoObjs(P(ANIMALS, 2));
      const x = rnd(2, 7);
      const y = rnd(2, 7);
      const statements: { text: string; truth: boolean }[] = [];
      const fake = y + (Math.random() < 0.5 ? 1 : -1);
      statements.push({ text: `Có ${y} ${b.name}.`, truth: true }, { text: `Có ${fake} ${b.name}.`, truth: false });
      statements.push({ text: `Số ${a.name} nhiều hơn số ${b.name}.`, truth: x > y });
      statements.push({ text: `Số ${b.name} ít hơn số ${a.name}.`, truth: y < x });
      statements.push({ text: `Số ${a.name} bằng số ${b.name}.`, truth: x === y });
      // Balance true/false answers.
      const wantTrue = Math.random() < 0.5;
      const st = pick(statements.filter((s) => s.truth === wantTrue).length ? statements.filter((s) => s.truth === wantTrue) : statements);
      return {
        uid: uid(),
        type: "choose",
        style: "big",
        prompt: `Đúng hay sai? “${st.text}”`,
        say: `Đúng hay sai? ${st.text}`,
        picture: { kind: "rows", groups: [g(a, x), g(b, y)] },
        options: [{ text: "Đ ✓" }, { text: "S ✗" }],
        answer: st.truth ? 0 : 1,
        count: { mode: "all" },
        hint2: `Có ${x} ${a.name} và ${y} ${b.name}. Câu này đúng hay sai?`,
        reveal: `Có ${x} ${a.name} và ${y} ${b.name}. Câu này ${st.truth ? "đúng, ghi Đ" : "sai, ghi S"}.`,
      };
    }

    case "adjust-more": {
      const [a, b] = theme === "mix" ? [pick(P(THINGS.slice(0, 5))), pick(P(ANIMALS))] : twoObjs(P(ANIMALS, 2));
      const fixed = rnd(3, 6);
      const have = rnd(1, fixed - 1);
      return {
        uid: uid(),
        type: "adjust",
        rows: [g(a, have), g(b, fixed)],
        editable: [true, false],
        goal: { kind: "more", row: 0 },
        prompt: `Thêm ${a.name} để số ${a.name} nhiều hơn số ${b.name}`,
        say: `Con bấm dấu cộng để thêm ${a.name}, cho số ${a.name} nhiều hơn số ${b.name} nhé.`,
      };
    }

    case "adjust-equal": {
      const [a, b] = twoObjs(P([...FRUITS, ...THINGS.slice(0, 5)], 2));
      const target = rnd(2, 6);
      let have = rnd(1, 7);
      while (have === target) have = rnd(1, 7);
      return {
        uid: uid(),
        type: "adjust",
        rows: [g(a, have), g(b, target)],
        editable: [true, false],
        goal: { kind: "equal" },
        prompt: `Thêm hoặc gạch bớt để số ${a.name} bằng số ${b.name}`,
        say: `Con thêm hoặc gạch bớt ${a.name}, để số ${a.name} bằng số ${b.name} nhé. Chạm vào hình để gạch bớt.`,
      };
    }

    case "sign": {
      const max = spec.max ?? 10;
      const a = rnd(0, max);
      const b = Math.random() < 0.2 ? a : rnd(0, max);
      const s = signOf(a, b);
      return {
        uid: uid(),
        type: "choose",
        style: "big",
        prompt: `Điền dấu >, <, = vào ô trống`,
        say: `Chọn dấu đúng giữa ${a} và ${b}.`,
        picture: { kind: "expr", parts: [a, "☐", b] },
        options: [{ text: ">" }, { text: "<" }, { text: "=" }],
        answer: [">", "<", "="].indexOf(s),
        count: { mode: "all" },
        hint2: "Gấu xếp khối trên mỗi số. Tháp nào cao hơn? Đầu nhọn chỉ vào số bé hơn.",
        reveal: `${a} ${SIGN_WORD[s]} ${b}. Mình chọn dấu ${SIGN_WORD[s]}.`,
        walk: [
          { say: `Bước 1. Số bên trái là ${a}. ${blocks(a)}`, show: [1] },
          { say: `Bước 2. Số bên phải là ${b}. ${blocks(b)}`, show: [2] },
          { say: `Bước 3. ${compareTowers(a, b)}` },
          { say: `Bước 4. ${pointSign(a, b)}`, fill: true },
        ],
      };
    }

    case "picture-sign": {
      const [a, b] = twoObjs(P([...ANIMALS, ...FRUITS, ...THINGS.slice(0, 6)], 2));
      const x = rnd(1, 9);
      const y = Math.random() < 0.2 ? x : rnd(1, 9);
      const s = signOf(x, y);
      return {
        uid: uid(),
        type: "choose",
        style: "big",
        prompt: `Đếm rồi chọn dấu: ${a.emoji} ☐ ${b.emoji}`,
        say: `Con đếm ${a.name} và ${b.name}, rồi chọn dấu đúng nhé.`,
        picture: { kind: "side", groups: [g(a, x), g(b, y)] },
        options: [{ text: ">" }, { text: "<" }, { text: "=" }],
        answer: [">", "<", "="].indexOf(s),
        count: { mode: "all" },
        hint2: `Có ${x} ${a.name} và ${y} ${b.name}. Chọn dấu nào?`,
        reveal: `${x} ${SIGN_WORD[s]} ${y}. Viết là ${x} ${s} ${y}.`,
        walk: [
          { say: `Bước 1. Có ${x} ${a.name}.`, count: 0 },
          { say: `Bước 2. Có ${y} ${b.name}.`, count: 1 },
          { say: `Bước 3. ${compareNums(x, y)}` },
          { say: `Bước 4. ${pointSign(x, y)}`, fill: true },
        ],
      };
    }

    case "pick-number": {
      const s = pick([">", "<", "="]);
      let a = rnd(1, 9);
      let right: number;
      let wrong: number;
      if (s === "=") {
        right = a;
        wrong = Math.min(10, Math.max(0, a + pick([-2, -1, 1, 2])));
      } else if (s === ">") {
        right = rnd(0, a - 1);
        wrong = rnd(a + 1, 10);
      } else {
        a = rnd(0, 8);
        right = rnd(a + 1, 10);
        wrong = rnd(0, a);
        if (wrong === a) wrong = Math.max(0, a - 1);
        if (wrong === right) wrong = 0;
      }
      const blankLeft = s !== "=" && Math.random() < 0.4;
      // If the blank is on the left, flip the sign meaning: ☐ > a needs a bigger number.
      const sign = blankLeft ? (s === ">" ? "<" : s === "<" ? ">" : "=") : s;
      const parts = blankLeft ? ["☐", sign, a] : [a, sign, "☐"];
      const opts = shuffle([right, wrong]);
      const exprSay = blankLeft ? `ô trống ${SIGN_WORD[sign]} ${a}` : `${a} ${SIGN_WORD[sign]} ô trống`;
      return {
        uid: uid(),
        type: "choose",
        style: "big",
        prompt: "Số nào điền vào ô trống?",
        say: `Số nào điền vào ô trống? ${exprSay}.`,
        picture: { kind: "expr", parts },
        options: opts.map((v) => ({ text: String(v) })),
        answer: opts.indexOf(right),
        hint2: `Thử từng số nhé: ${opts.map((v) => (blankLeft ? `${v} ${SIGN_WORD[sign]} ${a}` : `${a} ${SIGN_WORD[sign]} ${v}`)).join(", hay ")}?`,
        reveal: blankLeft ? `${right} ${SIGN_WORD[sign]} ${a}. Đáp án là ${right}.` : `${a} ${SIGN_WORD[sign]} ${right}. Đáp án là ${right}.`,
        walk: [
          { say: `Bước 1. Phép so sánh: ${exprSay}. ${blocks(a)}`, show: [1] },
          {
            say: `Bước 2. ${opts
              .map((v) => `Thử số ${v}: ${blankLeft ? `${v} ${SIGN_WORD[sign]} ${a}` : `${a} ${SIGN_WORD[sign]} ${v}`}? ${v === right ? "Đúng." : "Không đúng."}`)
              .join(" ")}`,
          },
          { say: `Bước 3. Số ${right} làm phép so sánh đúng. Đáp án là ${right}.`, fill: true },
        ],
      };
    }

    case "adjust-counts": {
      const [a, b] = twoObjs(P([...FRUITS, ...THINGS.slice(0, 6)], 2));
      const x = rnd(1, 6);
      let y = rnd(1, 6);
      while (x === y) y = rnd(1, 6);
      if (Math.random() < 0.2) y = x;
      const s = signOf(x, y);
      // Pre-fill some of each box; the child draws the rest (theo mẫu).
      const hx = rnd(Math.max(0, x - 3), x);
      let hy = rnd(Math.max(0, y - 3), y);
      if (hx === x && hy === y) hy = Math.max(0, y - 1);
      return {
        uid: uid(),
        type: "adjust",
        rows: [g(a, hx), g(b, hy)],
        editable: [true, true],
        goal: { kind: "counts", counts: [x, y], sign: s },
        prompt: `Vẽ thêm hình cho đúng: ${x} ${s} ${y}`,
        say: `Con thêm hình cho đúng: ${x} ${SIGN_WORD[s]} ${y}.`,
        walk: [
          { say: `Bước 1. ${x} ${SIGN_WORD[s]} ${y}. Hàng trên cần ${x} ${a.name}. Hàng dưới cần ${y} ${b.name}.` },
          { say: `Bước 2. Hàng trên: thêm từng hình, đếm đến ${x} thì dừng.`, row: 0 },
          { say: `Bước 3. Hàng dưới: thêm từng hình, đếm đến ${y} thì dừng.`, row: 1 },
          { say: `Bước 4. Hàng trên có ${x}, hàng dưới có ${y}. ${x} ${SIGN_WORD[s]} ${y}. Đúng rồi.` },
        ],
      };
    }

    case "attr-compare": {
      const [a, b] = pick(COLOR_PAIRS);
      const x = rnd(1, 7);
      let y = rnd(1, 7);
      if (Math.random() < 0.25) y = x;
      const groups = [g(a, x), g(b, y)];
      const order = shuffle(groups.flatMap((gr, i) => Array<number>(gr.n).fill(i)));
      const ans = x > y ? 0 : x < y ? 1 : 2;
      return {
        uid: uid(),
        type: "choose",
        style: "big",
        prompt: `${a.emoji} hay ${b.emoji}: loại nào nhiều hơn?`,
        say: `Có mấy ${a.name} và mấy ${b.name}? Loại nào nhiều hơn?`,
        picture: { kind: "scene", groups, order },
        options: [{ text: `${a.emoji} nhiều hơn` }, { text: `${b.emoji} nhiều hơn` }, { text: "= bằng nhau" }],
        answer: ans,
        count: { mode: "all" },
        hint2: `Có ${x} ${a.name} và ${y} ${b.name}.`,
        reveal: ans === 2 ? `${x} bằng ${y}. Hai loại bằng nhau.` : `${Math.max(x, y)} lớn hơn ${Math.min(x, y)}. ${ans === 0 ? a.name : b.name} nhiều hơn.`,
        walk: [
          { say: `Bước 1. Có ${x} ${a.name}.`, count: 0 },
          { say: `Bước 2. Có ${y} ${b.name}.`, count: 1 },
          { say: `Bước 3. ${compareNums(x, y)}` },
          {
            say: `Bước 4. ${ans === 2 ? "Hai số bằng nhau. Mình chọn bằng nhau." : `${Math.max(x, y)} lớn hơn, nên ${ans === 0 ? a.name : b.name} nhiều hơn.`}`,
            fill: true,
          },
        ],
      };
    }
    default:
      return generateMore(spec, P);
  }
}
