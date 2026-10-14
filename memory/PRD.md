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
- Remaining content: Illustration and Printing await user uploads.
- Contact updated at user's confirmed request: email and mailto link now use `estenionline@gmail.com`; Instagram, Twitter and Behance removed by clearing the social links list. Email uses smaller responsive typography with `whitespace-nowrap` to remain on one line, as subsequently requested and confirmed. No tests run, as requested.
- Future work only on request: mobile/media interaction verification and deeper 3D polish. Ambient sound remains opted out; do not add integrations or refactor ProjectPanel for simple content changes.
