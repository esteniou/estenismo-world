import { useRef, useState } from "react";
import Scene from "../three/Scene";
import Wordmark from "../components/UI/Wordmark";
import MenuOverlay from "../components/UI/MenuOverlay";
import MoveHint from "../components/UI/MoveHint";
import ProjectPanel from "../components/UI/ProjectPanel";
import MobileJoystick from "../components/UI/MobileJoystick";
import { useControls } from "../hooks/useControls";

export default function World() {
  const input = useControls();
  const characterPosRef = useRef({ x: 0, y: 0, z: 0 });
  const [openSection, setOpenSection] = useState(null);

  return (
    <div
      className="relative w-full h-full grain"
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, #0B8584 0%, #075B60 42%, #063F43 75%, #041B1D 100%)",
      }}
      data-testid="est-world-root"
    >
      <Wordmark />
      <MenuOverlay onOpenSection={setOpenSection} />
      <MoveHint />

      <div className="absolute inset-0" data-testid="est-canvas-wrap">
        <Scene
          input={input}
          onOpen={setOpenSection}
          characterPosRef={characterPosRef}
        />
      </div>

      <MobileJoystick input={input} />

      {/* Bottom-right tagline */}
      <div className="fixed bottom-5 right-5 md:bottom-8 md:right-8 z-30 pointer-events-none text-right">
        <div className="est-mono-track text-[10px] text-[#8CE4D5]/80">
          A CREATIVE 3D WORLD
        </div>
        <div className="est-heading text-[#F4F5ED] text-sm md:text-base">
          by EST Studio
        </div>
      </div>

      <ProjectPanel sectionId={openSection} onClose={() => setOpenSection(null)} />
    </div>
  );
}
