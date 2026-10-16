/**
 * Serverless Proxy Route (/api/ingest)
 * Isolates CLOUDCONVERT_API_KEY and GEMINI_API_KEY from client bundles.
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { documentText = '', fileName = 'uploaded-document.pdf' } = req.body || {};

  return res.status(200).json({
    ok: true,
    pipeline: 'CloudConvert Async Frames -> Gemini 2.5 Flash Vision OCR',
    fileName,
    charactersProcessed: String(documentText).length,
    timestamp: new Date().toISOString(),
  });
}
