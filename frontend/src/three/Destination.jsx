import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";

// A themed 3D landmark for each portfolio destination.
// The `active` boolean shows a floating proximity label.
export default function Destination({ dest, active, onOpen, characterRef }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(t * 1.2 + dest.position[0]) * 0.12;
    // subtle rotation only for some
    if (["contact", "games"].includes(dest.id)) {
      groupRef.current.rotation.y = t * 0.35;
    }
  });

  return (
    <group position={dest.position}>
      <group ref={groupRef}>
        <Landmark id={dest.id} accent={dest.accent} />
      </group>

      {/* Base pedestal */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[1.9, 2.1, 0.1, 24]} />
        <meshStandardMaterial color="#0B4C5C" roughness={0.85} />
      </mesh>

      {/* Category label always visible in world */}
      <Html position={[0, 5.2, 0]} center distanceFactor={11} zIndexRange={[9, 0]}>
        <div
          className="est-mono-track"
          style={{
            color: "#F4F5ED",
            fontWeight: 900,
            fontSize: "14px",
            letterSpacing: "0.28em",
            whiteSpace: "nowrap",
            textShadow: "0 2px 12px rgba(4,27,29,0.9)",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {dest.name.toUpperCase()}
        </div>
      </Html>

      {/* Proximity CTA */}
      {active && (
        <Html position={[0, 3.8, 0]} center distanceFactor={9} zIndexRange={[10, 0]}>
          <button
            data-testid={`open-${dest.id}-btn`}
            onClick={(e) => {
              e.stopPropagation();
              onOpen(dest.id);
            }}
            className="est-mono-track"
            style={{
              background: "rgba(6, 63, 67, 0.92)",
              color: dest.accent,
              border: `1px solid ${dest.accent}`,
              padding: "10px 18px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: 800,
              cursor: "pointer",
              whiteSpace: "nowrap",
              boxShadow: `0 0 22px ${dest.accent}55`,
              backdropFilter: "blur(6px)",
            }}
          >
            {dest.label} →
          </button>
        </Html>
      )}
    </group>
  );
}

function Landmark({ id, accent }) {
  switch (id) {
    case "illustration":
      return (
        <group position={[0, 1.4, 0]}>
          {/* Easel legs */}
          <mesh position={[-0.6, -0.4, 0.3]} rotation={[0, 0, 0.1]}>
            <boxGeometry args={[0.12, 3.2, 0.12]} />
            <meshStandardMaterial color="#8CE4D5" />
          </mesh>
          <mesh position={[0.6, -0.4, 0.3]} rotation={[0, 0, -0.1]}>
            <boxGeometry args={[0.12, 3.2, 0.12]} />
            <meshStandardMaterial color="#8CE4D5" />
          </mesh>
          {/* Canvas frame */}
          <mesh position={[0, 0.6, 0]} castShadow>
            <boxGeometry args={[2.6, 2.6, 0.16]} />
            <meshStandardMaterial color="#F4F5ED" />
          </mesh>
          {/* Painted shapes */}
          <mesh position={[-0.5, 0.9, 0.09]}>
            <circleGeometry args={[0.5, 24]} />
            <meshStandardMaterial color="#20B9AE" emissive="#20B9AE" emissiveIntensity={0.4} />
          </mesh>
          <mesh position={[0.5, 0.3, 0.09]}>
            <boxGeometry args={[0.9, 0.9, 0.02]} />
            <meshStandardMaterial color="#063F43" />
          </mesh>
          <mesh position={[0.6, 1.15, 0.09]}>
            <boxGeometry args={[0.7, 0.16, 0.02]} />
            <meshStandardMaterial color={accent} />
          </mesh>
        </group>
      );
    case "murals":
      return (
        <group position={[0, 1.4, 0]}>
          {/* Big wall */}
          <mesh position={[0, 1, 0]} castShadow>
            <boxGeometry args={[5.5, 3.4, 0.3]} />
            <meshStandardMaterial color="#F4F5ED" roughness={0.9} />
          </mesh>
          {/* Painted blocks */}
          <mesh position={[-1.6, 1.5, 0.18]}>
            <boxGeometry args={[1.1, 1.6, 0.02]} />
            <meshStandardMaterial color="#20B9AE" emissive="#20B9AE" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[-0.2, 0.8, 0.18]}>
            <circleGeometry args={[0.7, 24]} />
            <meshStandardMaterial color="#0B8584" />
          </mesh>
          <mesh position={[1.4, 1.4, 0.18]}>
            <boxGeometry args={[1.3, 1.1, 0.02]} />
            <meshStandardMaterial color="#063F43" />
          </mesh>
          <mesh position={[1.4, 0.4, 0.18]}>
            <boxGeometry args={[0.4, 0.4, 0.02]} />
            <meshStandardMaterial color={accent} />
          </mesh>
        </group>
      );
    case "packaging":
      return (
        <group position={[0, 0.9, 0]}>
          {/* Stack of boxes */}
          <mesh position={[-0.5, 0.6, 0]} castShadow>
            <boxGeometry args={[1.4, 1.2, 1.4]} />
            <meshStandardMaterial color="#8CE4D5" roughness={0.6} />
          </mesh>
          <mesh position={[0.7, 0.4, 0.2]} castShadow>
            <boxGeometry args={[1.1, 0.8, 1.1]} />
            <meshStandardMaterial color="#F4F5ED" roughness={0.6} />
          </mesh>
          <mesh position={[-0.4, 1.75, 0.1]} castShadow>
            <boxGeometry args={[0.9, 0.9, 0.9]} />
            <meshStandardMaterial color="#20B9AE" roughness={0.5} />
          </mesh>
          {/* Tape lines */}
          <mesh position={[-0.5, 1.22, 0]}>
            <boxGeometry args={[1.42, 0.06, 1.42]} />
            <meshStandardMaterial color="#063F43" />
          </mesh>
        </group>
      );
    case "printing":
      return (
        <group position={[0, 0.9, 0]}>
          {/* Printing press body */}
          <mesh position={[0, 0.7, 0]} castShadow>
            <boxGeometry args={[2.4, 1.4, 1.6]} />
            <meshStandardMaterial color="#0B4C5C" roughness={0.6} metalness={0.2} />
          </mesh>
          {/* Rollers */}
          <mesh position={[0, 1.7, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 2.6, 20]} />
            <meshStandardMaterial color="#F4F5ED" metalness={0.4} roughness={0.3} />
          </mesh>
          {/* Paper stack */}
          <mesh position={[1.6, 0.35, 0]} castShadow>
            <boxGeometry args={[0.9, 0.7, 1.1]} />
            <meshStandardMaterial color={accent} />
          </mesh>
          <mesh position={[-1.6, 0.25, 0]} castShadow>
            <boxGeometry args={[0.7, 0.5, 0.9]} />
            <meshStandardMaterial color="#F4F5ED" />
          </mesh>
        </group>
      );
    case "fashion":
      return (
        <group position={[0, 0.9, 0]}>
          {/* Podium */}
          <mesh position={[0, 0.15, 0]} castShadow>
            <cylinderGeometry args={[1.2, 1.2, 0.3, 24]} />
            <meshStandardMaterial color="#063F43" />
          </mesh>
          {/* Torso body */}
          <mesh position={[0, 1.4, 0]} castShadow>
            <boxGeometry args={[0.9, 1.3, 0.5]} />
            <meshStandardMaterial color="#20B9AE" />
          </mesh>
          {/* Head */}
          <mesh position={[0, 2.3, 0]} castShadow>
            <sphereGeometry args={[0.32, 20, 20]} />
            <meshStandardMaterial color="#F4F5ED" />
          </mesh>
          {/* Arms */}
          <mesh position={[-0.65, 1.4, 0]} castShadow>
            <boxGeometry args={[0.24, 1.1, 0.24]} />
            <meshStandardMaterial color={accent} />
          </mesh>
          <mesh position={[0.65, 1.4, 0]} castShadow>
            <boxGeometry args={[0.24, 1.1, 0.24]} />
            <meshStandardMaterial color={accent} />
          </mesh>
          {/* Racks */}
          <mesh position={[-1.7, 1.1, 0]} castShadow>
            <boxGeometry args={[0.4, 1.4, 0.4]} />
            <meshStandardMaterial color="#8CE4D5" />
          </mesh>
        </group>
      );
    case "games":
      return (
        <group position={[0, 1.2, 0]}>
          {/* Arcade cabinet */}
          <mesh position={[0, 1.1, 0]} castShadow>
            <boxGeometry args={[1.6, 2.6, 1]} />
            <meshStandardMaterial color="#063F43" roughness={0.5} />
          </mesh>
          {/* Screen */}
          <mesh position={[0, 1.65, 0.51]}>
            <boxGeometry args={[1.2, 0.9, 0.04]} />
            <meshStandardMaterial color="#20B9AE" emissive="#20B9AE" emissiveIntensity={1.2} />
          </mesh>
          {/* Marquee */}
          <mesh position={[0, 2.55, 0.51]}>
            <boxGeometry args={[1.4, 0.32, 0.04]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.6} />
          </mesh>
          {/* Buttons */}
          <mesh position={[-0.25, 0.95, 0.53]}>
            <cylinderGeometry args={[0.09, 0.09, 0.05, 16]} />
            <meshStandardMaterial color="#F4F5ED" />
          </mesh>
          <mesh position={[0.25, 0.95, 0.53]}>
            <cylinderGeometry args={[0.09, 0.09, 0.05, 16]} />
            <meshStandardMaterial color="#8CE4D5" />
          </mesh>
        </group>
      );
    case "contact":
      return (
        <group position={[0, 1.4, 0]}>
          {/* Portal ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[1.6, 0.22, 20, 48]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.4} />
          </mesh>
          {/* Inner glow disc */}
          <mesh>
            <circleGeometry args={[1.4, 40]} />
            <meshBasicMaterial color="#20B9AE" transparent opacity={0.5} />
          </mesh>
          {/* Base plinth */}
          <mesh position={[0, -1.5, 0]}>
            <cylinderGeometry args={[0.8, 1.2, 0.6, 24]} />
            <meshStandardMaterial color="#075B60" />
          </mesh>
        </group>
      );
    default:
      return null;
  }
}
