"use client";
import { motion } from "framer-motion";
import type { MethodStep } from "@/content/methods";
import { useMethodStep } from "@/lib/method";

/** The fixed steps of a method: ① ② ③. The step being worked on lights up. */
export function MethodBar({ steps, vertical = false }: { steps: MethodStep[]; vertical?: boolean }) {
  const active = useMethodStep((s) => s.active);
  return (
    <ol className={`flex gap-2 px-3 ${vertical ? "flex-col items-stretch" : "flex-wrap justify-center"}`} aria-label="Các bước làm">
      {steps.map((s, i) => {
        const on = i === active;
        return (
          <motion.li
            key={i}
            animate={{ scale: on ? 1.06 : 1 }}
            transition={{ duration: 0.2 }}
            aria-current={on ? "step" : undefined}
            className={`flex items-center gap-2 rounded-2xl px-3 py-1.5 font-bold shadow ${vertical ? "text-2xl" : "text-lg"} ${
              on ? "bg-orange-400 text-white ring-4 ring-yellow-300" : "bg-white/85 text-amber-900"
            }`}
          >
            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-lg font-extrabold ${on ? "bg-white text-orange-500" : "bg-amber-200 text-amber-900"}`}>
              {i + 1}
            </span>
            <span aria-hidden>{s.icon}</span>
            <span className="text-left">{s.text}</span>
          </motion.li>
        );
      })}
    </ol>
  );
}
