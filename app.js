/**
 * app.js — GestureSlides (Full-Screen Immersive Mode)
 *
 * Changes from v1:
 *  - Slide canvas stretches full viewport
 *  - Controls are floating overlays (auto-hide after 3s inactivity)
 *  - Gesture detection is INSTANT (no hold required) with 1s cooldown
 *  - Camera is a collapsible corner widget
 */

// ─── PDF.js worker ─────────────────────────────────────────────────────────
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// ─── DOM refs ───────────────────────────────────────────────────────────────
const uploadSection   = document.getElementById('upload-section');
const viewerSection   = document.getElementById('viewer-section');
const dropZone        = document.getElementById('drop-zone');
const fileInput       = document.getElementById('file-input');
const slideCanvas     = document.getElementById('slide-canvas');
const gestureName     = document.getElementById('gesture-name');
const gestureHint     = document.getElementById('gesture-hint');
const gestureIcon     = document.getElementById('gesture-icon');
const btnPrev         = document.getElementById('btn-prev');
const btnNext         = document.getElementById('btn-next');
const btnClose        = document.getElementById('btn-close');
const btnToggleCam    = document.getElementById('btn-toggle-cam');
const cameraWidget    = document.getElementById('camera-widget');
const webcamVideo     = document.getElementById('webcam-video');
const gestureCanvas   = document.getElementById('gesture-canvas');
const handStatus      = document.getElementById('hand-status');
const loadingOverlay  = document.getElementById('loading-overlay');
const loadingText     = document.getElementById('loading-text');
const toastEl         = document.getElementById('toast');
const thumbnailStrip  = document.getElementById('thumbnail-strip');
const currentSlideNum = document.getElementById('current-slide-num');
const totalSlideNum   = document.getElementById('total-slide-num');
const bottomBar       = document.getElementById('bottom-bar');
const gesturePill     = document.getElementById('gesture-pill');

// ─── State ──────────────────────────────────────────────────────────────────
let pdfRenderer    = null;
let gestureEngine  = null;
let currentPage    = 1;
let totalPages     = 0;
let camVisible     = true;
let hideBarTimer   = null;
let isTransitioning = false;

// ─── Gesture metadata ────────────────────────────────────────────────────────
const GESTURE_META = {
  next:  { icon: '✋', label: 'Next Slide',  hint: 'Open palm → advance',  color: '#4ade80' },
  prev:  { icon: '✊', label: 'Prev Slide',  hint: 'Fist → go back',       color: '#fb923c' },
  first: { icon: '☝️', label: 'First Slide', hint: 'Index up → slide 1',   color: '#60a5fa' },
  last:  { icon: '🤙', label: 'Last Slide',  hint: 'Call me → last slide', color: '#c084fc' },
  none:  { icon: '👋', label: 'Show a gesture', hint: 'Instant detection', color: '#6b7280' },
};

// ─── Utils ───────────────────────────────────────────────────────────────────
function showToast(msg, type = 'info') {
  toastEl.textContent = msg;
  toastEl.className = `toast show ${type}`;
  clearTimeout(toastEl._timer);
  toastEl._timer = setTimeout(() => toastEl.classList.remove('show'), 3000);
}

function setLoading(visible, text = 'Loading…') {
  loadingOverlay.classList.toggle('visible', visible);
  loadingText.textContent = text;
}

// ─── Auto-hide bottom bar ─────────────────────────────────────────────────────
function showBottomBar() {
  bottomBar.classList.add('visible');
  clearTimeout(hideBarTimer);
  hideBarTimer = setTimeout(() => bottomBar.classList.remove('visible'), 3500);
}

viewerSection.addEventListener('mousemove', showBottomBar);
viewerSection.addEventListener('touchstart', showBottomBar);

