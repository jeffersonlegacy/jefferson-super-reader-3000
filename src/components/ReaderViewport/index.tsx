import React from 'react';
import type { OrpToken } from '../../services/tokenizer';

export interface ReaderViewportProps {
  token: OrpToken | null;
  wpm: number;
  isPlaying: boolean;
  progressPercent: number;
}

export const ReaderViewport: React.FC<ReaderViewportProps> = ({
  token,
  wpm,
  isPlaying,
  progressPercent,
}) => {
  return (
    <section className="rsvp-viewport" aria-label="Optimal Recognition Point RSVP Viewport">
      <div className="reticle-top" />
      <div className="word-stage">
        <span className="orp-prefix">{token?.prefix ?? ''}</span>
        <span className="orp-anchor">{token?.anchor ?? 'R'}</span>
        <span className="orp-suffix">{token?.suffix ?? 'EADY'}</span>
      </div>
      <div className="reticle-bottom" />
      <div className="telemetry-bar">
        <span>{wpm} WPM</span>
        <span>ORP Index: {token?.orpIndex ?? 0}</span>
        <span>Cadence: {token?.durationMultiplier ?? 1}x</span>
        <span>{isPlaying ? 'STREAMING' : 'PAUSED'} ({progressPercent}%)</span>
      </div>
    </section>
  );
};
