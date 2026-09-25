import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Statement from './components/Statement';
import GestureShowcase from './components/GestureShowcase';
import HowItWorks from './components/HowItWorks';
import LivePlayground from './components/LivePlayground';
import TechSpecs from './components/TechSpecs';
import Footer from './components/Footer';
import Viewer from './components/Viewer';
import CameraFeed from './components/CameraFeed';
import CustomCursor from './components/CustomCursor';
import Toast from './components/Toast';
import LoadingOverlay from './components/LoadingOverlay';
import { PDFRenderer } from './services/pdfRenderer';
import { GestureEngine } from './services/gestureEngine';
import { GESTURE_META, DEFAULT_EDITORIAL_SLIDES } from './constants/gestures';

export default function App() {
  const [file, setFile] = useState(null);
  const [totalPages, setTotalPages] = useState(DEFAULT_EDITORIAL_SLIDES.length);
  const [currentPage, setCurrentPage] = useState(1);
  const [presentationOpen, setPresentationOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading…');
  const [toast, setToast] = useState(null);

  // Gesture & Camera states
  const [currentGesture, setCurrentGesture] = useState('none');
  const [handDetected, setHandDetected] = useState(false);
  const [flashTrigger, setFlashTrigger] = useState(null);
  const [camVisible, setCamVisible] = useState(true);
  const [isCameraRunning, setIsCameraRunning] = useState(false);
  const [cameraMount, setCameraMount] = useState(null);

  // Service instances & element refs
  const pdfRendererRef = useRef(null);
  const gestureEngineRef = useRef(null);
  const videoRef = useRef(null);
  const gestureCanvasRef = useRef(null);
  const toastTimerRef = useRef(null);
  const totalPagesRef = useRef(DEFAULT_EDITORIAL_SLIDES.length);

  // Sync ref with totalPages
  useEffect(() => {
    totalPagesRef.current = totalPages;
  }, [totalPages]);

  const showToast = useCallback((message, type = 'info') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 3200);
  }, []);

  const triggerFlash = useCallback((icon, label, color) => {
    setFlashTrigger({ id: Date.now(), icon, label, color });
  }, []);

  // Handle gesture trigger from engine
  const handleGestureTrigger = useCallback(
    (gesture) => {
      const meta = GESTURE_META[gesture] || GESTURE_META.none;
      triggerFlash(meta.icon, meta.editorialAction || meta.label, meta.color);

      setCurrentPage((prev) => {
        const total = totalPagesRef.current;
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

  // Start Camera and Gesture Engine
  const startCamera = async () => {
    if (!window.Hands || !window.Camera) {
      showToast('MediaPipe dependencies still loading. Please retry.', 'error');
      return;
    }

    try {
      setIsLoading(true);
      setLoadingText('Initializing AI gesture vision…');

      if (!gestureEngineRef.current) {
        const engine = new GestureEngine({
          videoElement: videoRef.current,
          canvasElement: gestureCanvasRef.current,
          holdMs: 0, // Instant classification
          cooldownMs: 1000,
          onHandDetected: (detected) => setHandDetected(detected),
          onGestureChange: (g) => setCurrentGesture(g),
          onGesture: (g) => handleGestureTrigger(g),
        });
        gestureEngineRef.current = engine;
      } else {
        gestureEngineRef.current.setElements(videoRef.current, gestureCanvasRef.current);
      }

      await gestureEngineRef.current.start();
      setIsCameraRunning(true);
      setIsLoading(false);
      showToast('Camera active — raise your hand to command slides', 'success');
    } catch (err) {
      console.warn('Camera initiation failed:', err);
      setIsLoading(false);
      showToast('Camera access required for gesture control', 'error');
    }
  };

  const stopCamera = () => {
    if (gestureEngineRef.current) {
      gestureEngineRef.current.stop();
    }
    setIsCameraRunning(false);
    setHandDetected(false);
    setCurrentGesture('none');
    showToast('AI Camera feed stopped', 'info');
  };

  const toggleCamera = () => {
    if (isCameraRunning) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  // Handle PDF Upload
  const handleFileSelect = async (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.pdf')) {
      showToast('Please select a valid PDF presentation document', 'error');
      return;
    }

    setIsLoading(true);
    setLoadingText('Rasterizing PDF presentation vector layers…');

    try {
      if (pdfRendererRef.current) {
        pdfRendererRef.current.unload();
      }

      const renderer = new PDFRenderer(null);
      const pages = await renderer.load(selectedFile);
      pdfRendererRef.current = renderer;

      setFile(selectedFile);
      setTotalPages(pages);
      totalPagesRef.current = pages;
      setCurrentPage(1);

      setIsLoading(false);
      showToast(`Loaded "${selectedFile.name}" (${pages} slides)`, 'success');
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      showToast(err.message || 'Failed to parse PDF document', 'error');
    }
  };

  // Simulate gesture action directly from GestureShowcase
  const handleSimulateGesture = (gestureId) => {
    handleGestureTrigger(gestureId);
    showToast(`Simulated gesture: ${GESTURE_META[gestureId]?.editorialName || gestureId}`, 'info');
  };

  // Presentation Mode toggles
  const handleLaunchPresentation = () => {
    setPresentationOpen(true);
    // Auto-start camera if not already running for seamless demo
    if (!isCameraRunning) {
      startCamera();
    }
  };

  const handleClosePresentation = () => {
    setPresentationOpen(false);
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  };

  const scrollToDemo = () => {
    const demoEl = document.getElementById('demo');
    if (demoEl) {
      demoEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#ECE8E1] text-[#121316] font-sans selection:bg-[#121316] selection:text-[#ECE8E1]">
      <CustomCursor />

      {/* Navigation Header */}
      <Header
        onLaunchPresentation={handleLaunchPresentation}
        isPresentationOpen={presentationOpen}
      />

      {/* Main Editorial Landing Experience */}
      <main className="relative">
        <Hero
          onLaunchPresentation={handleLaunchPresentation}
          onScrollToDemo={scrollToDemo}
        />

        <Statement />

        <GestureShowcase onSimulateGesture={handleSimulateGesture} />

        <HowItWorks />

        <LivePlayground
          setCameraMount={setCameraMount}
          videoRef={videoRef}
          gestureCanvasRef={gestureCanvasRef}
          isCameraRunning={isCameraRunning}
          onToggleCamera={toggleCamera}
          currentGesture={currentGesture}
          handDetected={handDetected}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onLaunchPresentation={handleLaunchPresentation}
          pdfRenderer={pdfRendererRef.current}
          hasPdf={!!file}
          onFileUpload={handleFileSelect}
          pdfFileName={file?.name}
        />

        <TechSpecs />

        <Footer onLaunchPresentation={handleLaunchPresentation} />
      </main>

      {/* Fullscreen Presentation Mode Modal */}
      {presentationOpen && (
        <Viewer
          setCameraMount={setCameraMount}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onClose={handleClosePresentation}
          pdfRenderer={pdfRendererRef.current}
          hasPdf={!!file}
          pdfFileName={file?.name}
          currentGesture={currentGesture}
          handDetected={handDetected}
          flashTrigger={flashTrigger}
          camVisible={camVisible}
          onToggleCam={() => setCamVisible((v) => !v)}
        />
      )}

      {/* Persistent Portal for Camera Feed (Zero Reconnects) */}
      {cameraMount &&
        ReactDOM.createPortal(
          <CameraFeed videoRef={videoRef} canvasRef={gestureCanvasRef} />,
          cameraMount
        )}

      {/* Global Utilities */}
      <LoadingOverlay isVisible={isLoading} message={loadingText} />
      <Toast toast={toast} />
    </div>
  );
}