// ─── Slide navigation ─────────────────────────────────────────────────────────
async function goToPage(page, direction = 'none') {
  if (!pdfRenderer || isTransitioning) return;
  const clamped = Math.max(1, Math.min(totalPages, page));
  if (clamped === currentPage) return;

  isTransitioning = true;
  currentPage = clamped;

  // Slide exit animation
  const animOut = direction === 'next' ? 'slide-out-left' : 'slide-out-right';
  slideCanvas.classList.add(animOut);
  await sleep(180);
  slideCanvas.classList.remove(animOut);

  // Render new page
  await pdfRenderer.renderPage(currentPage);

  // Slide entry animation
  slideCanvas.classList.add('slide-in');
  await sleep(200);
  slideCanvas.classList.remove('slide-in');

  isTransitioning = false;

  // Update UI
  currentSlideNum.textContent = currentPage;
  btnPrev.disabled = currentPage <= 1;
  btnNext.disabled = currentPage >= totalPages;

  // Highlight thumbnail
  document.querySelectorAll('.thumb-item').forEach((el, i) => {
    const active = i + 1 === currentPage;
    el.classList.toggle('active', active);
    if (active) el.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ─── File loading ──────────────────────────────────────────────────────────────
async function loadFile(file) {
  if (!file) return;

  if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
    showToast('Please upload a PDF file', 'error');
    return;
  }

  setLoading(true, 'Reading PDF…');

  try {
    pdfRenderer = new PDFRenderer(slideCanvas);
    totalPages  = await pdfRenderer.load(file);
    totalSlideNum.textContent = totalPages;
    currentPage = 0; // force first render

    setLoading(true, 'Rendering slide…');
    await renderFullScreen(1);

    // Show viewer
    uploadSection.classList.add('hidden');
    viewerSection.classList.remove('hidden');
    viewerSection.classList.add('fade-in');

    // Build thumbnails async
    buildThumbnails();

    // Start gesture engine
    setLoading(true, 'Starting camera…');
    await startGestureEngine();

    setLoading(false);
    showToast(`✓ "${file.name}" — ${totalPages} slides`, 'success');
    showBottomBar();

  } catch (err) {
    console.error(err);
    setLoading(false);
    showToast('Failed to load PDF: ' + err.message, 'error');
  }
}

// ─── Full-screen render ────────────────────────────────────────────────────────
async function renderFullScreen(pageNum) {
  if (!pdfRenderer) return;
  const clamped = Math.max(1, Math.min(totalPages, pageNum));
  currentPage = clamped;
  currentSlideNum.textContent = currentPage;
  btnPrev.disabled = currentPage <= 1;
  btnNext.disabled = currentPage >= totalPages;

  const page = await pdfRenderer._pdf.getPage(clamped);

  const vp1 = page.getViewport({ scale: 1 });
  const dpr = window.devicePixelRatio || 1;
  const scaleX = window.innerWidth  / vp1.width;
  const scaleY = window.innerHeight / vp1.height;
  const scale  = Math.min(scaleX, scaleY) * dpr;

  const scaledVp = page.getViewport({ scale });
  slideCanvas.width  = scaledVp.width;
  slideCanvas.height = scaledVp.height;

  // CSS display size
  const cssW = vp1.width  * Math.min(scaleX, scaleY);
  const cssH = vp1.height * Math.min(scaleX, scaleY);
  slideCanvas.style.width  = `${cssW}px`;
  slideCanvas.style.height = `${cssH}px`;

  const ctx = slideCanvas.getContext('2d');
  const renderTask = page.render({ canvasContext: ctx, viewport: scaledVp });
  await renderTask.promise;
}

// ─── Thumbnail strip ──────────────────────────────────────────────────────────
async function buildThumbnails() {
  thumbnailStrip.innerHTML = '';

  for (let p = 1; p <= totalPages; p++) {
    const thumbCanvas = document.createElement('canvas');
    const thumbEl = document.createElement('div');
    thumbEl.className = 'thumb-item' + (p === 1 ? ' active' : '');
    thumbEl.dataset.page = p;
    thumbEl.setAttribute('role', 'listitem');
    thumbEl.appendChild(thumbCanvas);

    const label = document.createElement('span');
    label.textContent = p;
    thumbEl.appendChild(label);

    thumbEl.addEventListener('click', () => goToPage(p, p > currentPage ? 'next' : 'prev'));
    thumbnailStrip.appendChild(thumbEl);

    const pageNum = p;
    setTimeout(async () => {
      try {
        const page = await pdfRenderer._pdf.getPage(pageNum);
        const vp = page.getViewport({ scale: 0.18 });
        thumbCanvas.width  = Math.round(vp.width);
        thumbCanvas.height = Math.round(vp.height);
        await page.render({ canvasContext: thumbCanvas.getContext('2d'), viewport: vp }).promise;
      } catch (_) {}
    }, pageNum * 40);
  }
}

// ─── PDFRenderer override for fullscreen ──────────────────────────────────────
// We override renderPage to use our fullscreen render function
PDFRenderer.prototype.renderPage = async function(pageNum) {
  return renderFullScreen(pageNum);
};

// ─── Gesture engine ────────────────────────────────────────────────────────────
async function startGestureEngine() {
  if (gestureEngine) { gestureEngine.stop(); gestureEngine = null; }

  gestureEngine = new GestureEngine({
    videoElement: webcamVideo,
    holdMs: 0,           // INSTANT — no hold required
    cooldownMs: 1000,    // 1 second between triggers
    onHandDetected: (detected) => {
      handStatus.textContent = detected ? '🟢 Hand detected' : '⚪ No hand';
      handStatus.className   = detected ? 'hand-ok' : 'hand-none';
    },
    onGesture: handleGesture,
    onGestureChange: updateGestureUI,
  });

  await gestureEngine.start();
  requestAnimationFrame(updateRing);
}

function updateGestureUI(gesture) {
  const meta = GESTURE_META[gesture] || GESTURE_META.none;
  gestureIcon.textContent = meta.icon;
  gestureName.textContent = meta.label;
  gestureName.style.color = meta.color;
  gestureHint.textContent = meta.hint;
}

function updateRing() {
  if (!gestureEngine) return;
  requestAnimationFrame(updateRing);
}

function handleGesture(gesture) {
  const meta = GESTURE_META[gesture] || GESTURE_META.none;
  flashFeedback(meta.icon, meta.color);

  switch (gesture) {
    case 'next':  goToPage(currentPage + 1, 'next');  break;
    case 'prev':  goToPage(currentPage - 1, 'prev');  break;
    case 'first': goToPage(1, 'prev');                break;
    case 'last':  goToPage(totalPages, 'next');       break;
  }
}

function flashFeedback(icon, color) {
  const flash = document.getElementById('gesture-flash');
  flash.textContent = icon;
  flash.style.color = color;
  flash.classList.remove('flash-animate');
  void flash.offsetWidth;
  flash.classList.add('flash-animate');
}

// ─── Drop zone ─────────────────────────────────────────────────────────────────
dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  if (e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]);
});
dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') fileInput.click(); });
fileInput.addEventListener('change', e => { if (e.target.files[0]) loadFile(e.target.files[0]); });

