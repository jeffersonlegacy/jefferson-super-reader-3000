import React from 'react';

export interface UploadPipelineProps {
  activePresetId: string;
  onSelectPreset: (id: string) => void;
  strippedCount: number;
}

export const UploadPipeline: React.FC<UploadPipelineProps> = ({
  activePresetId,
  onSelectPreset,
  strippedCount,
}) => {
  return (
    <div className="upload-pipeline-panel">
      <h3>CloudConvert + Gemini Vision Ingestion</h3>
      <p>Stripped {strippedCount} layout artifacts (running headers, footers, inline citations).</p>
      <button onClick={() => onSelectPreset(activePresetId)}>Re-Normalize Document Frames</button>
    </div>
  );
};
