"use client";
import { useRef, useState } from "react";

/**
 * A parent-only button: it works only after being held down for `ms`.
 * A quick tap by the child does nothing, so the child cannot change settings by accident.
 */
export function HoldButton({ onHold, ms = 2000, label, className = "", children }: { onHold: () => void; ms?: number; label: string; className?: string; children: React.ReactNode }) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [holding, setHolding] = useState(false);
  const stop = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setHolding(false);
  };
  return (
    <button
      aria-label={label}
      title={label}
      className={`relative overflow-hidden ${className}`}
      onPointerDown={() => {
        setHolding(true);
        timer.current = setTimeout(() => {
          stop();
          onHold();
        }, ms);
      }}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onContextMenu={(e) => e.preventDefault()}
    >
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 bg-amber-300/60"
        style={{ width: holding ? "100%" : "0%", transition: holding ? `width ${ms}ms linear` : "none" }}
      />
      <span className="relative">{children}</span>
    </button>
  );
}
