/**
 * PDFRenderer service
 * Handles PDF loading via PDF.js and rendering to canvas with high DPR support.
 */
export class PDFRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;
    this._pdf = null;
    this._renderTask = null;
    this.totalPages = 0;
  }

  setCanvas(canvas) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;
  }

  async load(file) {
    if (!window.pdfjsLib) {
      throw new Error('PDF.js library is not loaded. Please ensure the CDN script is included.');
    }

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
    this._pdf = await loadingTask.promise;
    this.totalPages = this._pdf.numPages;
    return this.totalPages;
  }

  async renderPageFullScreen(pageNum) {
    if (!this._pdf) throw new Error('No PDF loaded');
    if (!this.canvas) return;
    if (pageNum < 1 || pageNum > this.totalPages) return;

    if (this._renderTask) {
      try {
        this._renderTask.cancel();
      } catch (_) {}
      this._renderTask = null;
    }

    const page = await this._pdf.getPage(pageNum);
    const vp1 = page.getViewport({ scale: 1 });
    const dpr = window.devicePixelRatio || 1;
    const scaleX = window.innerWidth / vp1.width;
    const scaleY = window.innerHeight / vp1.height;
    const scale = Math.min(scaleX, scaleY) * dpr;

    const scaledVp = page.getViewport({ scale });
    this.canvas.width = scaledVp.width;
    this.canvas.height = scaledVp.height;

    // CSS display size
    const cssW = vp1.width * Math.min(scaleX, scaleY);
    const cssH = vp1.height * Math.min(scaleX, scaleY);
    this.canvas.style.width = `${cssW}px`;
    this.canvas.style.height = `${cssH}px`;

    const ctx = this.canvas.getContext('2d');
    this._renderTask = page.render({ canvasContext: ctx, viewport: scaledVp });
    await this._renderTask.promise;
    this._renderTask = null;
  }

  async renderThumbnail(pageNum, thumbCanvas) {
    if (!this._pdf || !thumbCanvas) return;
    try {
      const page = await this._pdf.getPage(pageNum);
      const vp = page.getViewport({ scale: 0.18 });
      thumbCanvas.width = Math.round(vp.width);
      thumbCanvas.height = Math.round(vp.height);
      const ctx = thumbCanvas.getContext('2d');
      await page.render({ canvasContext: ctx, viewport: vp }).promise;
    } catch (e) {
      // Ignored if cancelled
    }
  }

  unload() {
    if (this._renderTask) {
      try { this._renderTask.cancel(); } catch (_) {}
      this._renderTask = null;
    }
    if (this._pdf) {
      this._pdf.destroy();
      this._pdf = null;
    }
    this.totalPages = 0;
  }
}
