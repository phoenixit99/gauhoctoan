// Hình phẳng (Toán Tuần 7–9): hình tròn, hình vuông, hình tam giác, hình chữ nhật.
// A shape is written as a token "shape:<id>:<color>" wherever an emoji is expected (Group.emoji,
// Card.emoji…), and the renderers draw it as SVG (components/ex/Emo.tsx). There is no rectangle
// emoji, and square vs rectangle must look clearly different, so emoji are not used for shapes.

export type ShapeId = "tron" | "vuong" | "tamgiac" | "chunhat";

export const SHAPES: ShapeId[] = ["tron", "vuong", "tamgiac", "chunhat"];

export const SHAPE_NAME: Record<ShapeId, string> = {
  tron: "hình tròn",
  vuong: "hình vuông",
  tamgiac: "hình tam giác",
  chunhat: "hình chữ nhật",
};

/** What each shape looks like, said literally (counted sides and corners, no metaphors). */
export const SHAPE_LOOK: Record<ShapeId, string> = {
  tron: "không có cạnh thẳng, không có góc",
  vuong: "có 4 cạnh dài bằng nhau",
  tamgiac: "có 3 cạnh, 3 góc",
  chunhat: "có 4 cạnh, 2 cạnh dài và 2 cạnh ngắn",
};

/** One colour for every shape in a question, so the child sorts by shape, not by colour. */
export const SHAPE_COLOR = "#ff8a65";

export const shapeToken = (id: ShapeId, color = SHAPE_COLOR) => `shape:${id}:${color}`;

export function parseShape(token: string): { id: ShapeId; color: string } | null {
  if (!token.startsWith("shape:")) return null;
  const [, id, color] = token.split(":");
  return { id: id as ShapeId, color: color || SHAPE_COLOR };
}

/** Everyday things and the shape they have (emoji supported on older iPads). */
export const SHAPE_THINGS: { emoji: string; name: string; shape: ShapeId }[] = [
  { emoji: "⚽", name: "quả bóng", shape: "tron" },
  { emoji: "🍪", name: "bánh quy", shape: "tron" },
  { emoji: "🍩", name: "bánh vòng", shape: "tron" },
  { emoji: "💿", name: "đĩa nhạc", shape: "tron" },
  { emoji: "🎁", name: "hộp quà", shape: "vuong" },
  { emoji: "🧇", name: "bánh quế", shape: "vuong" },
  { emoji: "⚠️", name: "biển báo", shape: "tamgiac" },
  { emoji: "🍙", name: "nắm cơm", shape: "tamgiac" },
  { emoji: "🧀", name: "miếng phô mai", shape: "tamgiac" },
  { emoji: "🥪", name: "bánh mì kẹp", shape: "tamgiac" },
  { emoji: "📺", name: "ti vi", shape: "chunhat" },
  { emoji: "📘", name: "quyển sách", shape: "chunhat" },
  { emoji: "🚪", name: "cửa", shape: "chunhat" },
  { emoji: "📱", name: "điện thoại", shape: "chunhat" },
];
