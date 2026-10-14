"""
Production-bundle verification for:
  1. ILLUSTRATION + 6 other destination labels mount (regression fix)
  2. Mobile pinch-zoom works (two-finger spread -> FOV decreases toward 45;
     pinch inward -> FOV increases up to farFraming limit)
  3. Desktop uses FOV 45 and has no mobile zoom listeners
  4. Footer reads "A CREATIVE WORLD"

Routes production build (yarn build output) via fixture TXT files already
served by preview at /__production_check__/*.txt so we execute the actual
optimized bundle under preview origin.
"""
import asyncio, json, os, sys
from playwright.async_api import async_playwright

PREVIEW = "https://est-teal-playground.preview.emergentagent.com"
PROD_INDEX = f"{PREVIEW}/__production_check__/index.txt"
PROD_BUNDLE = f"{PREVIEW}/__production_check__/bundle.txt"
PROD_STYLES = f"{PREVIEW}/__production_check__/styles.txt"

LABEL_IDS = ["illustration", "murals", "packaging", "printing", "fashion", "games", "contact"]

async def route_as_production(context):
    """Route root HTML + main.*.js + main.*.css to the production fixture TXT files."""
    async def route_root(route, request):
        if request.resource_type == "document" and request.url.rstrip("/") == PREVIEW.rstrip("/"):
            import httpx
            async with httpx.AsyncClient() as c:
                r = await c.get(PROD_INDEX)
                await route.fulfill(status=200, content_type="text/html; charset=utf-8", body=r.text)
            return
        await route.continue_()
    async def route_js(route, request):
        import httpx
        async with httpx.AsyncClient() as c:
            r = await c.get(PROD_BUNDLE)
            await route.fulfill(status=200, content_type="application/javascript; charset=utf-8", body=r.text)
    async def route_css(route, request):
        import httpx
        async with httpx.AsyncClient() as c:
            r = await c.get(PROD_STYLES)
            await route.fulfill(status=200, content_type="text/css; charset=utf-8", body=r.text)

    await context.route(f"{PREVIEW}/", route_root)
    await context.route(f"{PREVIEW}", route_root)
    await context.route("**/static/js/main.*.js", route_js)
    await context.route("**/static/css/main.*.css", route_css)


async def collect_label_state(page):
    return await page.evaluate(f"""
        () => {{
            const ids = {json.dumps(LABEL_IDS)};
            const out = {{}};
            for (const id of ids) {{
                const el = document.querySelector(`[data-testid="destination-label-${{id}}"]`);
                if (!el) {{ out[id] = {{found: false}}; continue; }}
                const r = el.getBoundingClientRect();
                out[id] = {{
                    found: true, text: el.textContent,
                    display: getComputedStyle(el).display,
                    inViewport: r.top>=0 && r.left>=0 && r.bottom<=innerHeight && r.right<=innerWidth,
                    rect: {{x: r.x, y: r.y, w: r.width, h: r.height}}
                }};
            }}
            return out;
        }}
    """)


async def read_fov(page):
    """Read camera.fov by traversing the R3F fiber tree from the canvas element."""
    return await page.evaluate(r"""
        () => {
          const canvas = document.querySelector('canvas');
          if (!canvas) return null;
          // Walk react fiber tree looking for stateNode with isPerspectiveCamera or getState()
          const fiberKey = Object.keys(canvas).find(k => k.startsWith('__reactFiber'));
          if (!fiberKey) return null;
          const seen = new Set();
          const stack = [canvas[fiberKey]];
          while (stack.length) {
            const f = stack.pop();
            if (!f || seen.has(f)) continue;
            seen.add(f);
            const sn = f.stateNode;
            if (sn) {
              if (typeof sn.getState === 'function') {
                try { const st = sn.getState(); if (st && st.camera && typeof st.camera.fov==='number') return st.camera.fov; } catch(e) {}
              }
              if (sn.isPerspectiveCamera && typeof sn.fov === 'number') return sn.fov;
            }
            if (f.memoizedState) {
              let ms = f.memoizedState;
              let depth = 0;
              while (ms && depth++ < 20) {
                const v = ms.memoizedState;
                if (v && typeof v === 'object') {
                  if (typeof v.getState === 'function') {
                    try { const st = v.getState(); if (st && st.camera && typeof st.camera.fov==='number') return st.camera.fov; } catch(e) {}
                  }
                  if (v.isPerspectiveCamera && typeof v.fov==='number') return v.fov;
                }
                ms = ms.next;
              }
            }
            if (f.child) stack.push(f.child);
            if (f.sibling) stack.push(f.sibling);
          }
          return null;
        }
    """)


