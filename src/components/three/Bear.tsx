"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

const BROWN = "#b07440";
const LIGHT = "#f0cfa0";
const DARK = "#2b1a10";

type Props = {
  position?: [number, number, number];
  rotationY?: number;
  scale?: number;
  happy?: boolean; // jump + wave
};

/** Friendly low-poly bear mascot built from primitives. */
export function Bear({ position = [0, 0, 0], rotationY = 0, scale = 1, happy = false }: Props) {
  const body = useRef<Group>(null);
  const arm = useRef<Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (body.current) {
      body.current.position.y = happy ? Math.abs(Math.sin(t * 6)) * 0.35 : Math.abs(Math.sin(t * 2)) * 0.05;
    }
    if (arm.current) {
      arm.current.rotation.z = happy ? 2.4 + Math.sin(t * 12) * 0.4 : 0.4 + Math.sin(t * 2.2) * 0.25;
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      <group ref={body}>
        {/* body */}
        <mesh position={[0, 0.7, 0]} scale={[1, 1.1, 0.9]} castShadow>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshStandardMaterial color={BROWN} roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.65, 0.38]} scale={[1, 1.1, 0.6]}>
          <sphereGeometry args={[0.38, 32, 32]} />
          <meshStandardMaterial color={LIGHT} roughness={0.9} />
        </mesh>
        {/* legs */}
        {[-0.3, 0.3].map((x) => (
          <mesh key={x} position={[x, 0.18, 0.18]} castShadow>
            <sphereGeometry args={[0.22, 24, 24]} />
            <meshStandardMaterial color={BROWN} roughness={0.8} />
          </mesh>
        ))}
        {/* left arm (resting) */}
        <mesh position={[-0.58, 0.85, 0.1]} rotation={[0, 0, -0.5]} castShadow>
          <capsuleGeometry args={[0.14, 0.35, 8, 16]} />
          <meshStandardMaterial color={BROWN} roughness={0.8} />
        </mesh>
        {/* right arm (waves) */}
        <group ref={arm} position={[0.5, 1.05, 0.05]}>
          <mesh position={[0, -0.28, 0]} castShadow>
            <capsuleGeometry args={[0.14, 0.35, 8, 16]} />
            <meshStandardMaterial color={BROWN} roughness={0.8} />
          </mesh>
        </group>
        {/* head */}
        <group position={[0, 1.6, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.52, 32, 32]} />
            <meshStandardMaterial color={BROWN} roughness={0.8} />
          </mesh>
          {[-0.38, 0.38].map((x) => (
            <group key={x} position={[x, 0.4, -0.02]}>
              <mesh>
                <sphereGeometry args={[0.19, 24, 24]} />
                <meshStandardMaterial color={BROWN} roughness={0.8} />
              </mesh>
              <mesh position={[0, 0, 0.1]} scale={[1, 1, 0.5]}>
                <sphereGeometry args={[0.11, 16, 16]} />
                <meshStandardMaterial color={LIGHT} />
              </mesh>
            </group>
          ))}
          <mesh position={[0, -0.12, 0.42]} scale={[1.15, 0.9, 0.8]}>
            <sphereGeometry args={[0.2, 24, 24]} />
            <meshStandardMaterial color={LIGHT} roughness={0.9} />
          </mesh>
          <mesh position={[0, -0.04, 0.6]} scale={[1.3, 1, 1]}>
            <sphereGeometry args={[0.065, 16, 16]} />
            <meshStandardMaterial color={DARK} roughness={0.3} />
          </mesh>
          {[-0.18, 0.18].map((x) => (
            <mesh key={x} position={[x, 0.1, 0.45]}>
              <sphereGeometry args={[0.065, 16, 16]} />
              <meshStandardMaterial color={DARK} roughness={0.2} />
            </mesh>
          ))}
          {[-0.32, 0.32].map((x) => (
            <mesh key={x} position={[x, -0.1, 0.38]} scale={[1, 0.6, 0.4]}>
              <sphereGeometry args={[0.09, 16, 16]} />
              <meshStandardMaterial color="#ff9eb0" />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}
