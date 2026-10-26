// A natural, torn "treeline" edge as a CSS clip-path polygon: ridged noise (peaks and gaps) plus fine jitter.
// Built once at load, so it costs nothing while scrolling. y values are in px from the top of the element.
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s) }
const smooth = (t) => t * t * (3 - 2 * t)
const noise = (x) => { const i = Math.floor(x); return hash(i) + (hash(i + 1) - hash(i)) * smooth(x - i) }

function ridgeY(t) {
  let sum = 0, amp = 1, norm = 0, f = 5
  for (let o = 0; o < 5; o++) {
    sum += amp * (1 - Math.abs(noise(t * f + 17.3 * (o + 1)) * 2 - 1))
    norm += amp
    amp *= 0.55
    f *= 2.2
  }
  const fine = hash(Math.floor(t * 900)) * 0.12 // tiny tree-top jitter
  return 12 + 118 * (1 - (sum / norm) ** 1.4) + fine * 22
}

/** Height in px of the ragged band; the cream bridge above the next section is exactly this tall. */
export const RAGGED_H = 140

const N = 260
const points = Array.from({ length: N + 1 }, (_, i) => `${((i / N) * 100).toFixed(2)}% ${ridgeY(i / N).toFixed(1)}px`)
export const RAGGED_TOP = `polygon(${points.join(', ')}, 100% 100%, 0 100%)`
