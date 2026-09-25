import React, { useState, useRef, useEffect, useCallback } from 'react';
import DropZone from './components/DropZone';
import Viewer from './components/Viewer';
import Toast from './components/Toast';
import LoadingOverlay from './components/LoadingOverlay';
import { PDFRenderer } from './services/pdfRenderer';
import { GestureEngine } from './services/gestureEngine';
import { GESTURE_META } from './constants/gestures';

export default function App() {
  const [file, setFile] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading…');
  const [toast, setToast] = useState(null);

  // Gesture states
  const [currentGesture, setCurrentGesture] = useState('none');
  const [handDetected, setHandDetected] = useState(false);
  const [flashTrigger, setFlashTrigger] = useState(null);
  const [camVisible, setCamVisible] = useState(true);

  // Service instances & element refs
  const pdfRendererRef = useRef(null);
  const gestureEngineRef = useRef(null);
  const videoRef = useRef(null);
  const gestureCanvasRef = useRef(null);
  const toastTimerRef = useRef(null);

  const showToast = useCallback((message, type = 'info') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  // Flash gesture emoji feedback
  const triggerFlash = useCallback((icon, color) => {
    setFlashTrigger({ id: Date.now(), icon, color });
  }, []);

  // Handle gesture fire from engine
  const handleGestureTrigger = useCallback(
    (gesture) => {
      const meta = GESTURE_META[gesture] || GESTURE_META.none;
      triggerFlash(meta.icon, meta.color);

      setCurrentPage((prev) => {
        if (!pdfRendererRef.current) return prev;
        const total = pdfRendererRef.current.totalPages;

        switch (gesture) {
          case 'next':
            return Math.min(total, prev + 1);
          case 'prev':
            return Math.max(1, prev - 1);
          case 'first':
            return 1;
          case 'last':
            return total;
          default:
            return prev;
        }
      });
    },
    [triggerFlash]
  );

  // Handle File upload
  const handleFileSelect = async (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.pdf')) {
      showToast('Please upload a valid PDF document', 'error');
      return;
    }

    setIsLoading(true);
    setLoadingText('Reading PDF presentation…');

    try {
      const renderer = new PDFRenderer(null);
      const pages = await renderer.load(selectedFile);
      pdfRendererRef.current = renderer;

      setFile(selectedFile);
      setTotalPages(pages);
      setCurrentPage(1);

      setLoadingText('Starting AI gesture camera…');

      // Initialize gesture engine
      const engine = new GestureEngine({
        videoElement: videoRef.current,
        canvasElement: gestureCanvasRef.current,
        holdMs: 0, // instant detection
        cooldownMs: 1000,
        onHandDetected: (detected) => setHandDetected(detected),
        onGestureChange: (g) => setCurrentGesture(g),
        onGesture: (g) => handleGestureTrigger(g),
      });

      gestureEngineRef.current = engine;

      // Start engine shortly after viewer mounts
      setTimeout(async () => {
        try {
          if (videoRef.current && gestureCanvasRef.current) {
            engine.setElements(videoRef.current, gestureCanvasRef.current);
          }
          await engine.start();
        } catch (camErr) {
          console.warn('Camera error:', camErr);
          showToast('Camera permission required for gesture control', 'error');
        }
      }, 300);

      setIsLoading(false);
      showToast(`Loaded "${selectedFile.name}" (${pages} slides)`, 'success');
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      showToast(err.message || 'Failed to open PDF', 'error');
    }
  };

  // Exit viewer and reset
  const handleClose = () => {
    if (gestureEngineRef.current) {
      gestureEngineRef.current.stop();
      gestureEngineRef.current = null;
    }
    if (pdfRendererRef.current) {
      pdfRendererRef.current.unload();
      pdfRendererRef.current = null;
    }
    setFile(null);
    setTotalPages(0);
    setCurrentPage(1);
    setCurrentGesture('none');
    setHandDetected(false);
    showToast('Exited presentation', 'info');
  };

  // Keyboard navigation
  useEffect(() => {
    if (!file) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          e.preventDefault();
          setCurrentPage((p) => Math.min(totalPages, p + 1));
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          setCurrentPage((p) => Math.max(1, p - 1));
          break;
        case 'Home':
          e.preventDefault();
          setCurrentPage(1);
          break;
        case 'End':
          e.preventDefault();
          setCurrentPage(totalPages);
          break;
        case 'Escape':
          handleClose();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [file, totalPages]);

  return (
    <main className="fixed inset-0 flex flex-col bg-background text-zinc-100 overflow-hidden font-sans">
      {!file ? (
        <DropZone onFileSelect={handleFileSelect} />
      ) : (
        <Viewer
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onClose={handleClose}
          pdfRenderer={pdfRendererRef.current}
          currentGesture={currentGesture}
          handDetected={handDetected}
          flashTrigger={flashTrigger}
          camVisible={camVisible}
          onToggleCam={() => setCamVisible((v) => !v)}
          videoRef={videoRef}
          gestureCanvasRef={gestureCanvasRef}
        />
      )}

      {/* Hidden elements for webcam when Viewer isn't active or when passing refs */}
      <LoadingOverlay isVisible={isLoading} message={loadingText} />
      <Toast toast={toast} />
    </main>
  );
}
