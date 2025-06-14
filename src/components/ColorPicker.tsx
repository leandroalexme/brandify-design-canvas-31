
import React from 'react';

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
    <div className="floating-module p-6 w-80 animate-scale-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-200">Colors</h3>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-300"
        >
          ×
        </button>
      </div>
      
      <div className="grid grid-cols-5 gap-3 mb-6">
        {colors.map((color) => (
          <button
            key={color}
            className={`w-12 h-12 rounded-2xl border-4 transition-all duration-200 ${
              selectedColor === color ? 'border-blue-500 scale-105' : 'border-slate-600 hover:border-slate-500'
            } hover:scale-105`}
            style={{ backgroundColor: color }}
            onClick={() => onColorSelect(color)}
          />
        ))}
      </div>
      
      <h4 className="font-medium text-slate-300 mb-3">Gradients</h4>
      <div className="grid grid-cols-3 gap-3">
        {gradients.map((gradient, index) => (
          <button
            key={index}
            className="w-16 h-12 rounded-2xl border-4 border-slate-600 hover:border-slate-500 hover:scale-105 transition-all duration-200"
            style={{ background: gradient }}
            onClick={() => onColorSelect(gradient)}
          />
        ))}
      </div>
    </div>
  );
};
