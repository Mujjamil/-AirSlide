import React, { useEffect, useRef, useState, useCallback } from 'react';
import TopBar from './TopBar';
import BottomBar from './BottomBar';
import CameraWidget from './CameraWidget';
import GestureFlash from './GestureFlash';

export default function Viewer({
  totalPages,
  currentPage,
  onPageChange,
  onClose,
  pdfRenderer,
  currentGesture,
  handDetected,
  flashTrigger,
  camVisible,
  onToggleCam,
  videoRef,
  gestureCanvasRef,
}) {
  const slideCanvasRef = useRef(null);
  const [isBarVisible, setIsBarVisible] = useState(true);
  const [animClass, setAnimClass] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const hideTimerRef = useRef(null);
  const isTransitioningRef = useRef(false);

  // Auto-hide bottom bar after 3.5s inactivity
  const showControlsTemporarily = useCallback(() => {
    setIsBarVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setIsBarVisible(false);
    }, 3500);
  }, []);

  // Listen for mouse move & touch
  useEffect(() => {
    showControlsTemporarily();
    window.addEventListener('mousemove', showControlsTemporarily);
    window.addEventListener('touchstart', showControlsTemporarily);
    return () => {
      window.removeEventListener('mousemove', showControlsTemporarily);
      window.removeEventListener('touchstart', showControlsTemporarily);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [showControlsTemporarily]);

  // Handle Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (_) {}
  };

  // Render slide when currentPage changes
  useEffect(() => {
    let isMounted = true;

    async function renderCurrentSlide() {
      if (!pdfRenderer || !slideCanvasRef.current) return;
      pdfRenderer.setCanvas(slideCanvasRef.current);
      try {
        await pdfRenderer.renderPageFullScreen(currentPage);
      } catch (err) {
        console.error('Failed to render slide:', err);
      }
    }

    renderCurrentSlide();

    // Re-render on window resize
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (isMounted) renderCurrentSlide();
      }, 150);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [currentPage, pdfRenderer]);

  // Navigate with animation
  const handleNavigate = async (newPage, direction = 'next') => {
    if (isTransitioningRef.current || newPage === currentPage) return;
    if (newPage < 1 || newPage > totalPages) return;

    isTransitioningRef.current = true;
    const outAnim = direction === 'next' ? 'animate-slideOutLeft' : 'animate-slideOutRight';
    setAnimClass(outAnim);

    await new Promise((r) => setTimeout(r, 160));

    onPageChange(newPage);
    setAnimClass('animate-slideIn');

    await new Promise((r) => setTimeout(r, 180));
    setAnimClass('');
    isTransitioningRef.current = false;
  };

  return (
    <section className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden select-none">
      {/* Centered slide canvas */}
      <div className="relative flex items-center justify-center max-w-full max-h-full">
        <canvas
          ref={slideCanvasRef}
          aria-label="Slide content"
          className={`block max-w-screen max-h-screen w-auto h-auto object-contain transition-transform duration-150 ${animClass}`}
        />
      </div>

      {/* Center big gesture flash emoji */}
      <GestureFlash trigger={flashTrigger} />

      {/* Top Header Bar */}
      <TopBar
        currentPage={currentPage}
        totalPages={totalPages}
        camVisible={camVisible}
        onToggleCam={onToggleCam}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* Bottom Floating Bar */}
      <BottomBar
        isVisible={isBarVisible}
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={() => handleNavigate(currentPage - 1, 'prev')}
        onNext={() => handleNavigate(currentPage + 1, 'next')}
        onClose={onClose}
        onSelectPage={(p) => handleNavigate(p, p > currentPage ? 'next' : 'prev')}
        pdfRenderer={pdfRenderer}
      />

      {/* Floating Camera Widget */}
      <CameraWidget
        camVisible={camVisible}
        currentGesture={currentGesture}
        handDetected={handDetected}
        videoRef={videoRef}
        canvasRef={gestureCanvasRef}
      />
    </section>
  );
}
