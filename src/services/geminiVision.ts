/**
 * Gemini Vision Multimodal Layout-Aware OCR & Semantic Noise Filter
 * Extracts true human reading order from multi-column page frames while
 * stripping running headers, footers, page numbers, and citation noise.
 */

export interface VisionExtractionResult {
  documentTitle: string;
  detectedColumns: number;
  strippedArtifacts: string[];
  cleanReadingStream: string;
  confidenceScore: number;
}

export const SYSTEM_VISION_OCR_PROMPT = `
You are a deterministic document layout intelligence engine.
Given a high-contrast page image frame:
1. Reconstruct true human reading order across multi-column layouts and sidebars.
2. Strip running headers, footers, page numbers, watermarks, and inline figure/table boilerplate.
3. Preserve semantic punctuation boundaries (em-dashes, semicolons, clause breaks) required for Optimal Recognition Point (ORP) RSVP cadence modulation.
Return strict JSON matching VisionExtractionResult.
`.trim();

export function filterDocumentLayoutNoise(rawOcrText: string): {
  cleanText: string;
  removedArtifacts: string[];
} {
  const removedArtifacts: string[] = [];
  const lines = rawOcrText.split('\n');
  const keptLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Strip page numbers, running headers, and copyright footers
    if (/^(Page\s+\d+(\s+of\s+\d+)?|\d+\s*\|\s*[A-Z].*|©\s*\d{4}.*|CONFIDENTIAL.*)$/i.test(trimmed)) {
      removedArtifacts.push(trimmed);
      continue;
    }

    // Strip bracketed numeric citation noise like [12, 14]
    const cleanedLine = trimmed.replace(/\s*\[\d+(?:,\s*\d+)*\]/g, (match) => {
      removedArtifacts.push(match.trim());
      return '';
    });

    keptLines.push(cleanedLine);
  }

  return {
    cleanText: keptLines.join(' ').replace(/\s+/g, ' ').trim(),
    removedArtifacts,
  };
}
