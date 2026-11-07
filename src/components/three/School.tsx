"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Shape, Vector3, type Group, type Mesh } from "three";
import { Boy, Hero } from "./Boy";
import { Overlay, Projector, Stage } from "./Stage";
import { KID, useKid } from "@/lib/kid";

/** The name tag above the main character; updates as soon as a parent changes the name. */
function KidName() {
  return <>{useKid((s) => s.name) || KID.name}</>;
}

// ---------------------------------------------------------------------------
// Campus layout (x → right, z → towards the gate / camera). Gate at the front.
//   Left:          classroom block, ground floor + 2 upper floors ("2 lầu")
//   Centre:        sports field
//   Back-right:    swimming pool
//   Middle-right:  canteen (nhà ăn)
//   Front-right:   admissions + talent-subjects building
// ---------------------------------------------------------------------------

export type SchoolPhase = "gate" | "walkIn" | "yard" | "walkToClass";

const FLOOR_H = 2.8;
const FLOORS = 3;
const BLOCK = { x0: -16, x1: -10, z0: -11, z1: 11 }; // classroom block footprint
export const CLASS_DOOR_Z = 9.45; // door of the first room (nearest the gate), ground floor

const GATE_OUT: [number, number] = [0, 17];
const YARD: [number, number] = [0, 7.5];
const PATHS: Record<"walkIn" | "walkToClass", [number, number][]> = {
  walkIn: [GATE_OUT, [0, 13], YARD],
  walkToClass: [YARD, [-5, 8.6], [-9.4, CLASS_DOOR_Z], [-10.8, CLASS_DOOR_Z]],
};

type Cam = { pos: [number, number, number]; target: [number, number, number] };
const CAMS: Record<SchoolPhase, Cam> = {
  gate: { pos: [0, 2.6, 25.5], target: [0, 2.9, 13] },
  walkIn: { pos: [0, 12, 26], target: [0, 0, 4] },
  yard: { pos: [0, 21, 27], target: [0, 0, -0.5] },
  walkToClass: { pos: [1, 6.4, 14.2], target: [-10.5, 1.4, 8] },
};

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------

function Box({
  p,
  s,
  c,
  shadow = false,
}: {
  p: [number, number, number];
  s: [number, number, number];
  c: string;
  shadow?: boolean;
}) {
  return (
    <mesh position={p} castShadow={shadow} receiveShadow={shadow}>
      <boxGeometry args={s} />
      <meshStandardMaterial color={c} roughness={0.85} />
    </mesh>
  );
}

function Tree({ x, z, s = 1 }: { x: number; z: number; s?: number }) {
  return (
    <group position={[x, 0, z]} scale={s}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.22, 1.4, 8]} />
        <meshStandardMaterial color="#8d5a34" />
      </mesh>
      <mesh position={[0, 2.0, 0]} castShadow>
        <sphereGeometry args={[1.0, 14, 12]} />
        <meshStandardMaterial color="#4caf50" />
      </mesh>
      <mesh position={[0.45, 1.7, 0.4]}>
        <sphereGeometry args={[0.65, 12, 10]} />
        <meshStandardMaterial color="#5cc160" />
      </mesh>
    </group>
  );
}

function Ground() {
  return (
    <group>
      {/* campus yard */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.5]} receiveShadow>
        <planeGeometry args={[38, 31]} />
        <meshStandardMaterial color="#e9e2d0" roughness={1} />
      </mesh>
      {/* street + sidewalk outside the gate */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 24]}>
        <planeGeometry args={[80, 18]} />
        <meshStandardMaterial color="#7d8790" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 17]}>
        <planeGeometry args={[80, 4]} />
        <meshStandardMaterial color="#cfc8b8" roughness={1} />
      </mesh>
      {/* grass around */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -10]}>
        <planeGeometry args={[90, 40]} />
        <meshStandardMaterial color="#8fcf6f" roughness={1} />
      </mesh>
    </group>
  );
}

function Fence() {
  const H = 1.3;
  const c = "#f2efe6";
  return (
    <group>
      <Box p={[-18.8, H / 2, -0.5]} s={[0.4, H, 31]} c={c} />
      <Box p={[18.8, H / 2, -0.5]} s={[0.4, H, 31]} c={c} />
      <Box p={[0, H / 2, -16]} s={[38, H, 0.4]} c={c} />
      {/* front wall with gate opening */}
      <Box p={[-10.8, H / 2, 15]} s={[16, H, 0.4]} c={c} />
      <Box p={[10.8, H / 2, 15]} s={[16, H, 0.4]} c={c} />
    </group>
  );
}

/** Gate: two pillars and a sign board (the school name is an overlay label). */
function Gate() {
  return (
    <group position={[0, 0, 15]}>
      {[-3, 3].map((x) => (
        <group key={x}>
          <Box p={[x, 2.1, 0]} s={[0.8, 4.2, 0.8]} c="#f7f4ec" shadow />
          <Box p={[x, 4.3, 0]} s={[1.0, 0.25, 1.0]} c="#d0c7b4" />
        </group>
      ))}
      <Box p={[0, 4.75, 0]} s={[7.4, 1.3, 0.35]} c="#1f3b73" shadow />
      <Box p={[0, 4.05, 0]} s={[7.4, 0.12, 0.4]} c="#f4b400" />
      {/* open gate leaves */}
      <Box p={[-4.9, 0.9, 1.1]} s={[0.12, 1.6, 2.2]} c="#b0bec5" />
      <Box p={[4.9, 0.9, 1.1]} s={[0.12, 1.6, 2.2]} c="#b0bec5" />
    </group>
  );
}

