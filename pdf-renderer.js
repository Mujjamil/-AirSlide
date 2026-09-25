/**
 * PDFRenderer — loads a PDF file using PDF.js and renders pages
 * to a <canvas> element on demand.
 *
 * Usage:
 *   const renderer = new PDFRenderer(canvas);
 *   await renderer.load(file);        // File object from <input>
 *   await renderer.renderPage(1);     // 1-indexed
 *   renderer.totalPages               // number
 */

class PDFRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this._pdf = null;
    this._renderTask = null;
    this.totalPages = 0;
    this._pageCache = new Map(); // pageNum → ImageBitmap (optional caching)
  }

  async load(file) {
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Load via PDF.js
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    this._pdf = await loadingTask.promise;
    this.totalPages = this._pdf.numPages;
    this._pageCache.clear();

    return this.totalPages;
  }

  async renderPage(pageNum, opts = {}) {
    if (!this._pdf) throw new Error('No PDF loaded');
    if (pageNum < 1 || pageNum > this.totalPages) return;

    // Cancel any in-progress render
    if (this._renderTask) {
      try { this._renderTask.cancel(); } catch (_) {}
      this._renderTask = null;
    }

    const page = await this._pdf.getPage(pageNum);

    // Calculate scale to fill the canvas container
    const container = this.canvas.parentElement;
    const containerW = container ? container.clientWidth : window.innerWidth * 0.8;
    const containerH = container ? container.clientHeight : window.innerHeight * 0.7;

    const viewport = page.getViewport({ scale: 1 });
    const scaleX = containerW / viewport.width;
    const scaleY = containerH / viewport.height;
    const scale = Math.min(scaleX, scaleY) * (window.devicePixelRatio || 1);

    const scaledViewport = page.getViewport({ scale });

    this.canvas.width = scaledViewport.width;
    this.canvas.height = scaledViewport.height;

    // CSS display size (unscaled for HiDPI)
    const displayScale = Math.min(scaleX, scaleY);
    this.canvas.style.width  = `${viewport.width  * displayScale}px`;
    this.canvas.style.height = `${viewport.height * displayScale}px`;

    const renderContext = {
      canvasContext: this.ctx,
      viewport: scaledViewport,
    };

    this._renderTask = page.render(renderContext);
    await this._renderTask.promise;
    this._renderTask = null;
  }

  unload() {
    if (this._pdf) {
      this._pdf.destroy();
      this._pdf = null;
    }
    this._pageCache.clear();
    this.totalPages = 0;
  }
}
