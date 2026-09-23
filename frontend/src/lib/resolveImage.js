// Locate the first existing image for a given base path by probing
// candidate extensions in order. Returns a Promise<string|null>.
export function resolveImage(imageBase, extensions) {
  return new Promise((resolve) => {
    let idx = 0;
    const tryNext = () => {
      if (idx >= extensions.length) return resolve(null);
      const url = `${imageBase}.${extensions[idx++]}`;
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = tryNext;
      img.src = url;
    };
    tryNext();
  });
}

// Locate the first existing video for a given base path by probing
// candidate extensions with a HEAD request. Returns a Promise<string|null>.
// Guards against SPA index.html fallback by checking Content-Type.
export async function resolveVideo(base, extensions) {
  for (const ext of extensions) {
    const url = `${base}.${ext}`;
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (!res.ok) continue;
      const ct = (res.headers.get("content-type") || "").toLowerCase();
      // Reject index.html fallbacks — accept only real video mime types.
      if (ct.startsWith("video/")) return url;
    } catch (_) {
      /* ignore, try next extension */
    }
  }
  return null;
}

// Resolve either an image or video for a slot. Images are checked first
// (to preserve the existing behavior for image-based categories).
// Returns Promise<{ type: "image"|"video", url: string } | null>.
export async function resolveMedia(base, imageExts, videoExts) {
  const image = await resolveImage(base, imageExts);
  if (image) return { type: "image", url: image };
  const video = await resolveVideo(base, videoExts);
  if (video) return { type: "video", url: video };
  return null;
}
