## Latest Update — Desktop Zoom
- User requested mouse-wheel/trackpad zoom on desktop, clarified that the current desktop view is the CLOSEST limit and the farthest should match mobile. User explicitly requested no tests and minimum credits.
- CameraRig.jsx now starts desktop at the original FOV=45 (closest) and permits wheel/trackpad zoom-out using the same portrait-aspect framing formula as mobile; desktop's portrait reference is `min(aspect, 1/aspect)`. Existing mobile initial framing and two-finger behavior are retained.
- Wheel deltas normalized for pixels/lines/pages, exponential scaling clamped to the same near/far framing bounds. Listener attaches only to canvas, so portfolio popup scrolling is unchanged; cleanup removes listeners.
- No tests run for this change. Runtime verification and an updated production build/deployment remain pending; Netlify has not been republished by this agent.


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
- Contact section: email `estenionline@gmail.com`, no social links. Latest visual-editor request, confirmed for Contact only: subtitle set to “UX / UI, Graphic Design, Paintings, Marketing and Social Media”. No tests run for this text-only change.
- "MOVE TO EXPLORE" hint that fades after 7s
- Floating shapes and particle field for atmosphere. The three decorative E/S/T panels behind Murals were removed in Feb 2026 at the user's confirmed request; main mural, proximity interaction, and portfolio content unchanged. No tests run, as explicitly requested.
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


## Current Content Status — Feb 2026
- Brand wordmark is now ESTENISM. Latest request: replaced ESTENISMO/Estenismo in the wordmark and game title with ESTENISM/Estenism; preserved the game's existing URL with user approval. No tests run, as explicitly requested. Preserve the 3D world, controls and existing assets during content additions.
- Portfolio content uses local static WebP/video files under `frontend/public/portfolio/<category>/` and metadata in `frontend/src/data/portfolio.js`; absent slots are hidden, not placeholder cards.
- Murals: 6 visible projects (01 video, 03, 04, 05, 06, 08 images). Latest request: added uploaded `IMG_6850.TRIM (1).mp4` as `frontend/public/portfolio/murals/project-1.mp4`, using the existing native video player and default Project 01 title. Previous image projects 01, 02 and 07 remain archived outside the public directory in `frontend/archived-portfolio/murals/`. Other projects unchanged and not renumbered. No tests run. Printing: 2 native video projects moved from Fashion at the user's request. Fashion: new uploaded `RPReplay_Final1663193964.mp4` added as `frontend/public/portfolio/fashion/project-1.mp4`, using the existing video player and Project 01 title. Other projects unchanged; no tests run. Games: No Traffic and Stop Smoking embedded via iframe. Latest request: changed the Games title capitalization from STOP SMOKING to Stop Smoking, preserving its existing URL and the site wordmark. No tests run, as requested.
- Packaging: MAREA (slot 1), SOLEN (slot 2), COTTONFIELDS · Baby Cleansing Wipes (slot 3), and TUCANO · Takeaway Packaging (slot 4). Each reuses the existing lightbox in ProjectPanel.jsx; multi-image projects also have gallery thumbnails.
- Cottonfields: both images added as project 3, confirmed by user. Mockup saved as `project-3.webp`; flat artwork as `cottonfields-02.webp`. Original WebP files preserved without recompression, resizing, rotation or cropping.
- Latest completed request: add the Tucano image as project 4, confirmed by user. Saved the original 1414×2000 WebP (~140 KB) as `project-4.webp`; added title/description and `gallery: []` metadata. One conditional in ProjectPanel.jsx now allows a declared single-image gallery to reuse the existing lightbox without duplicate thumbnails. The 3D world and previous assets are unchanged.
- Verification: Cottonfields and Tucano files return HTTP 200 with image/webp through the current preview URL; downloaded bytes match the supplied originals. No automated test suite run, as requested. Gallery/lightbox visual interaction remains user-verification pending.
- Illustration: user-approved Project 01 added as original animated `project-1.gif` (1367×2000, 7 frames, infinite loop), from `Untitled_Artwork (2).gif`. Added `gif` to IMAGE_EXTENSIONS so the existing image renderer detects and plays it natively. No conversion or recompression; all frames preserved. File metadata checked and preview URL returns HTTP 200 image/gif. No automated UI suite run. Printing already contains the two relocated videos; further content only when supplied.
- Contact updated at user's confirmed request: email and mailto link now use `estenionline@gmail.com`; Instagram, Twitter and Behance removed by clearing the social links list. Email uses smaller responsive typography with `whitespace-nowrap` to remain on one line, as subsequently requested and confirmed. No tests run, as requested.
- Future work only on request: mobile/media interaction verification and deeper 3D polish. Ambient sound remains opted out; do not add integrations or refactor ProjectPanel for simple content changes.