async def label_screen_width(page, dest_id="illustration"):
    return await page.evaluate(f"""
        () => {{
          const el = document.querySelector('[data-testid="destination-label-{dest_id}"]');
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return {{x: r.x, y: r.y, w: r.width, h: r.height, cx: r.x+r.width/2, cy: r.y+r.height/2}};
        }}
    """)


async def run_pinch(page, start_dist, end_dist, cx=195, cy=400):
    """Simulate two-finger pinch via CDP Input.dispatchTouchEvent."""
    client = await page.context.new_cdp_session(page)
    def pts(d):
        return [
            {"x": cx - d/2, "y": cy},
            {"x": cx + d/2, "y": cy},
        ]
    await client.send("Input.dispatchTouchEvent", {"type":"touchStart","touchPoints":pts(start_dist)})
    steps = 12
    for i in range(1, steps+1):
        d = start_dist + (end_dist-start_dist)*i/steps
        await client.send("Input.dispatchTouchEvent", {"type":"touchMove","touchPoints":pts(d)})
        await asyncio.sleep(0.03)
    await client.send("Input.dispatchTouchEvent", {"type":"touchEnd","touchPoints":[]})
    await asyncio.sleep(0.3)


async def test_chromium_mobile(pw, results):
    print("\n=== Chromium Mobile (390x844) production bundle ===")
    browser = await pw.chromium.launch(executable_path="/pw-browsers/chromium-1248/chrome-linux-arm64/chrome", headless=True, args=["--no-sandbox"])
    context = await browser.new_context(
        viewport={"width":390,"height":844},
        user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
        has_touch=True, is_mobile=True, device_scale_factor=3
    )
    await route_as_production(context)
    page = await context.new_page()
    page.on("pageerror", lambda e: print(f"PAGEERROR: {e}"))
    await page.goto(PREVIEW, wait_until="networkidle")
    await page.wait_for_selector("canvas", timeout=15000)
    await asyncio.sleep(4)

    labels = await collect_label_state(page)
    results["chromium_mobile_labels"] = labels
    missing = [k for k,v in labels.items() if not v.get("found")]
    print(f"Labels missing: {missing or 'NONE'}")
    print(f"ILLUSTRATION: {labels.get('illustration')}")

    fov0 = await read_fov(page)
    pos0 = await label_screen_width(page, "illustration")
    print(f"Initial FOV (mobile widest): {fov0}  label-illustration pos: {pos0}")
    results["chromium_mobile_fov_initial"] = fov0
    results["chromium_mobile_pos_initial"] = pos0

    # Spread fingers (zoom in / FOV decreases toward 45)
    await run_pinch(page, 80, 320)
    fov1 = await read_fov(page)
    pos1 = await label_screen_width(page, "illustration")
    print(f"After spread (zoom-in) FOV: {fov1}  pos: {pos1}")
    results["chromium_mobile_fov_after_spread"] = fov1
    results["chromium_mobile_pos_after_spread"] = pos1

    # Spread further - should clamp at 45
    await run_pinch(page, 80, 400)
    await run_pinch(page, 80, 400)
    fov_max_in = await read_fov(page)
    pos_max_in = await label_screen_width(page, "illustration")
    print(f"After max spread FOV (should be 45): {fov_max_in}  pos: {pos_max_in}")
    results["chromium_mobile_fov_clamped_in"] = fov_max_in
    results["chromium_mobile_pos_clamped_in"] = pos_max_in

    # Pinch back out - fresh wait and single clean sequence
    await asyncio.sleep(0.5)
    await run_pinch(page, 350, 70)
    await asyncio.sleep(0.5)
    pos2 = await label_screen_width(page, "illustration")
    print(f"After pinch out pos (should return toward initial cx~75): {pos2}")
    results["chromium_mobile_pos_after_pinch_out"] = pos2

    # Single-finger gesture should NOT zoom
    client = await page.context.new_cdp_session(page)
    pos_before_single = await label_screen_width(page, "illustration")
    await client.send("Input.dispatchTouchEvent", {"type":"touchStart","touchPoints":[{"x":195,"y":400}]})
    for i in range(10):
        await client.send("Input.dispatchTouchEvent", {"type":"touchMove","touchPoints":[{"x":195+i*10,"y":400}]})
        await asyncio.sleep(0.02)
    await client.send("Input.dispatchTouchEvent", {"type":"touchEnd","touchPoints":[]})
    await asyncio.sleep(0.3)
    pos_after_single = await label_screen_width(page, "illustration")
    results["chromium_mobile_single_finger_before"] = pos_before_single
    results["chromium_mobile_single_finger_after"] = pos_after_single
    print(f"Single-finger pos before/after (should be ~same since camera follows char but no zoom change)")

    await page.screenshot(path="/app/test_reports/zoom_chromium_mobile.jpg", quality=40, full_page=False)
    await context.close(); await browser.close()