/** Ground floor + 2 upper floors, rooms open onto a corridor facing the yard. */
function ClassBlock() {
  const { x0, x1, z0, z1 } = BLOCK;
  const len = z1 - z0;
  const depth = x1 - x0;
  const roomLen = len / 4;
  return (
    <group>
      {Array.from({ length: FLOORS }, (_, f) => {
        const y = f * FLOOR_H;
        return (
          <group key={f}>
            {/* rooms */}
            <Box p={[x0 + depth / 2 - 0.6, y + FLOOR_H / 2, (z0 + z1) / 2]} s={[depth - 1.2, FLOOR_H, len]} c={f % 2 ? "#ffe7a8" : "#fff0c2"} shadow />
            {/* corridor slab + railing */}
            <Box p={[x1 - 0.6, y + 0.06, (z0 + z1) / 2]} s={[1.3, 0.12, len]} c="#d7cdb8" />
            {f > 0 && <Box p={[x1 + 0.02, y + 0.55, (z0 + z1) / 2]} s={[0.1, 0.9, len]} c="#ef6c00" />}
            {/* doors + windows per room */}
            {Array.from({ length: 4 }, (_, r) => {
              const zc = z1 - roomLen * (r + 0.5);
              const first = f === 0 && r === 0;
              return (
                <group key={r}>
                  <Box p={[x1 - 1.18, y + 1.05, zc + 1.2]} s={[0.06, 2.0, 1.0]} c={first ? "#1e88e5" : "#8d6e63"} />
                  <Box p={[x1 - 1.18, y + 1.5, zc - 1.0]} s={[0.06, 1.0, 1.8]} c="#9fd8ff" />
                  {/* divider column between rooms */}
                  <Box p={[x1 - 0.05, y + FLOOR_H / 2, z1 - roomLen * r]} s={[0.25, FLOOR_H, 0.25]} c="#f7f4ec" />
                </group>
              );
            })}
            <Box p={[x1 - 0.05, y + FLOOR_H / 2, z0]} s={[0.25, FLOOR_H, 0.25]} c="#f7f4ec" />
          </group>
        );
      })}
      {/* roof */}
      <Box p={[(x0 + x1) / 2, FLOORS * FLOOR_H + 0.15, (z0 + z1) / 2]} s={[depth + 0.6, 0.3, len + 0.6]} c="#d84315" shadow />
      {/* steps up to the first classroom */}
      <Box p={[x1 + 0.35, 0.08, CLASS_DOOR_Z]} s={[0.7, 0.16, 2]} c="#cfc6b3" />
    </group>
  );
}

