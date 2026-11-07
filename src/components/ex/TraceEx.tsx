"use client";
import { useEffect, useRef, useState } from "react";
import type { TraceQ } from "@/content/types";
import { speak } from "@/lib/speech";
import { wait } from "@/lib/vn";
import { playWalk, usePrompt, type ExProps } from "./common";

const N = 60; // checkpoints along the stroke
const NEAR = 10; // how close (in the 100×100 box) the finger must pass a checkpoint
const START = 14; // how close to the green dot the finger must start

type Pt = { x: number; y: number };

/**
 * Tập viết nét: drag from the green dot along the dotted stroke to the red dot.
 * The coloured line grows only as the finger passes each checkpoint in order, so the child sees
 * exactly how far they have come. Lifting the finger keeps the progress; continue from the end of the line.
 */
export function TraceEx({ q, hint, locked, onAnswer, onRevealDone }: ExProps<TraceQ>) {
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [pts, setPts] = useState<Pt[]>([]);
  const [len, setLen] = useState(0);
  const [done, setDone] = useState(0); // checkpoints passed
  const doneRef = useRef(0);
  const drawing = useRef(false);
  const strays = useRef(0); // touches away from the dot
  const prompt = usePrompt(q);

  useEffect(() => {
    const p = pathRef.current;
    if (!p) return;
    const L = p.getTotalLength();
    setLen(L);
    setPts(Array.from({ length: N }, (_, i) => {
      const a = p.getPointAtLength((L * i) / (N - 1));
      return { x: a.x, y: a.y };
    }));
  }, [q.d]);

  const setProgress = (n: number) => {
    doneRef.current = n;
    setDone(n);
  };

  useEffect(() => {
    if (hint < 2) return;
    let alive = true;
    (async () => {
      await prompt.current;
      if (hint === 2) {
        await speak(`Đặt ngón tay vào chấm xanh. Kéo theo đường chấm đến chấm đỏ.`);
        return;
      }
      setProgress(0);
      const ok = await playWalk(q.walk ?? [], () => alive, undefined, async (_w, i) => {
        if (i !== 1) return;
        for (let k = 1; k <= N && alive; k++) {
          setProgress(k);
          await wait(25);
        }
      });
      if (ok) onRevealDone();
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hint]);

  const toBox = (e: React.PointerEvent): Pt | null => {
    const svg = svgRef.current;
    const m = svg?.getScreenCTM();
    if (!svg || !m) return null;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  };
  const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);
  const canDraw = () => !locked && hint < 3 && doneRef.current < N;

  const down = (e: React.PointerEvent) => {
    if (!canDraw() || !pts.length) return;
    const p = toBox(e);
    if (!p) return;
    const from = doneRef.current === 0 ? pts[0] : pts[doneRef.current - 1];
    if (dist(p, from) > START) {
      const msg = doneRef.current === 0 ? "Đặt ngón tay vào chấm xanh nhé." : "Đặt ngón tay vào cuối đường màu, rồi kéo tiếp nhé.";
      strays.current++;
      // Young children often touch around first: only remind. After 3 stray touches, move up the hint ladder.
      if (strays.current % 3 === 0) onAnswer(false, msg);
      else void speak(msg);
      return;
    }
    svgRef.current?.setPointerCapture?.(e.pointerId);
    drawing.current = true;
    if (doneRef.current === 0) setProgress(1);
  };

  const move = (e: React.PointerEvent) => {
    if (!drawing.current || !canDraw()) return;
    const p = toBox(e);
    if (!p) return;
    let n = doneRef.current;
    // Allow skipping a few checkpoints (fast fingers) but never jumping ahead along the stroke.
    for (let k = n; k < Math.min(N, n + 6); k++) if (dist(p, pts[k]) < NEAR) n = k + 1;
    if (n !== doneRef.current) {
      setProgress(n);
      if (n >= N) {
        drawing.current = false;
        void speak(`Đây là ${q.name}.`).then(() => onAnswer(true));
      }
    }
  };

  const up = () => {
    drawing.current = false;
  };

  const start = pts[0];
  const end = pts[N - 1];
  const progressLen = len * Math.min(1, Math.max(0, (done - 1) / (N - 1)));

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-4">
      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        className="aspect-square h-[min(58vh,80vw)] touch-none select-none rounded-[2rem] bg-white shadow-xl"
        style={{ touchAction: "none" }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      >
        {/* writing-paper lines */}
        {[20, 35, 50, 65, 80].map((y) => (
          <line key={y} x1={4} x2={96} y1={y} y2={y} stroke={y === 50 ? "#90caf9" : "#e3f2fd"} strokeWidth={0.6} />
        ))}
        {/* dotted guide */}
        <path ref={pathRef} d={q.d} fill="none" stroke="#b0bec5" strokeWidth={5} strokeDasharray="0.1 4" strokeLinecap="round" />
        {/* what the child has traced */}
        {len > 0 && done > 0 && (
          <path d={q.d} fill="none" stroke="#ff7043" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${progressLen} ${len}`} />
        )}
        {end && <circle cx={end.x} cy={end.y} r={4.5} fill="#e53935" />}
        {start && <circle cx={start.x} cy={start.y} r={5.5} fill="#43a047" className={done === 0 ? "animate-pulse" : ""} />}
        {/* the moving tip */}
        {done > 0 && done < N && pts[done - 1] && <circle cx={pts[done - 1].x} cy={pts[done - 1].y} r={3.5} fill="#ff7043" stroke="white" strokeWidth={1} />}
      </svg>
      <div className="chip text-2xl">{q.name}</div>
    </div>
  );
}
