import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import Character from "./Character";
import Destination from "./Destination";
import Environment from "./Environment";
import CameraRig from "./CameraRig";
import { DESTINATIONS } from "../data/portfolio";

// The main R3F canvas + scene composition.
export default function Scene({ input, onOpen, characterPosRef }) {
  const bodyRef = useRef();
  const [nearId, setNearId] = useState(null);

  // Proximity detection loop (outside R3F frame; polls the body ref)
  useEffect(() => {
    let raf;
    const tick = () => {
      if (bodyRef.current) {
        const p = bodyRef.current.position;
        characterPosRef.current = { x: p.x, y: p.y, z: p.z };
        let closest = null;
        let closestDist = Infinity;
        for (const d of DESTINATIONS) {
          const dx = p.x - d.position[0];
          const dz = p.z - d.position[2];
          const dist = Math.hypot(dx, dz);
          if (dist < 4.2 && dist < closestDist) {
            closest = d.id;
            closestDist = dist;
          }
        }
        setNearId(closest);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [characterPosRef]);

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [0, 12, 18], fov: 45 }}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(new THREE.Color("#063F43"));
        scene.fog = new THREE.Fog("#063F43", 14, 55);
      }}
      data-testid="est-3d-canvas"
    >
      <Suspense fallback={null}>
        {/* Lights */}
        <ambientLight intensity={0.55} color="#8CE4D5" />
        <directionalLight
          position={[18, 24, 12]}
          intensity={1.35}
          color="#F4F5ED"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={60}
          shadow-camera-left={-30}
          shadow-camera-right={30}
          shadow-camera-top={30}
          shadow-camera-bottom={-30}
        />
        <pointLight position={[0, 5, 0]} intensity={1.4} color="#20B9AE" distance={20} />
        <pointLight position={[-14, 4, -8]} intensity={1.2} color="#8CE4D5" distance={16} />
        <pointLight position={[7, 4, 15]} intensity={1.6} color="#20B9AE" distance={16} />

        <Environment />

        {DESTINATIONS.map((d) => (
          <Destination
            key={d.id}
            dest={d}
            active={nearId === d.id}
            onOpen={onOpen}
            characterRef={bodyRef}
          />
        ))}

        <Character input={input} bodyRef={bodyRef} />
        <CameraRig target={bodyRef} />
      </Suspense>
    </Canvas>
  );
}
