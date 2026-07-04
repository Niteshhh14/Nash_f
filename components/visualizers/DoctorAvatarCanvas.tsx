'use client';

import React, { useEffect, useRef, useState } from 'react';

interface DoctorAvatarCanvasProps {
  width?: number;
  height?: number;
  className?: string;
  startFrame?: number;
  endFrame?: number;
}

export const DoctorAvatarCanvas: React.FC<DoctorAvatarCanvasProps> = ({
  width = 320,
  height = 320,
  className,
  startFrame = 0,
  endFrame = 239
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  
  const frameCount = 240;
  const currentFrameRef = useRef(startFrame);
  const animationFrameIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef(0);
  const isVisibleRef = useRef(true);

  // Sync current frame when startFrame changes
  useEffect(() => {
    currentFrameRef.current = startFrame;
  }, [startFrame]);

  // Preload frames in background
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];
    let isMounted = true;

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/avatar/frame_${frameNum}_delay-0.041s.png`;
      
      img.onload = () => {
        if (!isMounted) return;
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / frameCount) * 100));
        
        if (loadedCount === frameCount) {
          setImages(loadedImages);
          setIsLoaded(true);
        }
      };

      img.onerror = () => {
        if (!isMounted) return;
        loadedCount++;
        if (loadedCount === frameCount) {
          setImages(loadedImages);
          setIsLoaded(true);
        }
      };

      loadedImages[i] = img;
    }

    return () => {
      isMounted = false;
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  // Intersection Observer to pause when offscreen
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );

    const targetEl = canvas;
    observer.observe(targetEl);
    return () => observer.disconnect();
  }, []);

  // Animation Loop
  useEffect(() => {
    if (!isLoaded || images.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI Retina displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const frameDelay = 41; // 41ms per frame (approx 24 FPS)

    const tick = (timestamp: number) => {
      if (!isVisibleRef.current) {
        animationFrameIdRef.current = requestAnimationFrame(tick);
        return;
      }

      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = timestamp;
      }

      const elapsed = timestamp - lastFrameTimeRef.current;

      if (elapsed >= frameDelay) {
        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw current frame centered with proper aspect ratio containment and center cropping
        const currentImg = images[currentFrameRef.current];
        if (currentImg && currentImg.complete) {
          const imgWidth = currentImg.width;
          const imgHeight = currentImg.height;
          
          if (imgWidth > imgHeight) {
            // Landscape format with black side borders (e.g. 16:9). Crop square center.
            const size = imgHeight;
            const sx = (imgWidth - size) / 2;
            const sy = 0;
            ctx.drawImage(currentImg, sx, sy, size, size, 0, 0, width, height);
          } else {
            // Standard square or portrait. Fit to canvas.
            const scale = Math.min(width / imgWidth, height / imgHeight);
            const x = (width - imgWidth * scale) / 2;
            const y = (height - imgHeight * scale) / 2;
            ctx.drawImage(currentImg, x, y, imgWidth * scale, imgHeight * scale);
          }
        }

        // Advance to next frame within limits
        const nextFrame = currentFrameRef.current + 1;
        if (nextFrame > endFrame || nextFrame < startFrame) {
          currentFrameRef.current = startFrame;
        } else {
          currentFrameRef.current = nextFrame;
        }
        lastFrameTimeRef.current = timestamp - (elapsed % frameDelay);
      }

      animationFrameIdRef.current = requestAnimationFrame(tick);
    };

    animationFrameIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isLoaded, images, width, height, startFrame, endFrame]);

  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-transparent ${className}`} style={{ width, height }}>
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FAF8F5]/60 backdrop-blur-sm z-10 space-y-3">
          <div className="h-6 w-6 rounded-full border-2 border-[#C7A37E] border-t-transparent animate-spin" />
          <span className="text-[10px] font-bold text-[#4E3629]/70 uppercase tracking-widest">
            Surveillance Syncing ({loadProgress}%)
          </span>
        </div>
      )}
      <canvas
        ref={canvasRef}
        style={{ width, height }}
        className="w-full h-full object-contain bg-transparent"
      />
    </div>
  );
};
