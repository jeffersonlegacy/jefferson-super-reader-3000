/**
 * Optimal Recognition Point (ORP) & Cadence Tokenizer Engine
 * Calculates the focal anchor index for rapid foveal fixation and
 * computes punctuation-aware frame duration multipliers.
 */

export interface OrpToken {
  index: number;
  raw: string;
  prefix: string;
  anchor: string;
  suffix: string;
  orpIndex: number;
  durationMultiplier: number;
  clauseBreak: boolean;
}

/**
 * Deterministic ORP index calculation based on word character length:
 * Length 1: index 0
 * Length 2-5: index 1
 * Length 6-9: index 2
 * Length 10-13: index 3
 * Length 14+: index 4
 */
export function calculateOrpIndex(word: string): number {
  const cleanLength = word.replace(/[^a-zA-Z0-9]/g, '').length || word.length;
  if (cleanLength <= 1) return 0;
  if (cleanLength <= 5) return 1;
  if (cleanLength <= 9) return 2;
  if (cleanLength <= 13) return 3;
  return 4;
}

/**
 * Computes frame duration multiplier around punctuation boundaries and word complexity.
 */
export function calculateCadenceMultiplier(
  word: string,
  punctuationPauseScale = 1.0
): { multiplier: number; clauseBreak: boolean } {
  let multiplier = 1.0;
  let clauseBreak = false;

  if (/[.!?]["')\]]?$/.test(word)) {
    multiplier += 1.35 * punctuationPauseScale;
    clauseBreak = true;
  } else if (/[,;:—–]["')\]]?$/.test(word)) {
    multiplier += 0.75 * punctuationPauseScale;
    clauseBreak = true;
  }

  if (word.length >= 11) {
    multiplier += 0.25;
  } else if (word.length <= 3) {
    multiplier = Math.max(0.85, multiplier - 0.1);
  }

  return { multiplier: Number(multiplier.toFixed(2)), clauseBreak };
}

export function tokenizeToOrpStream(
  text: string,
  punctuationPauseScale = 1.0
): OrpToken[] {
  const rawWords = text
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);

  return rawWords.map((raw, idx) => {
    const orpIndex = Math.min(calculateOrpIndex(raw), Math.max(0, raw.length - 1));
    const prefix = raw.slice(0, orpIndex);
    const anchor = raw.charAt(orpIndex) || '';
    const suffix = raw.slice(orpIndex + 1);
    const { multiplier, clauseBreak } = calculateCadenceMultiplier(
      raw,
      punctuationPauseScale
    );

    return {
      index: idx,
      raw,
      prefix,
      anchor,
      suffix,
      orpIndex,
      durationMultiplier: multiplier,
      clauseBreak,
    };
  });
}
