import React from 'react';

export interface CadenceControlsProps {
  wpm: number;
  punctuationScale: number;
  onChangeWpm: (wpm: number) => void;
  onChangePunctuationScale: (scale: number) => void;
}

export const CadenceControls: React.FC<CadenceControlsProps> = ({
  wpm,
  punctuationScale,
  onChangeWpm,
  onChangePunctuationScale,
}) => {
  return (
    <div className="cadence-controls">
      <label>
        Target Cadence ({wpm} WPM)
        <input
          type="range"
          min={200}
          max={900}
          step={25}
          value={wpm}
          onChange={(e) => onChangeWpm(Number(e.target.value))}
        />
      </label>
      <label>
        Punctuation Pause Weight ({punctuationScale}x)
        <input
          type="range"
          min={0.5}
          max={2.0}
          step={0.25}
          value={punctuationScale}
          onChange={(e) => onChangePunctuationScale(Number(e.target.value))}
        />
      </label>
    </div>
  );
};
