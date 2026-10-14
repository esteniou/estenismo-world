import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Smooth third-person camera that follows the character.
export default function CameraRig({ target }) {
  const { camera, gl, size } = useThree();
  const zoom = useRef(0);
  useEffect(() => {
    const aspect = size.width / size.height;
    const farFraming = size.width < 768 ? Math.max(1, 2 / aspect) : 1;
    let framing = farFraming - zoom.current * (farFraming - 1);
    const applyZoom = (nextFraming) => {
      framing = THREE.MathUtils.clamp(nextFraming, 1, farFraming);
      if (farFraming > 1) zoom.current = (farFraming - framing) / (farFraming - 1);
      camera.fov = THREE.MathUtils.radToDeg(
        2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(45 / 2)) * framing)
      );
      camera.updateProjectionMatrix();
    };
    applyZoom(framing);
    if (farFraming === 1) return;

    const canvas = gl.domElement;
    let pinch = null;
    const distance = (touches) => Math.hypot(
      touches[0].clientX - touches[1].clientX,
      touches[0].clientY - touches[1].clientY
    );
    const start = (event) => {
      pinch = null;
      if (event.touches.length !== 2 || event.targetTouches.length !== 2) return;
      const span = distance(event.targetTouches);
      if (span === 0) return;
      pinch = { distance: span, framing };
      if (event.cancelable) event.preventDefault();
    };
    const move = (event) => {
      if (!pinch) return;
      if (event.touches.length !== 2 || event.targetTouches.length !== 2) {
        pinch = null;
        return;
      }
      const span = distance(event.targetTouches);
      if (span === 0) return;
      if (event.cancelable) event.preventDefault();
      applyZoom(pinch.framing * pinch.distance / span);
    };
    const end = () => { pinch = null; };
    canvas.addEventListener("touchstart", start, { passive: false });
    canvas.addEventListener("touchmove", move, { passive: false });
    canvas.addEventListener("touchend", end);
    canvas.addEventListener("touchcancel", end);
    return () => {
      canvas.removeEventListener("touchstart", start);
      canvas.removeEventListener("touchmove", move);
      canvas.removeEventListener("touchend", end);
      canvas.removeEventListener("touchcancel", end);
    };
  }, [camera, gl, size.width, size.height]);
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
