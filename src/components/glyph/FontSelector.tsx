
import React from 'react';
import { ChevronDown } from 'lucide-react';

interface Font {
  name: string;
  preview: string;
}

interface FontSelectorProps {
  selectedFont: string;
  selectedWeight: string;
  onFontChange: (font: string) => void;
  onWeightChange: (weight: string) => void;
  showFontDropdown: boolean;
  showWeightDropdown: boolean;
  onToggleFontDropdown: () => void;
  onToggleWeightDropdown: () => void;
}

const fonts: Font[] = [
  { name: 'Inter', preview: 'Ag' },
  { name: 'Roboto', preview: 'Ag' },
  { name: 'Helvetica Neue', preview: 'Ag' },
  { name: 'Arial', preview: 'Ag' },
  { name: 'SF Pro Display', preview: 'Ag' },
  { name: 'Segoe UI', preview: 'Ag' },
  { name: 'Times New Roman', preview: 'Ag' },
  { name: 'Georgia', preview: 'Ag' },
  { name: 'Playfair Display', preview: 'Ag' },
  { name: 'Montserrat', preview: 'Ag' }
];

const weights = ['Thin', 'Light', 'Regular', 'Medium', 'Semi Bold', 'Bold', 'Extra Bold', 'Black'];

export const FontSelector = ({
  selectedFont,
  selectedWeight,
  onFontChange,
  onWeightChange,
  showFontDropdown,
  showWeightDropdown,
  onToggleFontDropdown,
  onToggleWeightDropdown
}: FontSelectorProps) => {
  const getFontWeight = (weight: string): string => {
    const weightMap: { [key: string]: string } = {
      'Thin': '100',
      'Light': '300',
      'Regular': '400',
      'Medium': '500',
      'Semi Bold': '600',
      'Bold': '700',
      'Extra Bold': '800',
      'Black': '900'
    };
    return weightMap[weight] || '400';
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
        Tipografia
      </label>
      <div className="grid grid-cols-2 gap-3">
        {/* Font Family */}
        <div className="relative">
          <button
            onClick={onToggleFontDropdown}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-700/40 
                     hover:bg-slate-600/60 border border-slate-600/30 hover:border-slate-500/50
                     text-slate-200 text-sm transition-all duration-150"
          >
            <span className="truncate font-medium">{selectedFont}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFontDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {showFontDropdown && (
            <div className="absolute top-full mt-2 w-64 bg-slate-800/95 backdrop-blur-sm rounded-xl 
                          border border-slate-600/40 shadow-2xl p-2 z-10 animate-scale-in max-h-64 overflow-y-auto">
              {fonts.map((font) => (
                <button
                  key={font.name}
                  onClick={() => {
                    onFontChange(font.name);
                  }}
                  className={`w-full text-left p-3 rounded-lg text-sm transition-all duration-150 ${
                    selectedFont === font.name 
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' 
                      : 'text-slate-200 hover:bg-slate-700/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate font-medium">{font.name}</span>
                    <span 
                      style={{ fontFamily: font.name }} 
                      className="text-lg font-medium ml-2"
                    >
                      {font.preview}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Font Weight */}
        <div className="relative">
          <button
            onClick={onToggleWeightDropdown}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-700/40 
                     hover:bg-slate-600/60 border border-slate-600/30 hover:border-slate-500/50
                     text-slate-200 text-sm transition-all duration-150"
          >
            <span className="truncate font-medium">{selectedWeight}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showWeightDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {showWeightDropdown && (
            <div className="absolute top-full mt-2 w-full bg-slate-800/95 backdrop-blur-sm rounded-xl 
                          border border-slate-600/40 shadow-2xl p-2 z-10 animate-scale-in max-h-48 overflow-y-auto">
              {weights.map((weight) => (
                <button
                  key={weight}
                  onClick={() => {
                    onWeightChange(weight);
                  }}
                  className={`w-full text-left p-3 rounded-lg text-sm transition-all duration-150 ${
                    selectedWeight === weight 
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' 
                      : 'text-slate-200 hover:bg-slate-700/60'
                  }`}
                  style={{ fontWeight: getFontWeight(weight) }}
                >
                  {weight}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
