import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Smooth third-person camera that follows the character.
export default function CameraRig({ target }) {
  const { camera } = useThree();
  const desired = useRef(new THREE.Vector3());
  const look = useRef(new THREE.Vector3());
  const offset = new THREE.Vector3(0, 11, 15);

  useFrame((_state, dt) => {
    if (!target.current) return;
    const p = target.current.position;
    desired.current.set(p.x + offset.x, p.y + offset.y, p.z + offset.z);
    const k = Math.min(1, dt * 3.2);
    camera.position.lerp(desired.current, k);
    look.current.lerp(new THREE.Vector3(p.x, p.y + 1.4, p.z), Math.min(1, dt * 4));
    camera.lookAt(look.current);
  });

  return null;
}