function Field() {
  const W = 12;
  const L = 13;
  const cz = -3.5;
  const line = "#ffffff";
  return (
    <group position={[0, 0.02, cz]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[W + 1.2, L + 1.2]} />
        <meshStandardMaterial color="#d35f3f" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[W, L]} />
        <meshStandardMaterial color="#3fae4f" roughness={1} />
      </mesh>
      {/* lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[W, 0.08]} />
        <meshBasicMaterial color={line} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[1.5, 1.6, 40]} />
        <meshBasicMaterial color={line} />
      </mesh>
      {[-1, 1].map((d) => (
        <group key={d} position={[0, 0, d * (L / 2 - 0.1)]}>
          <Box p={[-1.2, 0.5, 0]} s={[0.08, 1, 0.08]} c={line} />
          <Box p={[1.2, 0.5, 0]} s={[0.08, 1, 0.08]} c={line} />
          <Box p={[0, 1, 0]} s={[2.48, 0.08, 0.08]} c={line} />
        </group>
      ))}
    </group>
  );
}

// Field centre and half-size in world units (matches Field above).
const FIELD = { cx: 0, cz: -3.5, hx: 5.6, hz: 5.9 };

/** Six classmates (two teams) running after a ball that rolls around the pitch. */
function FootballGame() {
  const ball = useRef<Mesh>(null);
  const kids = useRef<(Group | null)[]>([]);
  const running = useRef(true);
  const N = 6;
  // Each kid has a "home" spot per team; they run towards the ball but drift back to their spot.
  const homes = useMemo(
    () =>
      Array.from({ length: N }, (_, i) => {
        const team = i < 3 ? -1 : 1; // red team defends the far end, blue the near end
        const col = (i % 3) - 1;
        return { x: col * 3.2, z: FIELD.cz + team * 3.6, speed: 1.1 + (i % 3) * 0.25 };
      }),
    [],
  );
  const pos = useRef(homes.map((h) => ({ x: h.x, z: h.z })));
  // the main boy walks in from the yard to the pitch edge, then chases the ball too
  const hero = useRef<Group>(null);
  const heroPos = useRef({ x: 0, z: YARD[1] });
  const heroIn = useRef(false);
  const ENTRY = { x: 0, z: FIELD.cz + FIELD.hz - 0.8 };

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    // the ball rolls around in a lazy figure-eight
    const bx = FIELD.cx + Math.sin(t * 0.55) * 3.6;
    const bz = FIELD.cz + Math.sin(t * 0.37) * 3.8;
    if (ball.current) {
      ball.current.position.set(bx, 0.22, bz);
      ball.current.rotation.x = t * 3;
    }
    const hp = heroPos.current;
    let tx0: number, tz0: number, sp: number;
    if (!heroIn.current) {
      tx0 = ENTRY.x;
      tz0 = ENTRY.z;
      sp = 2.4;
      if (Math.hypot(tx0 - hp.x, tz0 - hp.z) < 0.1) heroIn.current = true;
    } else {
      tx0 = bx;
      tz0 = bz;
      sp = 2.0;
    }
    {
      const dx = tx0 - hp.x;
      const dz = tz0 - hp.z;
      const len = Math.hypot(dx, dz);
      const step = Math.min(len, sp * dt);
      if (len > 1e-4) {
        hp.x += (dx / len) * step;
        hp.z += (dz / len) * step;
      }
      if (heroIn.current) {
        hp.x = Math.min(FIELD.cx + FIELD.hx, Math.max(FIELD.cx - FIELD.hx, hp.x));
        hp.z = Math.min(FIELD.cz + FIELD.hz, Math.max(FIELD.cz - FIELD.hz, hp.z));
      }
      if (hero.current) {
        hero.current.position.set(hp.x, 0.02, hp.z);
        if (len > 0.05) hero.current.rotation.y = Math.atan2(dx, dz);
      }
    }
    homes.forEach((h, i) => {
      const p = pos.current[i];
      // chase the ball, but pulled back towards this kid's spot
      const tx = bx * 0.7 + h.x * 0.3;
      const tz = bz * 0.7 + h.z * 0.3;
      const dx = tx - p.x;
      const dz = tz - p.z;
      const len = Math.hypot(dx, dz);
      const step = Math.min(len, h.speed * dt);
      if (len > 1e-4) {
        p.x += (dx / len) * step;
        p.z += (dz / len) * step;
      }
      p.x = Math.min(FIELD.cx + FIELD.hx, Math.max(FIELD.cx - FIELD.hx, p.x));
      p.z = Math.min(FIELD.cz + FIELD.hz, Math.max(FIELD.cz - FIELD.hz, p.z));
      const g = kids.current[i];
      if (g) {
        g.position.set(p.x, 0.02, p.z);
        if (len > 0.05) g.rotation.y = Math.atan2(dx, dz); // face where they run
      }
    });
  });

  return (
    <group>
      {homes.map((_, i) => (
        <group
          key={i}
          ref={(el) => {
            kids.current[i] = el;
          }}
        >
          <Boy walking={running} scale={1} shirt={i < 3 ? "#d32f2f" : "#1565c0"} />
        </group>
      ))}
      <group ref={hero}>
        <Hero walking={running} scale={1.1} />
      </group>
      <mesh ref={ball} castShadow>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

const POOL = { x: 12.8, z: -10, hx: 3.5, hz: 3 }; // pool centre and water half-size in world units
const WATER_Y = 0.27; // water surface, clearly above the deck top (0.2) so it never flickers

function Pool() {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = Math.sin(clock.elapsedTime * 1.5) * 0.012;
  });
  return (
    <group position={[POOL.x, 0, POOL.z]}>
      <Box p={[0, 0.1, 0]} s={[8, 0.2, 7]} c="#eceff1" />
      <group ref={ref}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, WATER_Y - 0.02, 0]}>
          <planeGeometry args={[POOL.hx * 2, POOL.hz * 2]} />
          <meshStandardMaterial color="#29b6f6" roughness={0.15} metalness={0.1} />
        </mesh>
      </group>
      {[-1.5, 0, 1.5].map((x) => (
        <Box key={x} p={[x, WATER_Y + 0.01, 0]} s={[0.06, 0.06, 6]} c={x === 0 ? "#ffeb3b" : "#ef5350"} />
      ))}
      {/* ladder */}
      {[-0.25, 0.25].map((x) => (
        <Box key={x} p={[x, 0.6, 3.05]} s={[0.06, 0.8, 0.06]} c="#b0bec5" />
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Pool visit: classmates in swim rings swim laps and play with a beach ball; the main
// character walks to the ladder, takes the backpack off, puts a ring on and hops in.
// ---------------------------------------------------------------------------

const RING_COLORS = [
  ["#ff5252", "#ffffff"],
  ["#ffca28", "#26c6da"],
  ["#ab47bc", "#ffffff"],
  ["#66bb6a", "#ffee58"],
  ["#ff7043", "#ffffff"],
];
const RING_Y = 0.85; // waist height of the kid model (before scale)

/** An inflatable swim ring (phao bơi) around the waist: four stripes in two colours. */
function SwimRing({ colors, scale = 1 }: { colors: string[]; scale?: number }) {
  return (
    <group position={[0, RING_Y * scale, 0]} rotation={[Math.PI / 2, 0, 0]} scale={scale}>
      {[0, 1, 2, 3].map((k) => (
        <mesh key={k} rotation={[0, 0, (k * Math.PI) / 2]} castShadow>
          <torusGeometry args={[0.42, 0.14, 12, 16, Math.PI / 2]} />
          <meshStandardMaterial color={colors[k % 2]} roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
}

/** Rings of little waves spreading out on the water around a kid. */
function Ripples({ scale = 1, offset = 0 }: { scale?: number; offset?: number }) {
  const rings = useRef<(Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    rings.current.forEach((m, i) => {
      if (!m) return;
      const k = (clock.elapsedTime * 0.6 + offset + i * 0.5) % 1;
      m.scale.setScalar(0.7 + k * 1.4);
      (m.material as { opacity: number }).opacity = 0.55 * (1 - k);
    });
  });
  return (
    <group position={[0, RING_Y * scale + 0.01, 0]}>
      {[0, 1].map((i) => (
        <mesh
          key={i}
          ref={(el) => {
            rings.current[i] = el;
          }}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.55 * scale, 0.62 * scale, 32]} />
          <meshBasicMaterial color="#e1f5fe" transparent opacity={0.5} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

/** Water drops jumping up when a playing kid slaps the water. */
function Splash({ offset = 0 }: { offset?: number }) {
  const drops = useRef<(Mesh | null)[]>([]);
  const dirs = useMemo(() => Array.from({ length: 6 }, (_, i) => (i / 6) * Math.PI * 2), []);
  useFrame(({ clock }) => {
    // matches the slap in Boy (sin(u*6)): drops fly while the arms come down
    const k = (((clock.elapsedTime + offset) * 6) / (Math.PI * 2) + 0.25) % 1;
    drops.current.forEach((m, i) => {
      if (!m) return;
      const a = dirs[i];
      const r = 0.45 + k * 0.5;
      m.position.set(Math.cos(a) * r, RING_Y + 0.1 + Math.sin(k * Math.PI) * 0.6, Math.sin(a) * r);
      m.visible = k < 0.9;
    });
  });
  return (
    <group>
      {dirs.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            drops.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.05, 8, 6]} />
          <meshStandardMaterial color="#e3f2fd" transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  );
}

/** One classmate floating in a ring. Moves via the group ref the parent animates. */
function Floater({ i, swim, setRef }: { i: number; swim: "swim" | "splash"; setRef: (g: Group | null) => void }) {
  return (
    <group ref={setRef}>
      <Boy swim={swim} offset={i * 0.7} bag={false} shirt={SHIRTS[i % SHIRTS.length]} girl={i % 2 === 1} />
      <SwimRing colors={RING_COLORS[i % RING_COLORS.length]} />
      <Ripples offset={i * 0.3} />
      {swim === "splash" && <Splash offset={i * 0.7} />}
    </group>
  );
}

// Lanes are along z (the lane ropes in Pool). Local x of each swimmer's lane.
const LANES = [-2.6, 0.75];
const HERO_LANE = -0.9;
// two friends play catch with a beach ball in the right-hand corner
const PLAYERS = [
  { x: 2.5, z: -1.4 },
  { x: 2.5, z: 1.4 },
];
const SWIM_HZ = 2.2; // how far along z the swimmers go from the centre
const bob = (t: number, k: number) => Math.sin(t * 2.2 + k) * 0.04;

/** Float height: the ring sits on the water. */
const floatY = (scale: number) => WATER_Y - RING_Y * scale;

// Main character's way from the yard to the pool ladder (world units), then the jump into the water.
const POOL_PATH: [number, number][] = [
  [YARD[0], YARD[1]],
  [7.4, 5],
  [7.4, -5.4],
  [POOL.x + HERO_LANE, -5.9],
];
const POOL_JUMP_TO: [number, number] = [POOL.x + HERO_LANE, POOL.z + POOL.hz - 0.9];

function PoolVisit() {
  const swimmers = useRef<(Group | null)[]>([]);
  const players = useRef<(Group | null)[]>([]);
  const ball = useRef<Mesh>(null);
  const hero = useRef<Group>(null);
  const walking = useRef(true);
  const st = useRef({ x: POOL_PATH[0][0], z: POOL_PATH[0][1], i: 1, stage: "walk" as "walk" | "ready" | "jump" | "swim", t0: 0, heading: Math.PI });
  const [ready, setReady] = useState(false); // backpack off, ring on
  const [inWater, setInWater] = useState(false);

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    // classmates swimming laps
    swimmers.current.forEach((g, k) => {
      if (!g) return;
      const w = 0.45 + k * 0.12;
      const z = POOL.z + Math.sin(t * w + k * 2) * SWIM_HZ;
      const vz = Math.cos(t * w + k * 2);
      g.position.set(POOL.x + LANES[k], floatY(1) + bob(t, k), z);
      const want = vz >= 0 ? 0 : Math.PI;
      let d = want - g.rotation.y;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      g.rotation.y += d * Math.min(1, dt * 3);
    });
    // two friends tossing a beach ball
    players.current.forEach((g, k) => {
      if (!g) return;
      const p = PLAYERS[k];
      g.position.set(POOL.x + p.x, floatY(1) + bob(t, 3 + k), POOL.z + p.z);
      g.rotation.y = k === 0 ? 0 : Math.PI; // face each other
    });
    if (ball.current) {
      const period = 2.4;
      const ph = (t % period) / period; // 0→1: player 0 → player 1, then back
      const there = ph < 0.5;
      const k = there ? ph * 2 : (ph - 0.5) * 2;
      const z0 = PLAYERS[there ? 0 : 1].z + (there ? 0.5 : -0.5);
      const z1 = PLAYERS[there ? 1 : 0].z + (there ? -0.5 : 0.5);
      ball.current.position.set(POOL.x + PLAYERS[0].x, WATER_Y + 1.1 + Math.sin(k * Math.PI) * 1.4, POOL.z + z0 + (z1 - z0) * k);
      ball.current.rotation.x = t * 4;
    }

    // the main character
    const h = hero.current;
    const s = st.current;
    if (!h) return;
    if (s.stage === "walk") {
      walking.current = true;
      const [tx, tz] = POOL_PATH[s.i];
      const dx = tx - s.x;
      const dz = tz - s.z;
      const len = Math.hypot(dx, dz);
      const step = Math.min(len, 2.4 * Math.min(dt, 0.05));
      if (len > 1e-4) {
        s.x += (dx / len) * step;
        s.z += (dz / len) * step;
        h.rotation.y = Math.atan2(dx, dz);
      }
      h.position.set(s.x, 0.02, s.z);
      if (len - step < 0.02) {
        s.i++;
        if (s.i >= POOL_PATH.length) {
          // at the ladder: face the water, take the bag off, put the ring on
          s.stage = "ready";
          s.t0 = t;
          walking.current = false;
          h.rotation.y = Math.PI;
          setReady(true);
        }
      }
    } else if (s.stage === "ready") {
      if (t - s.t0 > 1.4) {
        s.stage = "jump";
        s.t0 = t;
      }
    } else if (s.stage === "jump") {
      // a small hop forward into the water
      const k = Math.min(1, (t - s.t0) / 0.7);
      const [fx, fz] = POOL_PATH[POOL_PATH.length - 1];
      const [jx, jz] = POOL_JUMP_TO;
      s.x = fx + (jx - fx) * k;
      s.z = fz + (jz - fz) * k;
      const y = 0.02 + (floatY(1.1) - 0.02) * k + Math.sin(k * Math.PI) * 0.9;
      h.position.set(s.x, y, s.z);
      if (k >= 1) {
        s.stage = "swim";
        s.t0 = t;
        setInWater(true);
      }
    } else {
      // swim laps in the free lane, starting from the near end
      const w = 0.5;
      const u = (t - s.t0) * w + Math.PI / 2;
      const z = POOL.z + Math.sin(u) * (POOL.hz - 0.9);
      const vz = Math.cos(u);
      h.position.set(POOL.x + HERO_LANE, floatY(1.1) + bob(t, 9), z);
      const want = vz >= 0 ? 0 : Math.PI;
      let d = want - h.rotation.y;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      h.rotation.y += d * Math.min(1, dt * 3);
    }
  });

  return (
    <group>
      {LANES.map((_, k) => (
        <Floater
          key={`s${k}`}
          i={k}
          swim="swim"
          setRef={(g) => {
            swimmers.current[k] = g;
          }}
        />
      ))}
      {PLAYERS.map((_, k) => (
        <Floater
          key={`p${k}`}
          i={k + 2}
          swim="splash"
          setRef={(g) => {
            players.current[k] = g;
          }}
        />
      ))}
      <mesh ref={ball} castShadow>
        <sphereGeometry args={[0.28, 20, 16]} />
        <meshStandardMaterial color="#ff4081" roughness={0.4} />
      </mesh>
      <group ref={hero} position={[POOL_PATH[0][0], 0.02, POOL_PATH[0][1]]}>
        <Hero walking={walking} scale={1.1} bag={!ready} swim={inWater ? "swim" : undefined} />
        {ready && <SwimRing colors={["#ff9800", "#ffffff"]} scale={1.1} />}
        {inWater && <Ripples scale={1.1} />}
      </group>
    </group>
  );
}

const SHIRTS = ["#c62828", "#2e7d32", "#6a1b9a", "#ef6c00", "#00838f", "#ad1457"]; // classmates' polo colours
const CANTEEN = { x: 13, z: 0.5 }; // canteen centre in world units
// table centres (local to the canteen) and seats; the last seat is reserved for the boy
const CANTEEN_TABLES = [
  { x: -1.5, z: -1.9 },
  { x: -1.5, z: -0.5 },
  { x: -1.5, z: 0.9 },
];
const CANTEEN_SEATS = [
  { x: -2.35, z: -1.9, th: Math.PI / 2, kid: true },
  { x: -0.65, z: -1.9, th: -Math.PI / 2, kid: true },
  { x: -2.35, z: -0.5, th: Math.PI / 2, kid: true },
  { x: -0.65, z: -0.5, th: -Math.PI / 2, kid: true },
  { x: -2.35, z: 0.9, th: Math.PI / 2, kid: false },
  { x: -0.65, z: 0.9, th: -Math.PI / 2, kid: true },
];
const HERO_SEAT = { x: CANTEEN.x + CANTEEN_SEATS[4].x, z: CANTEEN.z + CANTEEN_SEATS[4].z };

/**
 * The canteen. Closed: a solid building with a roof. Open (the boy is inside): the roof and
 * the camera-side wall are dropped so the room can be seen like a dollhouse.
 */
function Canteen({ open, eating }: { open: boolean; eating: boolean }) {
  const WALL = "#ffe0b2";
  return (
    <group position={[CANTEEN.x, 0, CANTEEN.z]}>
      <Box p={[0, 0.05, 0]} s={[6, 0.1, 6]} c="#f5e6c8" />
      <Box p={[2.97, 1.4, 0]} s={[0.08, 2.8, 6]} c={WALL} shadow />
      <Box p={[0, 1.4, -2.97]} s={[6, 2.8, 0.08]} c={WALL} shadow />
      {/* yard-facing wall (−x) with a door gap at local z ≈ 1.5 */}
      <Box p={[-2.97, 1.4, -1.1]} s={[0.08, 2.8, 3.8]} c={WALL} shadow />
      <Box p={[-2.97, 1.4, 2.6]} s={[0.08, 2.8, 0.8]} c={WALL} shadow />
      <Box p={[-2.97, 2.55, 1.5]} s={[0.08, 0.5, 1.4]} c={WALL} shadow />
      {!open && <Box p={[0, 1.4, 2.97]} s={[6, 2.8, 0.08]} c={WALL} shadow />}
      {!open && <Box p={[0, 2.95, 0]} s={[6.6, 0.3, 6.6]} c="#2e7d32" shadow />}
      {/* big windows + door facing the yard (−x) */}
      <Box p={[-3.02, 1.5, -1.4]} s={[0.06, 1.2, 2]} c="#9fd8ff" />
      <Box p={[-3.02, 1.0, 1.5]} s={[0.06, 2.0, 1.4]} c="#6d4c41" />
      {/* tables outside */}
      {[-1.5, 1.5].map((z) => (
        <group key={z} position={[-4.4, 0, z]}>
          <Box p={[0, 0.7, 0]} s={[1.2, 0.08, 0.8]} c="#ffb74d" />
          <Box p={[0, 0.35, 0]} s={[0.1, 0.7, 0.1]} c="#8d6e63" />
        </group>
      ))}
      {open && <CanteenInterior eating={eating} />}
    </group>
  );
}

/** Inside the canteen: serving counter with a cook, tables with diners, and the boy's tray once he sits. */
function CanteenInterior({ eating }: { eating: boolean }) {
  return (
    <group>
      {/* serving counter along the back, with the cook behind it */}
      <Box p={[1.2, 0.5, 0]} s={[0.8, 1.0, 5]} c="#8d6e63" />
      <Box p={[1.2, 1.03, 0]} s={[0.9, 0.06, 5]} c="#eeeeee" />
      {[-1.8, -0.6, 0.6].map((z) => (
        <mesh key={z} position={[1.2, 1.17, z]}>
          <cylinderGeometry args={[0.25, 0.25, 0.2, 14]} />
          <meshStandardMaterial color="#ef6c00" />
        </mesh>
      ))}
      <group position={[2.2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <Boy scale={1.4} bag={false} shirt="#ffffff" />
      </group>

      {CANTEEN_TABLES.map((t) => (
        <group key={`${t.x}${t.z}`}>
          <Box p={[t.x, 0.7, t.z]} s={[1.2, 0.06, 0.7]} c="#ffb74d" />
          {[-0.5, 0.5].map((dx) =>
            [-0.25, 0.25].map((dz) => (
              <Box key={`${dx}${dz}`} p={[t.x + dx, 0.35, t.z + dz]} s={[0.08, 0.7, 0.08]} c="#8d6e63" />
            )),
          )}
        </group>
      ))}

      {CANTEEN_SEATS.map((seat, i) => {
        const side = seat.th === Math.PI / 2 ? 1 : -1; // the table lies on this side of the seat
        return (
          <group key={i}>
            <Box p={[seat.x, 0.46, seat.z]} s={[0.4, 0.08, 0.7]} c="#c98f4e" />
            {seat.kid ? (
              <group position={[seat.x, 0.48, seat.z]} rotation={[0, seat.th, 0]}>
                <Boy sitting scale={0.95} bag={false} shirt={SHIRTS[(i + 2) % SHIRTS.length]} />
              </group>
            ) : null}
            {(seat.kid || eating) && (
              <mesh position={[seat.x + side * 0.35, 0.76, seat.z]}>
                <cylinderGeometry args={[0.16, 0.16, 0.03, 16]} />
                <meshStandardMaterial color="#ffffff" />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}

/** The canteen building plus, while the boy is inside, his visit. */
function CanteenBlock({ inside }: { inside: boolean }) {
  const [eating, setEating] = useState(false);
  useEffect(() => {
    if (!inside) setEating(false);
  }, [inside]);
  return (
    <>
      <Canteen open={inside} eating={eating} />
      {inside && <CanteenVisit onSeated={() => setEating(true)} />}
    </>
  );
}

// Waypoints in world units: outside the door, through the door, to the counter, round the
// tables and finally to the reserved seat (the last one).
const CANTEEN_PATH: [number, number][] = [
  [9.8, 3.3],
  [10.8, 2.3],
  [13.4, 2.3],
  [12.3, 3.1],
  [10.65, 3.1],
  [HERO_SEAT.x, HERO_SEAT.z],
];
const PATH_DOOR = 1;
const PATH_COUNTER = 2;
const PATH_SEAT = CANTEEN_PATH.length - 1;

/**
 * The boy walks in from the yard, takes his bag off at the door, goes straight to the cook,
 * picks up a tray, walks to a free seat and eats.
 */
function CanteenVisit({ onSeated }: { onSeated: () => void }) {
  const hero = useRef<Group>(null);
  const walking = useRef(true);
  const cur = useRef({ x: YARD[0], z: YARD[1] });
  const idx = useRef(0);
  const pauseUntil = useRef(0);
  const done = useRef(false);
  const [bag, setBag] = useState(true);
  const [carry, setCarry] = useState(false);
  const [sitting, setSitting] = useState(false);
  const seated = useRef(onSeated);
  useEffect(() => {
    seated.current = onSeated;
  }, [onSeated]);

  useFrame(({ clock }, dt) => {
    const h = hero.current;
    if (!h || done.current) return;
    const t = clock.elapsedTime;
    if (t < pauseUntil.current) {
      walking.current = false;
      return;
    }
    walking.current = true;
    const [tx, tz] = CANTEEN_PATH[idx.current];
    const p = cur.current;
    const dx = tx - p.x;
    const dz = tz - p.z;
    const len = Math.hypot(dx, dz);
    const step = Math.min(len, 2.2 * dt);
    if (len > 1e-4) {
      p.x += (dx / len) * step;
      p.z += (dz / len) * step;
      h.rotation.y = Math.atan2(dx, dz);
    }
    h.position.set(p.x, 0.02, p.z);
    if (len > 0.06) return;

    // arrived at the current waypoint
    const i = idx.current;
    if (i === PATH_DOOR) setBag(false); // no backpack inside
    if (i === PATH_COUNTER) {
      setCarry(true); // the cook hands over the tray
      pauseUntil.current = t + 1.2;
    }
    if (i === PATH_SEAT) {
      done.current = true;
      walking.current = false;
      setCarry(false);
      setSitting(true);
      h.position.set(HERO_SEAT.x, 0.48, HERO_SEAT.z);
      h.rotation.y = Math.PI / 2; // face the table
      seated.current();
      return;
    }
    idx.current = i + 1;
  });

  return (
    <group ref={hero} position={[YARD[0], 0.02, YARD[1]]}>
      <Hero walking={walking} scale={1.1} bag={bag} carrying={carry} sitting={sitting} />
      {carry && (
        <group position={[0, 1.1, 0.5]}>
          <mesh>
            <boxGeometry args={[0.7, 0.05, 0.5]} />
            <meshStandardMaterial color="#b0bec5" />
          </mesh>
          <mesh position={[-0.15, 0.05, 0]}>
            <sphereGeometry args={[0.1, 12, 8]} />
            <meshStandardMaterial color="#ff7043" />
          </mesh>
          <mesh position={[0.15, 0.05, 0.05]}>
            <sphereGeometry args={[0.1, 12, 8]} />
            <meshStandardMaterial color="#ffd54f" />
          </mesh>
        </group>
      )}
    </group>
  );
}

/** Front-right: admissions on the ground floor, talent subjects (music, art) upstairs. */
function Admissions() {
  return (
    <group position={[13, 0, 9.5]}>
      <Box p={[0, 1.4, 0]} s={[6, 2.8, 6]} c="#e3f2fd" shadow />
      <Box p={[0, 4.2, 0]} s={[6, 2.8, 6]} c="#f3e5f5" shadow />
      <Box p={[0, 5.75, 0]} s={[6.6, 0.3, 6.6]} c="#1565c0" shadow />
      <Box p={[-3.02, 1.0, 0]} s={[0.06, 2.0, 1.6]} c="#1976d2" />
      {[-1.6, 1.6].map((z) => (
        <Box key={z} p={[-3.02, 4.3, z]} s={[0.06, 1.1, 1.6]} c="#9fd8ff" />
      ))}
    </group>
  );
}

/** Vietnamese flag on a pole near the gate. */
function FlagPole() {
  const flag = useRef<Group>(null);
  const star = useMemo(() => {
    const s = new Shape();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 ? 0.09 : 0.22;
      const a = (i / 10) * Math.PI * 2 + Math.PI / 2;
      if (i === 0) s.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else s.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    return s;
  }, []);
  useFrame(({ clock }) => {
    if (flag.current) flag.current.rotation.y = Math.sin(clock.elapsedTime * 2) * 0.12;
  });
  return (
    <group position={[5.5, 0, 12]}>
      <Box p={[0, 0.15, 0]} s={[1.2, 0.3, 1.2]} c="#cfc6b3" />
      <mesh position={[0, 3.2, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 6.2, 8]} />
        <meshStandardMaterial color="#cfd8dc" metalness={0.4} />
      </mesh>
      <group ref={flag} position={[0, 5.7, 0]}>
        <mesh position={[0.7, 0, 0]}>
          <planeGeometry args={[1.4, 0.93]} />
          <meshStandardMaterial color="#da251d" side={2} />
        </mesh>
        {[0.01, -0.01].map((z) => (
          <mesh key={z} position={[0.7, 0, z]} rotation={[0, z < 0 ? Math.PI : 0, 0]}>
            <shapeGeometry args={[star]} />
            <meshBasicMaterial color="#ffff00" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Motion: walking boy + smooth camera
// ---------------------------------------------------------------------------

function SmoothCamera({
  phase,
  boy,
  onField = false,
  inCanteen = false,
  atPool = false,
}: {
  phase: SchoolPhase;
  boy: React.RefObject<Group | null>;
  onField?: boolean;
  inCanteen?: boolean;
  atPool?: boolean;
}) {
  const { camera, size } = useThree();
  const pos = useRef(new Vector3(...CAMS.gate.pos));
  const look = useRef(new Vector3(...CAMS.gate.target));
  const want = useRef({ pos: new Vector3(), target: new Vector3() });
  const first = useRef(true);

  useFrame((_, dt) => {
    const c = CAMS[phase];
    const w = want.current;
    w.pos.set(...c.pos);
    w.target.set(...c.target);
    const b = boy.current;
    if (atPool) {
      // the pool fills the frame, seen from the yard side (front), slightly from above
      // the target sits in front of the pool so the pool shows in the upper part, clear of the subject menu
      w.pos.set(POOL.x - 0.5, 11, POOL.z + 11.5);
      w.target.set(POOL.x, 0, POOL.z + 2.2);
    } else if (inCanteen) {
      // dollhouse view of the canteen from the front-right
      w.pos.set(CANTEEN.x - 0.5, 13, CANTEEN.z + 9);
      w.target.set(CANTEEN.x - 0.5, 0, CANTEEN.z + 0.3);
    } else if (onField) {
      // zoom in: the pitch fills the frame, seen from the yard side and slightly tilted
      w.pos.set(FIELD.cx, 19, FIELD.cz + 6);
      w.target.set(FIELD.cx, 0, FIELD.cz);
    } else if (phase === "walkIn" && b) {
      // Follow the boy from behind and above, easing into the yard view.
      w.pos.set(b.position.x, 9 + (17 - b.position.z) * 0.9, b.position.z + 13);
      w.target.set(b.position.x, 1.2, b.position.z - 6);
    }
    // Keep everything in frame on narrow (portrait) screens.
    const aspect = size.width / Math.max(1, size.height);
    const k = aspect < 1.3 ? 1.3 / aspect : 1;
    w.pos.sub(w.target).multiplyScalar(k).add(w.target);
    if (first.current) {
      pos.current.copy(w.pos);
      look.current.copy(w.target);
      first.current = false;
    }
    const a = 1 - Math.exp(-dt * (phase === "walkIn" ? 3 : 1.6));
    pos.current.lerp(w.pos, a);
    look.current.lerp(w.target, a);
    camera.position.copy(pos.current);
    camera.lookAt(look.current);
  });
  return null;
}

function WalkingBoy({
  phase,
  skip,
  onArrived,
  groupRef,
}: {
  phase: SchoolPhase;
  skip: number;
  onArrived: () => void;
  groupRef: React.RefObject<Group | null>;
}) {
  const walking = useRef(false);
  const state = useRef({ path: [] as [number, number][], i: 0, done: true });
  const arrived = useRef(onArrived);
  useEffect(() => {
    arrived.current = onArrived;
  }, [onArrived]);

  // Place the boy / start a walk whenever the phase changes.
  useEffect(() => {
    const g = groupRef.current;
    if (!g) return;
    if (phase === "walkIn" || phase === "walkToClass") {
      const path = PATHS[phase];
      state.current = { path, i: 0, done: false };
      g.position.set(path[0][0], 0, path[0][1]);
    } else {
      state.current.done = true;
      walking.current = false;
      const [x, z] = phase === "gate" ? GATE_OUT : YARD;
      g.position.set(x, 0, z);
      g.rotation.y = 0; // face the camera
    }
  }, [phase, groupRef]);

  // Tap to skip: jump to the end of the walk.
  useEffect(() => {
    const st = state.current;
    const g = groupRef.current;
    if (!skip || st.done || !g) return;
    const end = st.path[st.path.length - 1];
    g.position.set(end[0], 0, end[1]);
    st.done = true;
    walking.current = false;
    arrived.current();
  }, [skip, groupRef]);

  useFrame((_, dt) => {
    const st = state.current;
    const g = groupRef.current;
    if (!g || st.done) return;
    const target = st.path[st.i + 1];
    const dx = target[0] - g.position.x;
    const dz = target[1] - g.position.z;
    const dist = Math.hypot(dx, dz);
    const step = Math.min(dist, 3.2 * Math.min(dt, 0.05));
    walking.current = true;
    if (dist > 0.001) {
      g.position.x += (dx / dist) * step;
      g.position.z += (dz / dist) * step;
      const face = Math.atan2(dx, dz);
      let d = face - g.rotation.y;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      g.rotation.y += d * Math.min(1, dt * 10);
    }
    if (dist - step < 0.01) {
      st.i++;
      if (st.i >= st.path.length - 1) {
        st.done = true;
        walking.current = false;
        arrived.current();
      }
    }
  });

  return (
    <group ref={groupRef}>
      <Hero walking={walking} waving={phase === "gate" || phase === "yard"} scale={1.1} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

export type Place = { key: string; text: string; pos: [number, number, number]; say: string };

export const PLACES: Place[] = [
  { key: "class", text: "🏫 Dãy phòng học", pos: [-13, FLOORS * FLOOR_H + 1, 0], say: "Đây là dãy phòng học. Lớp của con ở phòng đầu tiên, tầng trệt." },
  { key: "field", text: "⚽ Sân thể thao", pos: [0, 0.6, -3.5], say: "Sân thể thao. Giờ ra chơi mình đá bóng ở đây!" },
  { key: "pool", text: "🏊 Hồ bơi", pos: [12.8, 1, -10], say: "Hồ bơi. Các bạn đeo phao bơi rồi mới xuống nước. Mình cùng bơi nhé!" },
  { key: "canteen", text: "🍱 Nhà ăn", pos: [11.5, 3.6, 0.5], say: "Nhà ăn. Giờ ăn trưa mình vào đây lấy cơm nhé!" },
  { key: "talent", text: "🎨 Năng khiếu", pos: [10.6, 5.2, 8.5], say: "Phòng năng khiếu: vẽ, hát, múa. Sắp có nhé!" },
  { key: "admissions", text: "📋 Tuyển sinh", pos: [10.6, 2.4, 8.5], say: "Nhà tuyển sinh." },
];

const SIGN_POS: [number, number, number] = [0, 4.75, 15.2];

export function SchoolScene({
  phase,
  skip,
  onArrived,
  onPlace,
}: {
  phase: SchoolPhase;
  skip: number;
  onArrived: () => void;
  onPlace: (p: Place) => void;
}) {
  const boy = useRef<Group>(null);
  const labelEls = useRef<(HTMLElement | null)[]>([]);
  const showPlaces = phase === "yard";
  const [activity, setActivity] = useState<null | "field" | "canteen" | "pool">(null);
  const onField = activity === "field" && phase === "yard";
  const inCanteen = activity === "canteen" && phase === "yard";
  const atPool = activity === "pool" && phase === "yard";
  const away = onField || inCanteen || atPool;

  return (
    <div className="relative h-full w-full">
      {away && (
        <button className="btn btn-white absolute left-4 top-4 z-10 !min-h-14 !text-xl" onClick={() => setActivity(null)}>
          🏫 Về sân trường
        </button>
      )}
      <Stage camera={CAMS.gate.pos} target={CAMS.gate.target} minAspect={1.3}>
        <Ground />
        <Fence />
        <Gate />
        <ClassBlock />
        <Field />
        <Pool />
        <CanteenBlock inside={inCanteen} />
        <Admissions />
        <FlagPole />
        {[
          [-17.5, -14],
          [-17.5, 13.5],
          [17.5, -14.5],
          [17.5, 4.8],
          [7.5, -14.5],
          [-7.5, -14.5],
          [8, 13.5],
          [-8.5, 18.5],
          [9, 18.5],
        ].map(([x, z], i) => (
          <Tree key={i} x={x} z={z} s={i > 6 ? 1.2 : 1} />
        ))}
        {!away && <WalkingBoy phase={phase} skip={skip} onArrived={onArrived} groupRef={boy} />}
        {onField && <FootballGame />}
        {atPool && <PoolVisit />}
        <SmoothCamera phase={phase} boy={boy} onField={onField} inCanteen={inCanteen} atPool={atPool} />
        <Projector
          count={PLACES.length + 2}
          els={labelEls}
          getWorld={(i, out) => {
            if (i === PLACES.length + 1) {
              const b = boy.current;
              if (!b || (phase !== "gate" && phase !== "yard")) return false;
              out.set(b.position.x, 2.75, b.position.z);
              return true;
            }
            if (i === PLACES.length) {
              out.set(...SIGN_POS);
              return phase === "gate" || phase === "walkIn";
            }
            if (!showPlaces || away) return false;
            out.set(...PLACES[i].pos);
            return true;
          }}
        />
      </Stage>
      <Overlay>
        {PLACES.map((p, i) => (
          <div
            key={p.key}
            ref={(el) => {
              labelEls.current[i] = el;
            }}
            className="pointer-events-auto absolute left-0 top-0"
            style={{ visibility: "hidden" }}
          >
            <button
              onClick={() => {
                if (p.key === "field") setActivity("field");
                if (p.key === "canteen") setActivity("canteen");
                if (p.key === "pool") setActivity("pool");
                onPlace(p);
              }}
              className="whitespace-nowrap rounded-full bg-white/95 px-3 py-1 text-base font-extrabold shadow-md active:scale-95">
              {p.text}
            </button>
          </div>
        ))}
        <div
          ref={(el) => {
            labelEls.current[PLACES.length] = el;
          }}
          className="absolute left-0 top-0"
          style={{ visibility: "hidden" }}
        >
          <div className="whitespace-nowrap text-center font-extrabold leading-tight text-white drop-shadow" style={{ fontSize: phase === "gate" ? 26 : 13 }}>
            TRƯỜNG INSPIRE – KHAI NGUYÊN
          </div>
        </div>
        <div
          ref={(el) => {
            labelEls.current[PLACES.length + 1] = el;
          }}
          className="absolute left-0 top-0"
          style={{ visibility: "hidden" }}
        >
          <div className="whitespace-nowrap rounded-full bg-orange-400 px-3 py-0.5 text-lg font-extrabold text-white shadow-md">⭐ <KidName /></div>
        </div>
      </Overlay>
    </div>
  );
}
