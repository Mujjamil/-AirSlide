/**
 * pptxConverter.js
 * Sends a .pptx File to the local AirSlide conversion server (port 5001),
 * which renders each slide with python-pptx + Pillow and returns a PDF blob.
 * The PDF is then handed to the existing PDFRenderer — no extra client dependencies.
 */

async function resolveServerBase() {
  const candidates = ['', 'http://localhost:5001', 'http://127.0.0.1:5001'];
  for (const base of candidates) {
    try {
      const res = await fetch(`${base}/api/health`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) return base;
    } catch {
      // try next
    }
  }
  return null;
}

/**
 * @param {File} file              — the .pptx File object
 * @param {Function} onProgress    — optional callback(string) for status messages
 * @returns {Promise<File>}        — a PDF File ready for PDFRenderer.load()
 */
export async function convertPptxToPdf(file, onProgress = () => {}) {
  // 1. Verify the conversion server is reachable
  onProgress('Connecting to PPTX conversion server…');
  const serverBase = await resolveServerBase();
  if (serverBase === null) {
    throw new Error(
      'PPTX conversion server is not running.\n' +
      'Please start the local server in your terminal:\n  python3 server_convert.py'
    );
  }

  // 2. Upload the PPTX file
  onProgress(`Uploading "${file.name}"…`);
  const form = new FormData();
  form.append('file', file);

  const res = await fetch(`${serverBase}/api/convert`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    let msg = 'PPTX conversion failed';
    try {
      const body = await res.json();
      msg = body.error || msg;
    } catch { /* ignore */ }
    throw new Error(msg);
  }

  // 3. Get PDF blob
  onProgress('Rendering slides to PDF…');
  const blob = await res.blob();

  if (!blob || blob.size === 0) {
    throw new Error('Server returned an empty PDF');
  }

  // Return as a proper File so PDFRenderer.load() works identically
  const pdfName = file.name.replace(/\.pptx$/i, '.pdf');
  return new File([blob], pdfName, { type: 'application/pdf' });
}