// ─── Controls ──────────────────────────────────────────────────────────────────
btnPrev.addEventListener('click', () => goToPage(currentPage - 1, 'prev'));
btnNext.addEventListener('click', () => goToPage(currentPage + 1, 'next'));

btnClose.addEventListener('click', () => {
  if (gestureEngine) { gestureEngine.stop(); gestureEngine = null; }
  if (pdfRenderer)   { pdfRenderer.unload(); pdfRenderer = null; }
  viewerSection.classList.add('hidden');
  uploadSection.classList.remove('hidden');
  fileInput.value = '';
  thumbnailStrip.innerHTML = '';
});

btnToggleCam.addEventListener('click', () => {
  camVisible = !camVisible;
  cameraWidget.classList.toggle('cam-hidden', !camVisible);
  btnToggleCam.textContent = camVisible ? '📷 Camera' : '📷 Camera';
  btnToggleCam.style.opacity = camVisible ? '1' : '0.5';
});

// ─── Keyboard shortcuts ────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (viewerSection.classList.contains('hidden')) return;
  switch (e.key) {
    case 'ArrowRight': case 'ArrowDown': case ' ':
      e.preventDefault(); goToPage(currentPage + 1, 'next'); break;
    case 'ArrowLeft': case 'ArrowUp':
      e.preventDefault(); goToPage(currentPage - 1, 'prev'); break;
    case 'Home': goToPage(1, 'prev'); break;
    case 'End':  goToPage(totalPages, 'next'); break;
    case 'Escape': btnClose.click(); break;
    case 'f': case 'F':
      if (!document.fullscreenElement) document.documentElement.requestFullscreen();
      else document.exitFullscreen();
      break;
  }
  showBottomBar();
});

// ─── Window resize — re-render ──────────────────────────────────────────────────
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(async () => {
    if (pdfRenderer && currentPage > 0) await renderFullScreen(currentPage);
  }, 150);
});
