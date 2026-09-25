/**
 * GestureEngine v2 — Instant detection mode
 *
 * holdMs = 0  → gesture fires as soon as it's detected (after 1 stable frame)
 * holdMs > 0  → gesture must be held for that many ms before firing
 *
 * cooldownMs  → minimum gap between two successive gesture fires (default 1000ms)
 *
 * Callbacks:
 *   onGesture(gesture)       — called when a gesture fires an action
 *   onGestureChange(gesture) — called every time the detected gesture changes
 *   onHandDetected(bool)     — called when hand presence changes
 */

class GestureEngine {
  constructor({
    videoElement,
    onGesture,
    onGestureChange,
    onHandDetected,
    holdMs = 0,
    cooldownMs = 1000,
  }) {
    this.videoEl = videoElement;
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

    this._canvas = document.getElementById('gesture-canvas');
    this._ctx = this._canvas ? this._canvas.getContext('2d') : null;
  }

  async start() {
    if (this._running) return;
    this._running = true;

    this._hands = new Hands({
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

    this._camera = new Camera(this.videoEl, {
      onFrame: async () => {
        if (this._running) {
          await this._hands.send({ image: this.videoEl });
        }
      },
      width: 320,
      height: 240,
    });

    await this._camera.start();
  }

  stop() {
    this._running = false;
    if (this._camera) { this._camera.stop(); this._camera = null; }
    if (this._hands)  { this._hands.close(); this._hands = null; }
  }

  // ─── Finger extension helper ─────────────────────────────────────────────
  _isExtended(lm, tip, mcp) {
    return lm[tip].y < lm[mcp].y - 0.035;
  }

  // ─── Classify landmarks → gesture string ─────────────────────────────────
  _classify(lm) {
    const thumb  = this._isExtended(lm, 4,  2);
    const index  = this._isExtended(lm, 8,  5);
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

  // ─── Process each camera frame ────────────────────────────────────────────
  _processResults(results) {
    this._drawOverlay(results);

    const hasHand = !!(results.multiHandLandmarks?.length);

    // Notify on hand presence change
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

    // Update gesture change UI
    if (gesture !== this._currentGesture) {
      this._currentGesture = gesture;
      this._gestureStartTime = gesture !== 'none' ? now : null;
      if (this.onGestureChange) this.onGestureChange(gesture);
    }

    // Fire gesture
    if (gesture !== 'none' && this._gestureStartTime !== null) {
      const heldLongEnough = (now - this._gestureStartTime) >= this.holdMs;
      const cooledDown     = (now - this._lastFireTime)    >= this.cooldownMs;

      if (heldLongEnough && cooledDown) {
        this._lastFireTime = now;
        // Reset so it can fire again after another full cooldown + hold
        this._gestureStartTime = null;
        if (this.onGesture) this.onGesture(gesture);
      }
    }
  }

  // ─── Draw skeleton overlay ────────────────────────────────────────────────
  _drawOverlay(results) {
    if (!this._ctx || !this._canvas) return;
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    if (!results.multiHandLandmarks?.length) return;

    const W = this._canvas.width;
    const H = this._canvas.height;

    const CONNECTIONS = [
      [0,1],[1,2],[2,3],[3,4],
      [0,5],[5,6],[6,7],[7,8],
      [5,9],[9,10],[10,11],[11,12],
      [9,13],[13,14],[14,15],[15,16],
      [13,17],[17,18],[18,19],[19,20],
      [0,17],
    ];

    for (const lm of results.multiHandLandmarks) {
      // Connections
      this._ctx.strokeStyle = 'rgba(100,255,180,0.65)';
      this._ctx.lineWidth = 1.5;
      for (const [a, b] of CONNECTIONS) {
        this._ctx.beginPath();
        this._ctx.moveTo(lm[a].x * W, lm[a].y * H);
        this._ctx.lineTo(lm[b].x * W, lm[b].y * H);
        this._ctx.stroke();
      }
      // Joints
      for (const p of lm) {
        this._ctx.beginPath();
        this._ctx.arc(p.x * W, p.y * H, 3.5, 0, Math.PI * 2);
        this._ctx.fillStyle = 'rgba(80,220,255,0.85)';
        this._ctx.fill();
      }
    }
  }

  getCurrentGesture() { return this._currentGesture; }
  getHoldProgress() {
    if (this._currentGesture === 'none' || !this._gestureStartTime || this.holdMs === 0) return 0;
    return Math.min((Date.now() - this._gestureStartTime) / this.holdMs, 1);
  }
}
