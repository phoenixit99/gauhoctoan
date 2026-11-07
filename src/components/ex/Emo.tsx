"use client";
import { parseShape, type ShapeId } from "@/content/shapes";

/** A shape drawn as SVG, sized like text (1em tall). The rectangle is clearly wider than the square. */
export function ShapeSvg({ id, color, className = "" }: { id: ShapeId; color: string; className?: string }) {
  const common = { fill: color, stroke: "#5d4037", strokeWidth: 4, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 100 100" width="1em" height="1em" className={`inline-block ${className}`} aria-hidden>
      {id === "tron" && <circle cx="50" cy="50" r="42" {...common} />}
      {id === "vuong" && <rect x="12" y="12" width="76" height="76" {...common} />}
      {id === "tamgiac" && <polygon points="50,8 94,90 6,90" {...common} />}
      {id === "chunhat" && <rect x="2" y="26" width="96" height="48" {...common} />}
    </svg>
  );
}

/** Shows an emoji, or a shape when given a shape token ("shape:tron:#e53935"). */
export function Emo({ e }: { e: string }) {
  const s = parseShape(e);
  if (s) return <ShapeSvg id={s.id} color={s.color} />;
  return <>{e}</>;
}
