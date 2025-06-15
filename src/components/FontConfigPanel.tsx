
import React, { useState } from 'react';
import { ChevronDown, Minus, Plus, Bold, Italic, Underline } from 'lucide-react';

interface FontConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number };
}

export const FontConfigPanel = ({ isOpen, onClose, position }: FontConfigPanelProps) => {
  const [selectedFont, setSelectedFont] = useState('Roboto Sans');
  const [selectedWeight, setSelectedWeight] = useState('Extra Bold');
  const [fontSize, setFontSize] = useState(15);
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showWeightDropdown, setShowWeightDropdown] = useState(false);

  if (!isOpen) return null;

  const fonts = ['Roboto Sans', 'Inter', 'Arial', 'Helvetica', 'Times New Roman'];
  const weights = ['Light', 'Regular', 'Medium', 'Semi Bold', 'Bold', 'Extra Bold'];

  const handleFontSizeDecrease = () => {
    setFontSize(prev => Math.max(8, prev - 1));
  };

  const handleFontSizeIncrease = () => {
    setFontSize(prev => Math.min(72, prev + 1));
  };

  return (
    <div 
      className="fixed z-[500] animate-scale-in-60fps"
      style={{ 
        left: position.x - 140, 
        top: position.y - 280
      }}
    >
      <div className="floating-module w-80 p-6 space-y-4">
        {/* Font Family Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowFontDropdown(!showFontDropdown)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-700/60 hover:bg-slate-600/80 border border-slate-600/40 text-slate-200 transition-all duration-100"
          >
            <span className="text-lg font-medium">{selectedFont}</span>
            <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${showFontDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {showFontDropdown && (
            <div className="absolute top-full mt-2 w-full floating-module p-2 animate-fade-in-60fps">
              {fonts.map((font) => (
                <button
                  key={font}
                  onClick={() => {
                    setSelectedFont(font);
                    setShowFontDropdown(false);
                  }}
                  className="w-full text-left p-3 rounded-lg hover:bg-slate-700/50 text-slate-200 transition-colors duration-100"
                >
                  {font}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Font Weight Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowWeightDropdown(!showWeightDropdown)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-700/60 hover:bg-slate-600/80 border border-slate-600/40 text-slate-200 transition-all duration-100"
          >
            <span className="text-lg font-medium">{selectedWeight}</span>
            <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${showWeightDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {showWeightDropdown && (
            <div className="absolute top-full mt-2 w-full floating-module p-2 animate-fade-in-60fps">
              {weights.map((weight) => (
                <button
                  key={weight}
                  onClick={() => {
                    setSelectedWeight(weight);
                    setShowWeightDropdown(false);
                  }}
                  className="w-full text-left p-3 rounded-lg hover:bg-slate-700/50 text-slate-200 transition-colors duration-100"
                >
                  {weight}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Font Size Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleFontSizeDecrease}
            className="w-12 h-12 rounded-full bg-slate-700/60 hover:bg-slate-600/80 border border-slate-600/40 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-100 hover:scale-105"
          >
            <Minus className="w-5 h-5" />
          </button>
          
          <span className="text-2xl font-bold text-slate-200 min-w-[80px] text-center">
            {fontSize}px
          </span>
          
          <button
            onClick={handleFontSizeIncrease}
            className="w-12 h-12 rounded-full bg-blue-500/80 hover:bg-blue-400/90 border border-blue-400/60 flex items-center justify-center text-white transition-all duration-100 hover:scale-105"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Text Style Controls */}
        <div className="flex items-center justify-between">
          <button className="w-12 h-12 rounded-full bg-slate-700/60 hover:bg-slate-600/80 border border-slate-600/40 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-100 hover:scale-105">
            <Bold className="w-5 h-5" />
          </button>
          
          <button className="w-12 h-12 rounded-full bg-slate-700/60 hover:bg-slate-600/80 border border-slate-600/40 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-100 hover:scale-105">
            <Italic className="w-5 h-5" />
          </button>
          
          <button className="w-12 h-12 rounded-full bg-slate-700/60 hover:bg-slate-600/80 border border-slate-600/40 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-100 hover:scale-105">
            <Underline className="w-5 h-5" />
          </button>
          
          <button className="w-12 h-12 rounded-full bg-slate-700/60 hover:bg-slate-600/80 border border-slate-600/40 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-100 hover:scale-105">
            <span className="text-sm font-bold">AB</span>
          </button>
        </div>
      </div>
    </div>
  );
};
