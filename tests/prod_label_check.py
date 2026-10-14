"""Verify NEW production build (main.9aa39de0.js) renders all 7 destination labels
including 'illustration' in WebKit + Chromium at mobile/desktop viewports, by routing
to the local production artifact copied under public/__production_check__/.
"""
import asyncio, json, os, pathlib
from playwright.async_api import async_playwright

BASE = os.environ.get("PREVIEW_BASE", "https://est-teal-playground.preview.emergentagent.com")
PROD_DIR = pathlib.Path("/app/frontend/public/__production_check__")
INDEX_HTML = (PROD_DIR / "index.html").read_text()
# Rewrite /static/ to /__production_check__/static/ so no interception needed for sub-assets
PATCHED_INDEX = INDEX_HTML.replace('src="/static/', 'src="/__production_check__/static/') \
                          .replace('href="/static/', 'href="/__production_check__/static/')

LABEL_IDS = ["illustration", "murals", "packaging", "printing", "fashion", "games", "contact"]
OUT = pathlib.Path("/app/test_reports")
OUT.mkdir(parents=True, exist_ok=True)


async def check(ctx, name, viewport, screenshot_name):
    page = await ctx.new_page()
    await page.set_viewport_size(viewport)
    # Serve patched production index.html at root
    async def handle_root(route):
        await route.fulfill(status=200, content_type="text/html; charset=utf-8", body=PATCHED_INDEX)
    await page.route(f"{BASE}/", handle_root)
    page.on("pageerror", lambda e: print(f"[{name}] PAGEERROR:", e))
    page.on("console", lambda m: m.type == "error" and print(f"[{name}] console.error:", m.text))

    await page.goto(f"{BASE}/", wait_until="load", timeout=45000)
    # Confirm production bundle actually loaded
    bundle_loaded = await page.evaluate(
        """() => Array.from(document.scripts).some(s => s.src.includes('main.9aa39de0.js'))"""
    )
    await page.wait_for_timeout(4500)  # let Canvas + labels mount & project

    results = {}
    for lid in LABEL_IDS:
        el = await page.query_selector(f'[data-testid="destination-label-{lid}"]')
        if not el:
            results[lid] = {"present": False}
            continue
        txt = (await el.text_content()) or ""
        box = await el.bounding_box()
        display = await el.evaluate("e => getComputedStyle(e).display")
        results[lid] = {
            "present": True, "text": txt.strip(), "display": display,
            "box": box,
        }

    # ILLUSTRATION specific: within viewport, non-empty, white-ish color
    illus = results.get("illustration", {})
    illus_in_viewport = False
    if illus.get("box"):
        b = illus["box"]
        illus_in_viewport = (b["x"] >= 0 and b["y"] >= 0 and
                             b["x"] + b["width"] <= viewport["width"] and
                             b["y"] + b["height"] <= viewport["height"])

    # count duplicates of each testid
    dup_counts = await page.evaluate(
        """(ids) => Object.fromEntries(ids.map(i => [i, document.querySelectorAll(`[data-testid="destination-label-${i}"]`).length]))""",
        LABEL_IDS,
    )

    # drei Html wrappers (now only proximity CTA when active; should be 0 initially)
    html_wrappers = await page.evaluate(
        """() => document.querySelectorAll('div[style*="translate3d"]').length"""
    )

    await page.screenshot(path=str(OUT / screenshot_name), full_page=False, quality=40, type="jpeg")

    summary = {
        "name": name, "viewport": viewport,
        "bundle_main_9aa39de0_loaded": bundle_loaded,
        "all_seven_present": all(results[i].get("present") for i in LABEL_IDS),
        "illustration_text": illus.get("text"),
        "illustration_in_viewport": illus_in_viewport,
        "illustration_box": illus.get("box"),
        "duplicate_counts": dup_counts,
        "drei_html_wrappers": html_wrappers,
        "per_label": results,
        "screenshot": str(OUT / screenshot_name),
    }
    print(f"\n=== {name} ===")
    print(json.dumps({k: v for k, v in summary.items() if k != "per_label"}, indent=2, default=str))
    await page.close()
    return summary


