# EST — Interactive 3D Portfolio (PRD)

## Original Problem
Build a highly immersive, playful, premium interactive 3D portfolio for the creative brand **EST** — an entire portfolio presented as a small explorable voxel 3D world (bruno-simon.com concept, own identity). Voxel humanoid character, teal atmosphere, 7 physical destinations, minimal UI.

## Architecture
- Frontend: React 19 + CRA + Tailwind + Framer Motion + @react-three/fiber + @react-three/drei + three.js
- Backend: FastAPI (unused for portfolio content — kept as template baseline)
- No 3rd-party integrations required (no auth, no payments, no email)

## Personas
- Prospective creative clients evaluating EST's aesthetic and range
- Design/creative peers browsing for inspiration
- Recruiters / brand teams looking for collaborators

## Static Requirements
- Teal palette: #063F43 · #075B60 · #0B8584 · #20B9AE · #8CE4D5 · #F4F5ED
- Typography: Montserrat display + Inter body (Coolvetica alternative)
- Only 7 nav destinations: Illustration, Murals, Packaging Solutions, Printing, Fashion, Games, Contact
- No conventional hero — 3D world is the landing

## Implemented (Feb 2026)
- Interactive R3F Canvas world with fog, radial teal gradient, grid floor
- Voxel humanoid character (BoxGeometry, procedural) with idle bob + walk swing + yaw smoothing
- WASD / Arrow keys keyboard controls + mobile virtual joystick (touch)
- Smooth third-person camera rig (Vector3 lerp)
- 7 distinct 3D landmarks (canvas easel, mural wall, box stack, printing press, mannequin, arcade cabinet, glowing portal ring)
- Proximity detection: floating CTA button appears within 4.2 units of a destination
- Full-screen menu overlay with 7 large-type destinations (Framer Motion)
- Project showcase panel (per-section) with 2 curated placeholder projects, images from Unsplash/Pexels
- Contact section: email + Instagram / Twitter / Behance social links
- "MOVE TO EXPLORE" hint that fades after 7s
- Floating shapes, particle field, oversized EST letter sculptures for atmosphere
- Grain overlay for premium finish
- data-testid on all interactive elements

## Backlog
- P1: Cinematic zoom-in transition on destination open (currently just fades panel)
- P1: Environment map / bloom post-processing (deferred for perf)
- P2: Ambient audio track with mute toggle (user opted out)
- P2: Real project media integration (currently curated placeholders)
- P2: Contact form via Resend (user chose static links)
- P2: Character customization (skin/outfit picker)

## Next Tasks
- Optionally add react-three postprocessing (bloom on emissive materials)
- Optionally add a mini-map / compass in corner
