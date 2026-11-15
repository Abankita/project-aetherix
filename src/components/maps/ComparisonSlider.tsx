import React, { useState, useRef, useCallback } from 'react';
import { RotateCcw, Sliders, ChevronLeft, ChevronRight, AlertCircle, Layers } from 'lucide-react';

interface ComparisonSliderProps {
  beforeLabel?: string;
  afterLabel?: string;
  beforeRasterSrc?: string;
  afterRasterSrc?: string;
  isRasterConnected?: boolean;
  className?: string;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({
  beforeLabel = 'PRE-FIRE OBSERVATION (NBR)',
  afterLabel = 'POST-FIRE OBSERVATION (dNBR / Δσ0)',
  beforeRasterSrc,
  afterRasterSrc,
  isRasterConnected = false,
  className = '',
}) => {
  const [splitPos, setSplitPos] = useState<number>(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSplitPos(percentage);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      setSplitPos((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      setSplitPos((prev) => Math.min(100, prev + 5));
    } else if (e.key === 'Home') {
      setSplitPos(0);
    } else if (e.key === 'End') {
      setSplitPos(100);
    }
  };

  const handleReset = () => {
    setSplitPos(50);
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="slider"
      aria-valuenow={Math.round(splitPos)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Before and after comparison slider"
      className={`relative w-full h-[460px] md:h-[540px] rounded-2xl overflow-hidden select-none cursor-ew-resize focus:outline-none focus:ring-2 focus:ring-[#498ACF] shadow-lg border border-gray-200/80 bg-[#090D14] ${className}`}
    >
      {/* If processed raster data is not available, show honest scientific message */}
      {!isRasterConnected && (!beforeRasterSrc || !afterRasterSrc) ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-white font-mono space-y-3 z-0">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#498ACF]">
            <Layers className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-gray-200">
            Processed satellite imagery is not connected yet.
          </h4>
          <p className="text-xs text-gray-400 max-w-md leading-relaxed">
            Awaiting Cloud-Optimized GeoTIFF raster tile ingestion for Sentinel-2 MSI (pre/post NBR)
            and NISAR L-band SAR backscatter. Place GeoTIFF assets in{' '}
            <code className="text-[#22B8C7]">public/data/rasters/</code> or configure a COG tile
            proxy endpoint.
          </p>
          <div className="pt-2">
            <span className="px-3 py-1 rounded-full text-[10px] bg-white/10 text-gray-300 border border-white/15">
              SLIDER READY · DRAG ACTIVE (DEMO SWIPE SPLIT {Math.round(splitPos)}%)
            </span>
          </div>
        </div>
      ) : (
        <>
          {/* Background Layer: AFTER */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src={afterRasterSrc}
              alt="Post-Fire burn state"
              className="w-full h-full object-cover filter contrast-125 saturate-150"
            />
          </div>

          {/* Foreground Layer: BEFORE (Clipped) */}
          <div
            className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
            style={{ clipPath: `inset(0 ${100 - splitPos}% 0 0)` }}
          >
            <img
              src={beforeRasterSrc}
              alt="Pre-Fire healthy canopy state"
              className="w-full h-full object-cover filter brightness-95 saturate-110"
            />
          </div>
        </>
      )}

      {/* Vertical Divider Line */}
      <div
        className="absolute top-0 bottom-0 pointer-events-none"
        style={{ left: `${splitPos}%`, transform: 'translateX(-50%)' }}
      >
        <div className="w-0.5 h-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]" />

        {/* Handle Knob with icon */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white text-[#18191D] shadow-2xl flex items-center justify-center border border-gray-200 hover:scale-110 transition-transform cursor-ew-resize">
          <Sliders className="w-4 h-4 text-[#498ACF]" />
        </div>
      </div>

      {/* Before Label Badge (Left) */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="flex items-center gap-2 bg-[#121418]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white shadow-md">
          <ChevronLeft className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono text-xs font-semibold">{beforeLabel}</span>
        </div>
      </div>

      {/* After Label Badge (Right) */}
      <div className="absolute top-4 right-4 z-10 pointer-events-none">
        <div className="flex items-center gap-2 bg-[#121418]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white shadow-md">
          <span className="font-mono text-xs font-semibold">{afterLabel}</span>
          <ChevronRight className="w-3.5 h-3.5 text-red-400" />
        </div>
      </div>

      {/* Bottom Controls / Reset CTA */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="bg-[#121418]/80 backdrop-blur-md px-3 py-1 rounded-full text-white/80 font-mono text-[11px] border border-white/10 hidden sm:block">
          SPLIT: {Math.round(splitPos)}% · DRAG OR USE ARROW KEYS
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleReset();
          }}
          className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 hover:bg-white text-[#18191D] text-xs font-mono font-medium shadow-md border border-gray-200 transition-all active:scale-95 ml-auto cursor-pointer"
          title="Reset to 50% Center"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#498ACF] pointer-events-none" />
          <span className="pointer-events-none">RESET 50/50</span>
        </button>
      </div>
    </div>
  );
};
