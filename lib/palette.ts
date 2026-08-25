/**
 * Single source of truth for colors used from JS.
 *
 * Canvas 2D and WebGL can't read CSS custom properties, so these hexes have to
 * exist in JS as well as in `app/globals.css`. Keep the two in sync — if you
 * change an accent here, change it there too.
 */
export const PALETTE = {
  background: "#05070d",
  surface: "#0b0f1a",
  surfaceRaised: "#10162a",
  border: "#1c2333",
  borderStrong: "#2a3350",
  foreground: "#e8ecf4",
  foregroundMuted: "#8b93a7",
  foregroundFaint: "#565f78",

  cyan: "#4cc9f0",
  violet: "#b983ff",
  warm: "#ffb454",
} as const;

/**
 * Bloom only picks up pixels whose luminance exceeds the effect's
 * `luminanceThreshold`. Materials that should glow multiply their color by this
 * and set `toneMapped={false}` so the value survives into the composer.
 */
export const BLOOM_BOOST = 2.0;

/** Bloom settings shared by every R3F scene, so the whole site glows alike. */
export const BLOOM = {
  intensity: 1.15,
  luminanceThreshold: 0.22,
  luminanceSmoothing: 0.85,
} as const;
