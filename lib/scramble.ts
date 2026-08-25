/**
 * Shared decode-scramble behaviour.
 *
 * Both the eyebrow label and the headline use these so the two effects read as
 * the same gesture — a measurement settling into a definite value — rather than
 * drifting apart if one is retuned.
 */
export const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ01<>/\\[]{}=+*#%";

export function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

/**
 * Characters lock in left-to-right as `t` sweeps 0 -> 1. `offset` is the
 * character's position in the *whole* run, so a headline split across coloured
 * segments still decodes as one continuous sweep.
 */
export function scramble(text: string, t: number, totalChars: number, offset = 0) {
  const settled = t * totalChars;
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    // Whitespace is never scrambled, so the run keeps its shape.
    if (/\s/.test(ch)) out += ch;
    else if (offset + i < settled) out += ch;
    else out += randomGlyph();
  }
  return out;
}

/** Per-character pacing, so long and short runs decode at a similar rate. */
export const MS_PER_CHAR = 24;
