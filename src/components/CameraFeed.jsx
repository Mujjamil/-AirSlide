import React from 'react';

export default function CameraFeed({ videoRef, canvasRef, className = '' }) {
  return (
    <div className={`relative w-full h-full bg-black overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        aria-label="Real-time webcam stream"
        className="w-full h-full object-cover -scale-x-100 block"
      />
      <canvas
        ref={canvasRef}
        width={320}
        height={240}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full -scale-x-100 pointer-events-none"
      />
    </div>
  );
}
