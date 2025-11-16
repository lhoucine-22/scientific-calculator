import React, { useEffect, useRef } from 'react';

interface DisplayProps {
  expression: string;
  result: string;
  angleUnit: 'DEG' | 'RAD';
}

export const Display: React.FC<DisplayProps> = ({ expression, result }) => {
  const displayRef = useRef<HTMLDivElement>(null);

  // Scroll to end on update
  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.scrollLeft = displayRef.current.scrollWidth;
    }
  }, [expression, result]);

  return (
    <div className="w-full mb-6 bg-gray-900/50 rounded-2xl p-6 shadow-inner border border-gray-800 relative overflow-hidden backdrop-blur-sm">
      <div className="absolute top-0 left-0 w-1 h-full bg-brand-500/50"></div>
      
      {/* Expression (Upper small text) */}
      <div 
        ref={displayRef}
        className="w-full overflow-x-auto whitespace-nowrap scrollbar-hide text-right mb-2"
      >
        <span className="text-gray-400 font-mono text-lg tracking-wide">
          {expression || '\u00A0'}
        </span>
      </div>

      {/* Result (Lower large text) */}
      <div className="w-full text-right overflow-hidden">
        <span className={`
          font-mono font-light text-white tracking-tight transition-all duration-200
          ${result.length > 12 ? 'text-3xl' : 'text-5xl'}
          ${!result && !expression ? 'text-gray-700' : ''}
        `}>
          {result || (expression ? '' : '0')}
        </span>
      </div>
    </div>
  );
};