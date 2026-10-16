import React, { useState, useMemo } from 'react';
import { tokenizeToOrpStream } from './services/tokenizer';
import { filterDocumentLayoutNoise } from './services/geminiVision';
import { ReaderViewport } from './components/ReaderViewport';
import { UploadPipeline } from './components/UploadPipeline';
import { CadenceControls } from './components/CadenceControls';

export function App() {
  const [rawInput] = useState(
    'Page 1 of 12\nRapid Serial Visual Presentation (RSVP) eliminates saccadic eye movement overhead [1, 4] by anchoring each word at its Optimal Recognition Point (ORP).'
  );
  const [wpm, setWpm] = useState(450);
  const [punctuationScale, setPunctuationScale] = useState(1.0);
  const [cursor, setCursor] = useState(0);
  const [isPlaying] = useState(false);

  const filtered = useMemo(() => filterDocumentLayoutNoise(rawInput), [rawInput]);
  const tokens = useMemo(
    () => tokenizeToOrpStream(filtered.cleanText, punctuationScale),
    [filtered.cleanText, punctuationScale]
  );

  const currentToken = tokens[cursor] ?? null;
  const progressPercent = tokens.length ? Math.round(((cursor + 1) / tokens.length) * 100) : 0;

  return (
    <main className="super-reader-shell">
      <ReaderViewport
        token={currentToken}
        wpm={wpm}
        isPlaying={isPlaying}
        progressPercent={progressPercent}
      />
      <CadenceControls
        wpm={wpm}
        punctuationScale={punctuationScale}
        onChangeWpm={setWpm}
        onChangePunctuationScale={setPunctuationScale}
      />
      <UploadPipeline
        activePresetId="default"
        onSelectPreset={() => setCursor(0)}
        strippedCount={filtered.removedArtifacts.length}
      />
    </main>
  );
}

export default App;
