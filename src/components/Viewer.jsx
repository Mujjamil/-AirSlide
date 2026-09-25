import React, { useEffect, useRef, useState, useCallback } from 'react';
import TopBar from './TopBar';
import BottomBar from './BottomBar';
import CameraWidget from './CameraWidget';
import GestureFlash from './GestureFlash';
import SlideCanvas from './SlideCanvas';

export default function Viewer({
  setCameraMount,
  totalPages,
  currentPage,
  onPageChange,
  onClose,
  pdfRenderer,
  hasPdf,
  pdfFileName,
  currentGesture,
  handDetected,
  flashTrigger,
  camVisible,
  onToggleCam,
}) {
  const [isBarVisible, setIsBarVisible] = useState(true);
  const [animClass, setAnimClass] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const hideTimerRef = useRef(null);
  const isTransitioningRef = useRef(false);

  // Auto-hide controls after 3.5s inactivity
  const showControlsTemporarily = useCallback(() => {
    setIsBarVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setIsBarVisible(false);
    }, 3500);
  }, []);

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

  // Fullscreen change listener
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          e.preventDefault();
          handleNavigate(currentPage + 1, 'next');
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          handleNavigate(currentPage - 1, 'prev');
          break;
        case 'Home':
          e.preventDefault();
          handleNavigate(1, 'prev');
          break;
        case 'End':
          e.preventDefault();
          handleNavigate(totalPages, 'next');
          break;
        case 'Escape':
          onClose();
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages]);

  // Navigate with smooth animated slide transition
  const handleNavigate = async (newPage, direction = 'next') => {
    if (isTransitioningRef.current || newPage === currentPage) return;
    if (newPage < 1 || newPage > totalPages) return;

    isTransitioningRef.current = true;
    const outAnim = direction === 'next' ? 'animate-slideOutLeft' : 'animate-slideOutRight';
    setAnimClass(outAnim);

    await new Promise((r) => setTimeout(r, 140));

    onPageChange(newPage);
    setAnimClass('animate-slideIn');

    await new Promise((r) => setTimeout(r, 180));
    setAnimClass('');
    isTransitioningRef.current = false;
  };

  return (
    <section className="fixed inset-0 z-50 bg-[#0A0B0D] flex items-center justify-center overflow-hidden select-none">
      {/* Top Header Bar */}
      <TopBar
        currentPage={currentPage}
        totalPages={totalPages}
        camVisible={camVisible}
        onToggleCam={onToggleCam}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onClose={onClose}
        pdfFileName={pdfFileName}
      />

      {/* Main Slide Presentation Stage */}
      <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8 md:p-14">
        <div
          className={`relative max-w-6xl w-full max-h-[85vh] aspect-[16/10] flex items-center justify-center transition-transform duration-200 ${animClass}`}
        >
          <SlideCanvas
            pdfRenderer={pdfRenderer}
            hasPdf={hasPdf}
            currentPage={currentPage}
            totalPages={totalPages}
            aspectRatio="16/10"
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Editorial HUD Gesture Feedback */}
      <GestureFlash trigger={flashTrigger} />

      {/* Floating Bottom Navigation Drawer */}
      <BottomBar
        isVisible={isBarVisible}
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={() => handleNavigate(currentPage - 1, 'prev')}
        onNext={() => handleNavigate(currentPage + 1, 'next')}
        onClose={onClose}
        onSelectPage={(p) => handleNavigate(p, p > currentPage ? 'next' : 'prev')}
        pdfRenderer={pdfRenderer}
        hasPdf={hasPdf}
      />

      {/* Floating Camera Widget */}
      <CameraWidget
        setCameraMount={setCameraMount}
        camVisible={camVisible}
        currentGesture={currentGesture}
        handDetected={handDetected}
      />
    </section>
  );
}
