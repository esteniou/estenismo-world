import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Floor, particles and ambient floating shapes for the EST 3D playground.
export default function Environment() {
  return (
    <>
      <Floor />
      <Particles count={140} />
      <FloatingShapes />
    </>
  );
}

function Floor() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#075B60" roughness={0.9} metalness={0.05} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[6, 24, 64]} />
        <meshBasicMaterial color="#0B8584" transparent opacity={0.25} />
      </mesh>
      <gridHelper args={[80, 40, "#0B8584", "#0B4C5C"]} position={[0, 0.02, 0]} />
    </group>
  );
}

function Particles({ count = 120 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 60;
      arr[i * 3 + 1] = Math.random() * 12 + 1;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.02;
    const arr = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(t + i) * 0.002;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#8CE4D5"
        size={0.14}
        sizeAttenuation
        transparent
        opacity={0.75}
        depthWrite={false}
      />
    </points>
  );
}

function FloatingShapes() {
  const shapes = useMemo(
    () => [
      { pos: [-20, 6, -18], size: 1.2, color: "#20B9AE", geo: "box" },
      { pos: [22, 8, -14], size: 1.4, color: "#8CE4D5", geo: "sphere" },
      { pos: [-24, 5, 12], size: 1, color: "#F4F5ED", geo: "tetra" },
      { pos: [24, 7, 18], size: 1.2, color: "#20B9AE", geo: "box" },
      { pos: [0, 10, -24], size: 1.8, color: "#8CE4D5", geo: "tetra" },
    ],
    []
  );
  return (
    <group>
      {shapes.map((s, i) => (
        <FloatingShape key={i} {...s} idx={i} />
      ))}
    </group>
  );
}

function FloatingShape({ pos, size, color, geo, idx }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = pos[1] + Math.sin(t * 0.6 + idx) * 0.6;
    ref.current.rotation.x = t * 0.15;
    ref.current.rotation.y = t * 0.2;
  });
  return (
    <mesh ref={ref} position={pos}>
      {geo === "box" && <boxGeometry args={[size, size, size]} />}
      {geo === "sphere" && <sphereGeometry args={[size * 0.7, 20, 20]} />}
      {geo === "tetra" && <tetrahedronGeometry args={[size]} />}
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.25} />
    </mesh>
  );
}

