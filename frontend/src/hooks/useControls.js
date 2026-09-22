import { useEffect, useRef } from "react";

// Keyboard + mobile joystick input hook.
// Returns a ref { current: { x, y, action } } where x/y are in range [-1, 1]
// and action is a boolean while E / space / mobile action button is held.
export function useControls() {
  const input = useRef({ x: 0, y: 0, action: false, actionPulse: 0 });
  const keys = useRef({});

  useEffect(() => {
    const down = (e) => {
      keys.current[e.code] = true;
      if (e.code === "Space" || e.code === "KeyE" || e.code === "Enter") {
        input.current.action = true;
        input.current.actionPulse = performance.now();
      }
    };
    const up = (e) => {
      keys.current[e.code] = false;
      if (e.code === "Space" || e.code === "KeyE" || e.code === "Enter") {
        input.current.action = false;
      }
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    let raf;
    const tick = () => {
      const k = keys.current;
      let x = 0;
      let y = 0;
      if (k["KeyW"] || k["ArrowUp"]) y -= 1;
      if (k["KeyS"] || k["ArrowDown"]) y += 1;
      if (k["KeyA"] || k["ArrowLeft"]) x -= 1;
      if (k["KeyD"] || k["ArrowRight"]) x += 1;
      // Only overwrite keyboard if no joystick is active
      if (!input.current._joystickActive) {
        input.current.x = x;
        input.current.y = y;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      cancelAnimationFrame(raf);
    };
  }, []);

  return input;
}
