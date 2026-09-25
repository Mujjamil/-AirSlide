/**
 * GestureEngine v2 — Instant detection mode
 * Powered by MediaPipe Hands & Camera Utils
 */
export class GestureEngine {
  constructor({
    videoElement,
    canvasElement,
    onGesture,
    onGestureChange,
    onHandDetected,
    holdMs = 0,
    cooldownMs = 1000,
  }) {
    this.videoEl = videoElement;
    this.canvasEl = canvasElement;
    this.ctx = canvasElement ? canvasElement.getContext('2d') : null;
    this.onGesture = onGesture;
    this.onGestureChange = onGestureChange;
    this.onHandDetected = onHandDetected;
    this.holdMs = holdMs;
    this.cooldownMs = cooldownMs;

    this._hands = null;
    this._camera = null;
    this._running = false;

    this._currentGesture = 'none';
    this._gestureStartTime = null;
    this._lastFireTime = 0;
    this._handPresent = false;
  }

  setElements(videoElement, canvasElement) {
    this.videoEl = videoElement;
    this.canvasEl = canvasElement;
    this.ctx = canvasElement ? canvasElement.getContext('2d') : null;
  }

  async start() {
    if (this._running) return;
    if (!window.Hands || !window.Camera) {
      throw new Error('MediaPipe Hands or Camera is not loaded.');
    }
    if (!this.videoEl) return;

    this._running = true;

    this._hands = new window.Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/${file}`,
    });

    this._hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.72,
      minTrackingConfidence: 0.55,
    });

    this._hands.onResults((results) => this._processResults(results));

    this._camera = new window.Camera(this.videoEl, {
      onFrame: async () => {
        if (this._running && this._hands && this.videoEl) {
          try {
            await this._hands.send({ image: this.videoEl });
          } catch (_) {}
        }
      },
      width: 320,
      height: 240,
    });

    await this._camera.start();
  }

  stop() {
    this._running = false;
    if (this._camera) {
      try {
        this._camera.stop();
      } catch (_) {}
      this._camera = null;
    }
    if (this._hands) {
      try {
        this._hands.close();
      } catch (_) {}
      this._hands = null;
    }
  }

  // Finger extension helper: true if tip is higher (smaller y) than MCP joint
  _isExtended(lm, tip, mcp) {
    return lm[tip].y < lm[mcp].y - 0.035;
  }

  // Classify landmarks → gesture string
  _classify(lm) {
    const thumb  = this._isExtended(lm, 4, 2);
    const index  = this._isExtended(lm, 8, 5);
    const middle = this._isExtended(lm, 12, 9);
    const ring   = this._isExtended(lm, 16, 13);
    const pinky  = this._isExtended(lm, 20, 17);

    // Open palm: all five up
    if (thumb && index && middle && ring && pinky) return 'next';

    // Fist: all five down
    if (!thumb && !index && !middle && !ring && !pinky) return 'prev';

    // Index only up → first slide
    if (!thumb && index && !middle && !ring && !pinky) return 'first';

    // Thumb + pinky (call-me) → last slide
    if (thumb && !index && !middle && !ring && pinky) return 'last';

    return 'none';
  }

  _processResults(results) {
    this._drawOverlay(results);

    const hasHand = !!(results.multiHandLandmarks?.length);

    if (hasHand !== this._handPresent) {
      this._handPresent = hasHand;
      if (this.onHandDetected) this.onHandDetected(hasHand);
    }

    if (!hasHand) {
      if (this._currentGesture !== 'none') {
        this._currentGesture = 'none';
        this._gestureStartTime = null;
        if (this.onGestureChange) this.onGestureChange('none');
      }
      return;
    }

    const lm = results.multiHandLandmarks[0];
    const gesture = this._classify(lm);
    const now = Date.now();

    if (gesture !== this._currentGesture) {
      this._currentGesture = gesture;
      this._gestureStartTime = gesture !== 'none' ? now : null;
      if (this.onGestureChange) this.onGestureChange(gesture);
    }

    if (gesture !== 'none' && this._gestureStartTime !== null) {
      const heldLongEnough = (now - this._gestureStartTime) >= this.holdMs;
      const cooledDown     = (now - this._lastFireTime)    >= this.cooldownMs;

      if (heldLongEnough && cooledDown) {
        this._lastFireTime = now;
        this._gestureStartTime = null;
        if (this.onGesture) this.onGesture(gesture);
      }
    }
  }

  _drawOverlay(results) {
    if (!this.ctx || !this.canvasEl) {
      if (this.canvasEl) {
        this.ctx = this.canvasEl.getContext('2d');
      }
      if (!this.ctx) return;
    }

    this.ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
    if (!results.multiHandLandmarks?.length) return;

    const W = this.canvasEl.width;
    const H = this.canvasEl.height;

    const CONNECTIONS = [
      [0, 1], [1, 2], [2, 3], [3, 4],
      [0, 5], [5, 6], [6, 7], [7, 8],
      [5, 9], [9, 10], [10, 11], [11, 12],
      [9, 13], [13, 14], [14, 15], [15, 16],
      [13, 17], [17, 18], [18, 19], [19, 20],
      [0, 17],
    ];

    for (const lm of results.multiHandLandmarks) {
      this.ctx.strokeStyle = 'rgba(100, 255, 180, 0.75)';
      this.ctx.lineWidth = 2;
      for (const [a, b] of CONNECTIONS) {
        this.ctx.beginPath();
        this.ctx.moveTo(lm[a].x * W, lm[a].y * H);
        this.ctx.lineTo(lm[b].x * W, lm[b].y * H);
        this.ctx.stroke();
      }
      for (const p of lm) {
        this.ctx.beginPath();
        this.ctx.arc(p.x * W, p.y * H, 3.5, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(80, 220, 255, 0.95)';
        this.ctx.fill();
      }
    }
  }

  getCurrentGesture() {
    return this._currentGesture;
  }
}
