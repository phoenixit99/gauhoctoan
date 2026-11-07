"use client";
import { useSettings } from "@/lib/settings";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, type Group } from "three";
import { Bear } from "./Bear";
import { Overlay, Projector, Stage } from "./Stage";

// Canopy spheres: [x, y, z, r]
const CANOPY: [number, number, number, number][] = [
  [-0.6, 2.8, 0, 1.3],
  [-1.5, 2.4, 0.1, 0.9],
  [0.3, 2.4, 0.1, 0.9],
  [-0.6, 3.7, -0.1, 0.9],
];

// Put each apple just in front of the canopy surface so it is always visible.
function onCanopy(x: number, y: number): [number, number, number] {
  let z = 0.6;
  for (const [cx, cy, cz, r] of CANOPY) {
    const d2 = r * r - (x - cx) ** 2 - (y - cy) ** 2;
    if (d2 > 0) z = Math.max(z, cz + Math.sqrt(d2));
  }
  return [x, y, z + 0.12];
}

const TREE_SLOTS: [number, number, number][] = [
  [-0.6, 2.85],
  [-1.6, 2.35],
  [0.4, 2.35],
  [-1.1, 3.65],
  [-0.1, 3.65],
  [-0.6, 1.85],
  [-1.9, 3.05],
  [0.7, 3.05],
  [-1.45, 1.72],
  [0.25, 1.72],
].map(([x, y]) => onCanopy(x, y));

const BASKET: [number, number, number] = [2.5, 0, 0.9];
// 10 slots: a ring of 5, a ring of 4 on top, then 1 at the peak.
const BASKET_SLOTS: [number, number, number][] = [
  ...Array.from({ length: 5 }, (_, i): [number, number, number] => {
    const a = (i / 5) * Math.PI * 2 + Math.PI / 2;
    return [Math.cos(a) * 0.45, 0.5, Math.sin(a) * 0.45];
  }),
  ...Array.from({ length: 4 }, (_, i): [number, number, number] => {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    return [Math.cos(a) * 0.3, 0.88, Math.sin(a) * 0.3];
  }),
  [0, 1.2, 0] as [number, number, number],
].map(([x, y, z]) => [BASKET[0] + x, BASKET[1] + y, BASKET[2] + z]);

function Apple({
  target,
  onTap,
  highlight,
  register,
}: {
  target: [number, number, number];
  onTap?: () => void;
  highlight?: boolean;
  register: (g: Group | null) => void;
}) {
  const ref = useRef<Group>(null);
  const anim = useRef({
    from: new Vector3(...target),
    to: new Vector3(...target),
    t0: -1,
  });
  const key = target.join(",");

  useEffect(() => {
    const g = ref.current;
    if (!g) return;
    anim.current = {
      from: g.position.clone(),
      to: new Vector3(...target),
      t0: -1,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useFrame(({ clock }) => {
    const g = ref.current;
    if (!g) return;
    const a = anim.current;
    if (a.t0 < 0) a.t0 = clock.elapsedTime;
    const t = Math.min(1, (clock.elapsedTime - a.t0) / 0.7);
    const e = 1 - Math.pow(1 - t, 3);
    g.position.lerpVectors(a.from, a.to, e);
    if (a.from.distanceToSquared(a.to) > 0.0001)
      g.position.y += Math.sin(Math.PI * t) * 1.1;
    const pulse = highlight ? 1.18 + Math.sin(clock.elapsedTime * 8) * 0.08 : 1;
    g.scale.setScalar(pulse);
  });

  return (
    <group
      ref={(g) => {
        ref.current = g;
        register(g);
      }}
      position={target}
    >
      <mesh
        castShadow
        onClick={(e) => {
          e.stopPropagation();
          onTap?.();
        }}
        onPointerOver={() => onTap && (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "")}
      >
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial
          color="#e53935"
          roughness={0.35}
          emissive={highlight ? "#ff6f60" : "#000000"}
          emissiveIntensity={highlight ? 0.6 : 0}
        />
      </mesh>
      {/* larger invisible hit area for small fingers */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onTap?.();
        }}
      >
        <sphereGeometry args={[0.4, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.025, 0.03, 0.14]} />
        <meshStandardMaterial color="#6d4c2f" />
      </mesh>
      <mesh
        position={[0.09, 0.33, 0]}
        rotation={[0, 0, -0.8]}
        scale={[1, 0.45, 0.6]}
      >
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshStandardMaterial color="#5cb85c" />
      </mesh>
    </group>
  );
}

function Tree() {
  return (
    <group>
      <mesh position={[-0.6, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.36, 1.8, 16]} />
        <meshStandardMaterial color="#8d5a34" roughness={0.9} />
      </mesh>
      {CANOPY.map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <sphereGeometry args={[r, 32, 32]} />
          <meshStandardMaterial
            color={i % 2 ? "#4caf50" : "#5cc160"}
            roughness={0.85}
          />
        </mesh>
      ))}
    </group>
  );
}

function Basket({ onTap }: { onTap?: () => void }) {
  return (
    <group position={BASKET} onClick={onTap}>
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.88, 0.62, 0.84, 32, 1, true]} />
        <meshStandardMaterial color="#c98b4a" roughness={0.9} side={2} />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.62, 32]} />
        <meshStandardMaterial color="#a86f35" />
      </mesh>
      <mesh position={[0, 0.84, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.88, 0.07, 12, 40]} />
        <meshStandardMaterial color="#8d5a2b" />
      </mesh>
      <mesh position={[0, 0.84, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.8, 0.05, 10, 40, Math.PI]} />
        <meshStandardMaterial color="#8d5a2b" />
      </mesh>
    </group>
  );
}

