
import React from 'react';

interface OpacitySliderProps {
  opacity: number;
  onOpacityChange: (opacity: number) => void;
}

export const OpacitySlider = ({ opacity, onOpacityChange }: OpacitySliderProps) => {
  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onOpacityChange(Number(e.target.value));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-300">Opacidade</span>
        <span className="text-sm text-slate-300 font-mono">{opacity}%</span>
      </div>
      
      <div className="relative">
        <div 
          className="w-full h-6 rounded-full"
          style={{
            background: `repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 8px 8px`
          }}
        />
        
        <div className="absolute inset-0 flex items-center">
          <input
            type="range"
            min="0"
            max="100"
            value={opacity}
            onChange={handleOpacityChange}
            className="w-full h-6 bg-transparent appearance-none cursor-pointer slider-opacity"
          />
        </div>
        
        <div 
          className="absolute w-6 h-6 bg-white border-2 border-slate-400 rounded-full shadow-lg pointer-events-none"
          style={{
            left: `${opacity}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />
      </div>
    </div>
  );
};
