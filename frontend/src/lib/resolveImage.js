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
