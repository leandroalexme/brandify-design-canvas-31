
import React from 'react';
import { Plus } from 'lucide-react';

interface ColorPreviewProps {
  selectedColor: string;
  opacity: number;
  hue: number;
  saturation: number;
  lightness: number;
  onAddToPalette: () => void;
}

export const ColorPreview = ({ 
  selectedColor, 
  opacity, 
  hue, 
  saturation, 
  lightness, 
  onAddToPalette 
}: ColorPreviewProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="relative w-12 h-8 rounded">
          <div 
            className="absolute inset-0 rounded"
            style={{
              background: `repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 4px 4px`
            }}
          />
          <div 
            className="absolute inset-0 rounded"
            style={{
              backgroundColor: selectedColor,
              opacity: opacity / 100
            }}
          />
        </div>
        
        <div className="text-xs font-mono text-slate-300 space-y-1">
          <div>H: {Math.round(hue)}°</div>
          <div>S: {Math.round(saturation)}%</div>
          <div>L: {Math.round(lightness)}%</div>
        </div>
      </div>
      
      <button
        className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center text-slate-300 hover:text-white transition-colors"
        title="Adicionar à paleta"
        onClick={onAddToPalette}
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};