function Ground() {
  const flowers = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => {
        const a = (i / 18) * Math.PI * 2;
        const r = 4.2 + (i % 3) * 0.7;
        return {
          x: Math.cos(a) * r,
          z: Math.sin(a) * r * 0.6 - 1,
          c: ["#ff8a80", "#fff176", "#ffffff", "#f48fb1"][i % 4],
        };
      }),
    [],
  );
  return (
    <group>
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <cylinderGeometry args={[7.5, 7.8, 0.2, 64]} />
        <meshStandardMaterial color="#8fd16a" roughness={1} />
      </mesh>
      {flowers.map((f, i) => (
        <mesh key={i} position={[f.x, 0.08, f.z]}>
          <sphereGeometry args={[0.1, 10, 10]} />
          <meshStandardMaterial color={f.c} />
        </mesh>
      ))}
    </group>
  );
}

export type OrchardProps = {
  apples: number; // how many apples exist (<= 10)
  basket: number[]; // apple indices in the basket, in drop order
  onTapApple?: (i: number) => void;
  highlight?: number[];
  labels?: Record<number, number>; // apple index -> number shown above it
  bearHappy?: boolean;
};

/** The orchard: 3D, or a flat 2D version when the parent turned 3D off. */
export function Orchard(props: OrchardProps) {
  const flat = useSettings((s) => s.no3D);
  return flat ? <FlatOrchard {...props} /> : <Orchard3D {...props} />;
}

/** 2D orchard: apples on the tree (top), apples in the basket (bottom), in the order they were put in. */
function FlatOrchard({ apples, basket, onTapApple, highlight = [], labels = {}, bearHappy }: OrchardProps) {
  const onTree = Array.from({ length: apples }, (_, i) => i).filter((i) => !basket.includes(i));
  const apple = (i: number) => (
    <button
      key={i}
      disabled={!onTapApple}
      onClick={() => onTapApple?.(i)}
      aria-label="quả táo"
      className={`relative grid h-16 w-16 place-items-center rounded-full text-5xl ${highlight.includes(i) ? "ring-4 ring-yellow-300" : ""}`}
    >
      🍎
      {labels[i] !== undefined && (
        <span className="absolute -right-2 -top-2 grid h-8 w-8 place-items-center rounded-full bg-white text-lg font-extrabold text-orange-600 shadow ring-2 ring-orange-300">
          {labels[i]}
        </span>
      )}
    </button>
  );
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-4">
      <div className="flex min-h-24 w-full max-w-3xl flex-wrap items-center justify-center gap-2 rounded-[2rem] bg-green-200/80 p-3 shadow-inner">
        <span className="mr-2 text-5xl" aria-hidden>
          🌳
        </span>
        {onTree.map(apple)}
      </div>
      <div className="flex items-end gap-4">
        <span className="text-7xl" aria-label={bearHappy ? "Gấu vui" : "Gấu"}>
          {bearHappy ? "🐻😊" : "🐻"}
        </span>
        <div className="flex min-h-28 min-w-72 max-w-2xl flex-wrap items-center justify-center gap-2 rounded-b-[3rem] rounded-t-xl border-8 border-amber-700 bg-amber-200 p-3 shadow-lg">
          {basket.length === 0 ? <span className="text-5xl opacity-60">🧺</span> : basket.map(apple)}
        </div>
      </div>
    </div>
  );
}

function Orchard3D({
  apples,
  basket,
  onTapApple,
  highlight = [],
  labels = {},
  bearHappy,
}: OrchardProps) {
  const appleGroups = useRef<(Group | null)[]>([]);
  const labelEls = useRef<(HTMLElement | null)[]>([]);
  return (
    <div className="relative h-full w-full">
      <Stage camera={[0.2, 2.8, 9]} target={[0.1, 1.9, 0]} minAspect={1.25}>
        <Ground />
        <Tree />
        <Basket />
        <Bear
          position={[-3.4, 0, 0.9]}
          rotationY={0.5}
          scale={0.95}
          happy={bearHappy}
        />
        {Array.from({ length: apples }, (_, i) => {
          const k = basket.indexOf(i);
          const target = k >= 0 ? BASKET_SLOTS[k] : TREE_SLOTS[i];
          return (
            <Apple
              key={i}
              target={target}
              onTap={onTapApple ? () => onTapApple(i) : undefined}
              highlight={highlight.includes(i)}
              register={(g) => {
                appleGroups.current[i] = g;
              }}
            />
          );
        })}
        <Projector
          count={apples}
          els={labelEls}
          getWorld={(i, out) => {
            const g = appleGroups.current[i];
            if (!g || labels[i] === undefined) return false;
            g.getWorldPosition(out);
            out.y += 0.62;
            return true;
          }}
        />
      </Stage>
      <Overlay>
        {Array.from({ length: apples }, (_, i) => (
          <div
            key={i}
            ref={(el) => {
              labelEls.current[i] = el;
            }}
            className="absolute left-0 top-0"
            style={{ visibility: "hidden" }}
          >
            {labels[i] !== undefined && (
              <div className="grid h-11 w-11 place-items-center rounded-full bg-white text-2xl font-extrabold text-orange-600 shadow-lg ring-4 ring-orange-300">
                {labels[i]}
              </div>
            )}
          </div>
        ))}
      </Overlay>
    </div>
  );
}
