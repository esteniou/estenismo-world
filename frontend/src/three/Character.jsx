import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Voxel-inspired humanoid character. Uses only BoxGeometry primitives.
// Receives an `input` ref (x/y in [-1,1]) and updates world position + rotation.
// Exposes position via `bodyRef.current.position` for camera + proximity.
export default function Character({ input, bodyRef, speed = 7.5 }) {
  const headRef = useRef();
  const armLRef = useRef();
  const armRRef = useRef();
  const legLRef = useRef();
  const legRRef = useRef();
  const meshRef = useRef();
  const targetYaw = useRef(0);
  const isMoving = useRef(false);

  useFrame((state, dt) => {
    if (!bodyRef.current) return;
    const { x, y } = input.current;
    const mag = Math.hypot(x, y);
    isMoving.current = mag > 0.05;

    if (isMoving.current) {
      const dir = new THREE.Vector3(x, 0, y).normalize();
      // Move on world axes (camera space equivalent: forward = -Z).
      bodyRef.current.position.x += dir.x * speed * dt;
      bodyRef.current.position.z += dir.z * speed * dt;

      // Clamp to a soft playfield
      const R = 22;
      bodyRef.current.position.x = THREE.MathUtils.clamp(bodyRef.current.position.x, -R, R);
      bodyRef.current.position.z = THREE.MathUtils.clamp(bodyRef.current.position.z, -R, R);

      targetYaw.current = Math.atan2(dir.x, dir.z);
    }

    // Smooth yaw rotation
    if (meshRef.current) {
      const cur = meshRef.current.rotation.y;
      let diff = targetYaw.current - cur;
      // wrap
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      meshRef.current.rotation.y = cur + diff * Math.min(1, dt * 12);
    }

    // Idle bob + walk swing
    const t = state.clock.elapsedTime;
    const walkAmp = isMoving.current ? 1 : 0;
    const bob = isMoving.current ? Math.abs(Math.sin(t * 12)) * 0.12 : Math.sin(t * 2.5) * 0.06;
    if (meshRef.current) {
      meshRef.current.position.y = bob;
    }
    if (armLRef.current && armRRef.current) {
      const swing = Math.sin(t * 12) * 0.9 * walkAmp;
      armLRef.current.rotation.x = swing;
      armRRef.current.rotation.x = -swing;
    }
    if (legLRef.current && legRRef.current) {
      const swing = Math.sin(t * 12) * 0.8 * walkAmp;
      legLRef.current.rotation.x = -swing;
      legRRef.current.rotation.x = swing;
    }
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.8) * 0.15 * (isMoving.current ? 0 : 1);
    }
  });

  return (
    <group ref={bodyRef} position={[0, 0, 6]}>
      {/* soft shadow disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.9, 24]} />
        <meshBasicMaterial color="#041B1D" transparent opacity={0.4} />
      </mesh>

      <group ref={meshRef}>
        {/* Legs */}
        <mesh ref={legLRef} position={[-0.28, 0.55, 0]} castShadow>
          <boxGeometry args={[0.42, 1.1, 0.42]} />
          <meshStandardMaterial color="#0B4C5C" roughness={0.8} />
        </mesh>
        <mesh ref={legRRef} position={[0.28, 0.55, 0]} castShadow>
          <boxGeometry args={[0.42, 1.1, 0.42]} />
          <meshStandardMaterial color="#0B4C5C" roughness={0.8} />
        </mesh>

        {/* Torso — hoodie */}
        <mesh position={[0, 1.55, 0]} castShadow>
          <boxGeometry args={[1.1, 1.15, 0.65]} />
          <meshStandardMaterial color="#20B9AE" roughness={0.55} metalness={0.15} />
        </mesh>
        {/* Torso stripe accent */}
        <mesh position={[0, 1.15, 0.34]} castShadow>
          <boxGeometry args={[1.12, 0.16, 0.02]} />
          <meshStandardMaterial color="#F4F5ED" emissive="#F4F5ED" emissiveIntensity={0.15} />
        </mesh>

        {/* Arms */}
        <mesh ref={armLRef} position={[-0.72, 1.55, 0]} castShadow>
          <boxGeometry args={[0.34, 1.05, 0.34]} />
          <meshStandardMaterial color="#0B8584" roughness={0.6} />
        </mesh>
        <mesh ref={armRRef} position={[0.72, 1.55, 0]} castShadow>
          <boxGeometry args={[0.34, 1.05, 0.34]} />
          <meshStandardMaterial color="#0B8584" roughness={0.6} />
        </mesh>

        {/* Head */}
        <group ref={headRef} position={[0, 2.55, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.85, 0.85, 0.85]} />
            <meshStandardMaterial color="#E9C9A6" roughness={0.6} />
          </mesh>
          {/* Hair cap */}
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[0.9, 0.22, 0.9]} />
            <meshStandardMaterial color="#063F43" roughness={0.5} />
          </mesh>
          {/* Eyes */}
          <mesh position={[-0.18, 0.04, 0.44]}>
            <boxGeometry args={[0.09, 0.09, 0.02]} />
            <meshBasicMaterial color="#041B1D" />
          </mesh>
          <mesh position={[0.18, 0.04, 0.44]}>
            <boxGeometry args={[0.09, 0.09, 0.02]} />
            <meshBasicMaterial color="#041B1D" />
          </mesh>
          {/* Cheek accent */}
          <mesh position={[0, -0.18, 0.44]}>
            <boxGeometry args={[0.28, 0.06, 0.02]} />
            <meshBasicMaterial color="#8CE4D5" />
          </mesh>
        </group>
      </group>
    </group>
  );
}
