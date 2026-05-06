/** Tiny deterministic RNG for mock chart data keyed by UI scope / date (mulberry32). */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function rnd() {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