async def check_proximity(ctx):
    """Approach illustration via keyboard until open-illustration-btn mounts (drei Html still used)."""
    page = await ctx.new_page()
    await page.set_viewport_size({"width": 390, "height": 844})
    async def handle_root(route):
        await route.fulfill(status=200, content_type="text/html; charset=utf-8", body=PATCHED_INDEX)
    await page.route(f"{BASE}/", handle_root)
    await page.goto(f"{BASE}/", wait_until="load", timeout=45000)
    await page.wait_for_timeout(3500)

    # Try to begin / dismiss any splash by clicking center + press space / enter
    await page.mouse.click(195, 420)
    await page.wait_for_timeout(500)
    for key in ["Enter", "Space"]:
        await page.keyboard.press(key)
        await page.wait_for_timeout(300)

    # Walk via arrow keys for up to ~6s looking for the illustration CTA
    found = False
    for i in range(60):
        await page.keyboard.down("ArrowUp")
        await page.wait_for_timeout(100)
        await page.keyboard.up("ArrowUp")
        btn = await page.query_selector('[data-testid="open-illustration-btn"]')
        if btn:
            found = True
            break
    result = {"open_illustration_btn_found": found, "steps": i if found else 60}
    if found:
        # verify it's a drei Html wrapped button and clickable
        box = await btn.bounding_box()
        result["box"] = box
        try:
            await btn.click(force=True)
            await page.wait_for_timeout(600)
            # Modal / overlay opened?
            opened = await page.evaluate(
                """() => !!document.querySelector('[role="dialog"], [data-testid*="illustration-modal"], .modal, [data-testid="destination-detail"]')"""
            )
            result["modal_opened_after_click"] = opened
        except Exception as e:
            result["click_error"] = str(e)
    print("\n=== proximity ===")
    print(json.dumps(result, indent=2, default=str))
    await page.close()
    return result


async def main():
    report = {}
    async with async_playwright() as p:
        # WebKit mobile fresh contexts
        wk = await p.webkit.launch()
        for i in range(1, 3):
            ctx = await wk.new_context(viewport={"width": 390, "height": 844},
                                       user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1")
            report[f"webkit_390_ctx{i}"] = await check(ctx, f"webkit_390_ctx{i}",
                                                      {"width": 390, "height": 844},
                                                      f"prod_webkit_390_ctx{i}.jpg")
            await ctx.close()
        # Narrow WebKit 320
        ctx = await wk.new_context(viewport={"width": 320, "height": 700})
        report["webkit_320"] = await check(ctx, "webkit_320", {"width": 320, "height": 700}, "prod_webkit_320.jpg")
        await ctx.close()
        await wk.close()

        # Chromium mobile + desktop
        cr = await p.chromium.launch()
        ctx = await cr.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True,
                                   user_agent="Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome Mobile")
        report["chromium_390"] = await check(ctx, "chromium_390", {"width": 390, "height": 844}, "prod_chromium_390.jpg")
        await ctx.close()
        ctx = await cr.new_context(viewport={"width": 1920, "height": 800})
        report["chromium_1920"] = await check(ctx, "chromium_1920", {"width": 1920, "height": 800}, "prod_chromium_1920.jpg")
        await ctx.close()

        # Proximity CTA check (chromium is more scriptable)
        ctx = await cr.new_context(viewport={"width": 390, "height": 844})
        report["proximity"] = await check_proximity(ctx)
        await ctx.close()
        await cr.close()

    (OUT / "prod_label_check_results.json").write_text(json.dumps(report, indent=2, default=str))
    print("\nSaved:", OUT / "prod_label_check_results.json")

if __name__ == "__main__":
    asyncio.run(main())
