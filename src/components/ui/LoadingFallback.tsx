import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingFallback: React.FC = () => {
  return (
    <div className="w-full min-h-[400px] flex flex-col items-center justify-center gap-3 text-[#626873] font-mono text-xs">
      <Loader2 className="w-6 h-6 animate-spin text-[#498ACF]" />
      <span>LOADING TELEMETRY MODULE...</span>
    </div>
  );
};
