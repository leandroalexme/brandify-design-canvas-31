
import React from 'react';
import { X } from 'lucide-react';

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  onClose: () => void;
}

export const ColorPicker = ({ selectedColor, onColorSelect, onClose }: ColorPickerProps) => {
  const colors = [
    '#4285F4', '#34A853', '#FBBC04', '#EA4335', '#9C27B0',
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#000000', '#424242', '#757575', '#BDBDBD', '#FFFFFF',
  ];

  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  ];

  return (
    <div className="floating-module p-4 w-72 animate-scale-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-200 text-sm">Cores</h3>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-lg bg-slate-700/60 hover:bg-slate-600/80 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-5 gap-2 mb-4">
        {colors.map((color) => (
          <button
            key={color}
            className={`w-10 h-10 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
              selectedColor === color ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-slate-600/60 hover:border-slate-500/80'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => onColorSelect(color)}
          />
        ))}
      </div>
      
      <h4 className="font-medium text-slate-300 mb-3 text-sm">Gradientes</h4>
      <div className="grid grid-cols-3 gap-2">
        {gradients.map((gradient, index) => (
          <button
            key={index}
            className="w-16 h-10 rounded-xl border-2 border-slate-600/60 hover:border-slate-500/80 hover:scale-105 transition-all duration-200"
            style={{ background: gradient }}
            onClick={() => onColorSelect(gradient)}
          />
        ))}
      </div>
    </div>
  );
};