## Mobile Illustration Label Fix
- User reported white ILLUSTRATION missing immediately on mobile initial load; requested minimal changes. A subsequent instruction required focused verification after fixing.
- Reproduced at 390×780: label rendered white but entirely offscreen (x=-315, right=-252). Fixed vertical FOV of 45 cropped side landmarks in portrait.
- CameraRig.jsx now adjusts FOV for mobile aspect ratios only (<768px), preserving desktop FOV=45 and existing camera position/follow. Destination.jsx keeps mobile names readable at 11px without distance scaling and adds destination-label-* test IDs. World geometry, project content, and desktop label styling unchanged.
- Focused verification passed via testing agent: `/app/test_reports/iteration_2.json`. ILLUSTRATION within viewport above easel at 390×780 (x=25.4,width=100) and 320×700 (x=11.9,width=100); desktop 1920×800 unchanged. This initially covered the development preview only; production recurrence and final fix are documented below.

## Production Label Fix and Mobile Pinch Zoom
- User reported ILLUSTRATION still absent at `https://estenism.netlify.app` on iPhone Safari. Production bundle was current, not stale. Report `iteration_3.json` reproduced an empty first drei Html React DOM root on both WebKit and Chromium, unlike preview. The exact scheduling trigger was not established; earlier Safari-only/undefined-distanceFactor explanations were hypotheses, not proven causes.
- Destination.jsx now creates the static category labels directly as DOM elements in a layout effect, with cleanup and per-frame world-to-screen projection. It no longer relies on separately scheduled React roots for labels. Existing styling, positions, 3D landmarks and interactive proximity CTAs are preserved.
- User approved mobile two-finger pinch zoom: initial/current wide mobile framing is the farthest limit; the exact original FOV=45 is the nearest limit. Camera position and follow behavior are unchanged. CameraRig.jsx clamps framing and maintains zoom progress between gestures and viewport changes. Listeners attach only to canvas on mobile; single-finger input, joystick and popup touches do not trigger zoom. Desktop remains FOV=45.
- Mobile movement hint now includes PINCH TO ZOOM. Footer changed from A CREATIVE 3D WORLD to A CREATIVE WORLD as requested.
- Verified the optimized production build `main.28b6e8b0.js` in reports `iteration_4.json` and `iteration_5.json`: all 7 labels mount in WebKit iPhone emulation and Chromium; pinch zoom reaches both exact bounds and returns to initial projection; sequential second-finger entry works. The speculative sequential-finger bug in iteration_4 was disproven in iteration_5.
- Validation limitation: WebKit ran in Linux iPhone emulation, not a physical iPhone. Zoom was exercised via Chromium CDP multitouch and WebKit synthetic touch lists (its native Touch constructor was unavailable).
- Supplemental production-browser verification passed: popup pinches leave world zoom unchanged, popup open/close preserves zoom, first proximity CTA mounts and opens Murals. See `zoom_supplemental.json`. The testing agent's earlier prolonged joystick push had overshot the destination; directed keyboard movement confirmed the CTA works.
- Temporary production-check fixtures were removed after verification. Generated production output remains in `frontend/build/`; build succeeded with only an existing missing MediaPipe source-map warning.
- Deployment status: changes are implemented and verified in preview/production build; external Netlify site has NOT been republished by this agent. User must publish the updated build there to see zoom and label fixes on the live domain.

## Walking Smoke
- User approved a light smoke trail behind the character's feet, visible only while walking, and explicitly requested no tests/minimum credits.
- Added WalkingSmoke in `frontend/src/three/Character.jsx`: 12 reusable soft radial sprites, alternating behind the feet according to actual movement direction, brief upward drift and fade. After user feedback that it was too subtle, increased peak sprite opacity from 0.22 to 0.55 and initial puff size from 0.18 to 0.28. Smoke remains in world space rather than following the character; all puffs hide immediately when movement stops. No external assets or dependencies added.
- No tests or screenshots run for this feature, as requested; runtime verification remains pending. Existing zoom, character controls and other scene elements unchanged. The generated production build mentioned above predates this smoke addition and must be rebuilt before publishing it.