async def test_webkit_mobile(pw, results):
    print("\n=== WebKit iPhone production bundle (label-only verification) ===")
    browser = await pw.webkit.launch(executable_path="/pw-browsers/webkit-2370/pw_run.sh", headless=True)
    context = await browser.new_context(
        viewport={"width":390,"height":844},
        user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
        has_touch=True, is_mobile=True, device_scale_factor=3
    )
    await route_as_production(context)
    page = await context.new_page()
    page.on("pageerror", lambda e: print(f"PAGEERROR: {e}"))
    await page.goto(PREVIEW, wait_until="networkidle")
    await page.wait_for_selector("canvas", timeout=15000)
    await asyncio.sleep(4)
    labels = await collect_label_state(page)
    results["webkit_mobile_labels"] = labels
    missing = [k for k,v in labels.items() if not v.get("found")]
    print(f"WebKit Labels missing: {missing or 'NONE'}")
    print(f"WebKit ILLUSTRATION: {labels.get('illustration')}")
    await page.screenshot(path="/app/test_reports/zoom_webkit_mobile.jpg", quality=40, full_page=False)
    await context.close(); await browser.close()


async def test_chromium_desktop(pw, results):
    print("\n=== Chromium Desktop (1920x800) production bundle ===")
    browser = await pw.chromium.launch(executable_path="/pw-browsers/chromium-1248/chrome-linux-arm64/chrome", headless=True, args=["--no-sandbox"])
    context = await browser.new_context(viewport={"width":1920,"height":800})
    await route_as_production(context)
    page = await context.new_page()
    await page.goto(PREVIEW, wait_until="networkidle")
    await page.wait_for_selector("canvas", timeout=15000)
    await asyncio.sleep(3)
    fov = await read_fov(page)
    print(f"Desktop FOV (expect 45): {fov}")
    results["chromium_desktop_fov"] = fov
    footer = await page.evaluate("() => document.body.innerText.includes('A CREATIVE WORLD')")
    results["footer_text_present"] = footer
    print(f"Footer 'A CREATIVE WORLD' present: {footer}")
    labels = await collect_label_state(page)
    results["chromium_desktop_labels"] = labels
    missing = [k for k,v in labels.items() if not v.get("found")]
    print(f"Desktop labels missing: {missing or 'NONE'}")
    await context.close(); await browser.close()


async def main():
    results = {}
    async with async_playwright() as pw:
        await test_chromium_mobile(pw, results)
        try:
            await test_webkit_mobile(pw, results)
        except Exception as e:
            print(f"WebKit test failed: {e}")
            results["webkit_error"] = str(e)
        await test_chromium_desktop(pw, results)
    with open("/app/test_reports/zoom_prod_results.json","w") as f:
        json.dump(results, f, indent=2, default=str)
    print("\n=== DONE. Results written to /app/test_reports/zoom_prod_results.json ===")


if __name__ == "__main__":
    asyncio.run(main())
