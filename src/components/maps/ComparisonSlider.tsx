import React, { useState, useRef, useCallback } from 'react';
import { RotateCcw, Sliders, ChevronLeft, ChevronRight, Layers, Eye, Calendar, Sparkles } from 'lucide-react';

interface ComparisonSliderProps {
  beforeLabel?: string;
  afterLabel?: string;
  beforeDate?: string;
  afterDate?: string;
  beforeRasterSrc?: string;
  afterRasterSrc?: string;
  isRasterConnected?: boolean;
  activeLayer?: 'pre-nbr' | 'post-nbr' | 'dnbr';
  onLayerChange?: (layer: 'pre-nbr' | 'post-nbr' | 'dnbr') => void;
  className?: string;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({
  beforeLabel = 'SENTINEL-2 PRE-FIRE (NBR)',
  afterLabel = 'SENTINEL-2 POST-FIRE (dNBR)',
  beforeDate = 'Pre-fire phase',
  afterDate = 'Post-fire phase',
  beforeRasterSrc,
  afterRasterSrc,
  isRasterConnected = false,
  activeLayer = 'dnbr',
  onLayerChange,
  className = '',
}) => {
  const [splitPos, setSplitPos] = useState<number>(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [opacity, setOpacity] = useState<number>(90); // 0 - 100
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
    <div className={`space-y-3 ${className}`}>
      {/* Contextual Toolbar: Layer Selector + Opacity Slider + Reset */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-2xl bg-white dark:bg-[#111C28] border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] shadow-xs">
        {/* Layer Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#858B95] dark:text-[#788796] font-semibold hidden sm:inline">
            Observation Layer:
          </span>
          <div className="flex items-center p-1 rounded-xl bg-gray-100 dark:bg-[#172330] border border-gray-200/60 dark:border-[rgba(160,180,195,0.12)]">
            <button
              type="button"
              onClick={() => onLayerChange?.('pre-nbr')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                activeLayer === 'pre-nbr'
                  ? 'bg-white dark:bg-[#1B293A] text-[#18191D] dark:text-[#F3F6F8] font-semibold shadow-2xs'
                  : 'text-[#626873] dark:text-[#AAB5C2] hover:text-[#18191D] dark:hover:text-[#F3F6F8]'
              }`}
            >
              Pre-Fire NBR
            </button>
            <button
              type="button"
              onClick={() => onLayerChange?.('post-nbr')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                activeLayer === 'post-nbr'
                  ? 'bg-white dark:bg-[#1B293A] text-[#18191D] dark:text-[#F3F6F8] font-semibold shadow-2xs'
                  : 'text-[#626873] dark:text-[#AAB5C2] hover:text-[#18191D] dark:hover:text-[#F3F6F8]'
              }`}
            >
              Post-Fire NBR
            </button>
            <button
              type="button"
              onClick={() => onLayerChange?.('dnbr')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                activeLayer === 'dnbr'
                  ? 'bg-white dark:bg-[#1B293A] text-[#F06470] dark:text-[#F06470] font-semibold shadow-2xs'
                  : 'text-[#626873] dark:text-[#AAB5C2] hover:text-[#18191D] dark:hover:text-[#F3F6F8]'
              }`}
            >
              dNBR (spectral change)
            </button>
          </div>
        </div>

        {/* Opacity Control & Reset */}
        <div className="flex items-center gap-4 ml-auto">
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#626873] dark:text-[#AAB5C2]">
            <Eye className="w-3.5 h-3.5 text-[#858B95] dark:text-[#788796]" />
            <span className="hidden sm:inline">Opacity:</span>
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#172330] p-0.5 rounded-lg border border-gray-200/60 dark:border-[rgba(160,180,195,0.12)]">
              {[50, 75, 100].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setOpacity(val)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all cursor-pointer ${
                    opacity === val
                      ? 'bg-white dark:bg-[#1B293A] text-[#18191D] dark:text-[#F3F6F8] font-bold shadow-2xs'
                      : 'text-[#626873] dark:text-[#AAB5C2] hover:text-[#18191D]'
                  }`}
                >
                  {val}%
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#172330] dark:hover:bg-[#1E2E40] text-[#18191D] dark:text-[#F3F6F8] text-xs font-mono font-medium border border-gray-200 dark:border-[rgba(160,180,195,0.12)] transition-all cursor-pointer"
            title="Reset Divider to 50/50 Center"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#498ACF]" />
            <span>RESET 50/50</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Comparison Map Container */}
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
        className="relative w-full h-[460px] md:h-[540px] rounded-2xl overflow-hidden select-none cursor-ew-resize focus:outline-none focus:ring-2 focus:ring-[#498ACF] shadow-md border border-gray-200/80 dark:border-[rgba(160,180,195,0.14)] bg-[#181A1E]"
      >
        {/* Layer 1: Background (Post-Fire / AFTER) */}
        <div className="absolute inset-0 w-full h-full bg-[#1A1C20] flex items-center justify-center overflow-hidden">
          {afterRasterSrc ? (
            <img
              src={afterRasterSrc}
              alt="Post-Fire burn state"
              className="w-full h-full object-cover filter contrast-125 saturate-150"
              style={{ opacity: opacity / 100 }}
            />
          ) : (
            /* Calibrated Simulated Big Sur Post-Fire Analytical Canvas */
            <div
              className="absolute inset-0 w-full h-full bg-[#202226] flex items-center justify-center transition-opacity"
              style={{ opacity: opacity / 100 }}
            >
              <svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="none">
                {/* Coastal ocean backdrop */}
                <rect width="320" height="600" fill="#141820" />
                <path d="M 320 0 Q 340 300 310 600 L 0 600 L 0 0 Z" fill="#171D27" />

                {/* Big Sur Coastal Mountains Post-Fire Scorch Mosaic */}
                <rect x="320" y="0" width="680" height="600" fill="#24262A" />

                {/* Timber Fire Perimeter Post-Burn (Orange/Charred) */}
                <polygon
                  points="380,80 540,110 590,210 510,260 410,220 370,140"
                  fill="rgba(244, 154, 72, 0.28)"
                  stroke="#F49A48"
                  strokeWidth="2.5"
                />
                <circle cx="480" cy="170" r="45" fill="rgba(240, 100, 112, 0.40)" />

                {/* Plaskett Fire Perimeter Post-Burn (Coral/Severe) */}
                <polygon
                  points="520,320 690,340 760,460 670,540 540,510 490,400"
                  fill="rgba(240, 100, 112, 0.32)"
                  stroke="#F06470"
                  strokeWidth="2.5"
                />
                <circle cx="620" cy="430" r="55" fill="rgba(235, 75, 85, 0.45)" />

                {/* HUC-12 Coastal Basins (Turquoise Dashed) */}
                <path
                  d="M 380,50 L 580,90 L 620,290 L 460,280 Z"
                  fill="rgba(41, 201, 210, 0.08)"
                  stroke="#29C9D2"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <path
                  d="M 460,280 L 620,290 L 780,480 L 530,550 Z"
                  fill="rgba(41, 201, 210, 0.08)"
                  stroke="#29C9D2"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Layer 2: Foreground Clipped (Pre-Fire / BEFORE) */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - splitPos}% 0 0)` }}
        >
          {beforeRasterSrc ? (
            <img
              src={beforeRasterSrc}
              alt="Pre-Fire healthy canopy state"
              className="w-full h-full object-cover filter brightness-95 saturate-110"
              style={{ opacity: opacity / 100 }}
            />
          ) : (
            /* Calibrated Pre-Fire Lush Canopy Analytical Canvas */
            <div
              className="absolute inset-0 w-full h-full bg-[#1B221E] flex items-center justify-center transition-opacity"
              style={{ opacity: opacity / 100 }}
            >
              <svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="none">
                {/* Coastal ocean backdrop */}
                <rect width="320" height="600" fill="#141820" />
                <path d="M 320 0 Q 340 300 310 600 L 0 600 L 0 0 Z" fill="#171D27" />

                {/* Pre-Fire Healthy Coastal Canopy (Intact Forest Greens) */}
                <rect x="320" y="0" width="680" height="600" fill="#202A22" />

                {/* Study Area Perimeters (Intact Vegetation) */}
                <polygon
                  points="380,80 540,110 590,210 510,260 410,220 370,140"
                  fill="rgba(67, 201, 154, 0.18)"
                  stroke="#43C99A"
                  strokeWidth="1.8"
                />
                <polygon
                  points="520,320 690,340 760,460 670,540 540,510 490,400"
                  fill="rgba(67, 201, 154, 0.18)"
                  stroke="#43C99A"
                  strokeWidth="1.8"
                />

                {/* HUC-12 Basins */}
                <path
                  d="M 380,50 L 580,90 L 620,290 L 460,280 Z"
                  fill="rgba(41, 201, 210, 0.08)"
                  stroke="#29C9D2"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <path
                  d="M 460,280 L 620,290 L 780,480 L 530,550 Z"
                  fill="rgba(41, 201, 210, 0.08)"
                  stroke="#29C9D2"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Raster Tile Notice Banner (when awaiting raw GeoTIFF files) */}
        {!isRasterConnected && (!beforeRasterSrc || !afterRasterSrc) && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 pointer-events-none max-w-lg w-[90%] text-center">
            <div className="bg-[#12161E]/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/15 text-white/90 shadow-xl space-y-1">
              <div className="flex items-center justify-center gap-2 text-xs font-mono font-semibold text-[#36C5D9]">
                <Layers className="w-3.5 h-3.5" />
                <span>ANALYTICAL VECTOR BASELINE ACTIVE</span>
              </div>
              <p className="text-[11px] text-gray-300 font-mono leading-relaxed">
                Awaiting Cloud-Optimized GeoTIFF raster assets in{' '}
                <code className="text-[#36C5D9]">public/data/rasters/</code>. Calibrated study area
                boundaries and burn indices rendered.
              </p>
            </div>
          </div>
        )}

        {/* Draggable Vertical Divider */}
        <div
          className="absolute top-0 bottom-0 pointer-events-none z-30"
          style={{ left: `${splitPos}%`, transform: 'translateX(-50%)' }}
        >
          <div className="w-0.5 h-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]" />

          {/* Centered Knob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white text-[#18191D] shadow-2xl flex items-center justify-center border border-gray-200 hover:scale-110 transition-transform cursor-ew-resize">
            <Sliders className="w-4 h-4 text-[#498ACF]" />
          </div>
        </div>

        {/* Before Label Badge (Left) */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none">
          <div className="bg-[#121418]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-white shadow-lg space-y-0.5">
            <div className="flex items-center gap-1.5">
              <ChevronLeft className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono text-xs font-bold text-white">{beforeLabel}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-300">
              <Calendar className="w-3 h-3" />
              <span>Window: {beforeDate}</span>
            </div>
          </div>
        </div>

        {/* After Label Badge (Right) */}
        <div className="absolute top-4 right-4 z-20 pointer-events-none">
          <div className="bg-[#121418]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-white shadow-lg space-y-0.5 text-right">
            <div className="flex items-center justify-end gap-1.5">
              <span className="font-mono text-xs font-bold text-white">{afterLabel}</span>
              <ChevronRight className="w-3.5 h-3.5 text-red-400" />
            </div>
            <div className="flex items-center justify-end gap-1 text-[10px] font-mono text-red-300">
              <Calendar className="w-3 h-3" />
              <span>Window: {afterDate}</span>
            </div>
          </div>
        </div>

        {/* Scientific Severity Legend (Bottom Left) */}
        <div className="absolute bottom-4 left-4 z-20 pointer-events-none hidden sm:block">
          <div className="bg-[#121418]/90 backdrop-blur-md px-3 py-2 rounded-xl border border-white/15 text-white shadow-lg space-y-1.5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-gray-300 font-bold">
              dNBR Spectral Change Indicator · Not Field-calibrated Severity
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#43C99A]" /> Lower values
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F49A48]" /> Higher values
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Status Indicator (Bottom Right) */}
        <div className="absolute bottom-4 right-4 z-20 pointer-events-none">
          <div className="bg-[#121418]/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-white/90 font-mono text-[11px] border border-white/15 shadow-md flex items-center gap-2">
            <span>SPLIT: {Math.round(splitPos)}%</span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-300 hidden md:inline">DRAG OR USE ARROW KEYS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
