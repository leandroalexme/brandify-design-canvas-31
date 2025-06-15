
import React, { useRef, useEffect, useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

interface GlyphPanelProps {
  isOpen: boolean;
  onClose: () => void;
  position?: { x: number; y: number };
}

export const GlyphPanel = ({ 
  isOpen, 
  onClose, 
  position = { x: 120, y: 200 }
}: GlyphPanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [selectedFont, setSelectedFont] = useState('Benton Sans');
  const [selectedWeight, setSelectedWeight] = useState('Regular');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showWeightDropdown, setShowWeightDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Available fonts
  const fonts = [
    'Benton Sans',
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Roboto',
    'Inter',
    'Playfair Display'
  ];

  // Available weights
  const weights = [
    'Light',
    'Regular',
    'Medium',
    'Semi Bold',
    'Bold',
    'Extra Bold',
    'Black'
  ];

  // Categories with their respective glyphs
  const glyphCategories = {
    'All': ['!', '"', '#', '$', '%', '&', '(', ')', '*', '+', ',', '-', '.', '/', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '?', '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_', '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'],
    'Symbols': ['!', '"', '#', '$', '%', '&', '*', '+', '-', '/', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`'],
    'Numbers': ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    'Punctuation': ['.', ',', ';', ':', '(', ')', '!', '?'],
    'Uppercase': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    'Lowercase': ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
  };

  const categories = Object.keys(glyphCategories);

  const handleGlyphSelect = (glyph: string) => {
    console.log('Glyph selected:', glyph, 'Font:', selectedFont, 'Weight:', selectedWeight);
    // TODO: Implement glyph insertion functionality
  };

  // Convert weight name to CSS font-weight value
  const getFontWeight = (weight: string) => {
    const weightMap: { [key: string]: string } = {
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

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentGlyphs = glyphCategories[selectedCategory as keyof typeof glyphCategories] || glyphCategories.All;

  return (
    <div 
      ref={panelRef}
      className="fixed z-[500] animate-scale-in-60fps"
      style={{
        left: position.x,
        top: position.y
      }}
      data-glyph-panel
    >
      <div className="text-panel-container w-80">
        {/* Header */}
        <div className="text-panel-header">
          <div className="text-panel-indicator" />
          <button
            onClick={onClose}
            className="text-panel-close-button"
            title="Fechar"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Insert header */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-200 mb-1">Glyph Browser</h3>
          </div>

          {/* Font Selection */}
          <div className="relative">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
              Font Family
            </label>
            <button
              onClick={() => {
                setShowFontDropdown(!showFontDropdown);
                setShowWeightDropdown(false);
                setShowCategoryDropdown(false);
              }}
              className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm transition-colors"
            >
              <span>{selectedFont}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFontDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showFontDropdown && (
              <div className="absolute top-full mt-1 w-full bg-slate-800 rounded-lg border border-slate-600 p-1 z-10">
                {fonts.map((font) => (
                  <button
                    key={font}
                    onClick={() => {
                      setSelectedFont(font);
                      setShowFontDropdown(false);
                    }}
                    className={`w-full text-left p-2 rounded text-sm transition-colors ${
                      selectedFont === font 
                        ? 'bg-blue-500 text-white' 
                        : 'text-slate-200 hover:bg-slate-700'
                    }`}
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Weight Selection */}
          <div className="relative">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
              Font Weight
            </label>
            <button
              onClick={() => {
                setShowWeightDropdown(!showWeightDropdown);
                setShowFontDropdown(false);
                setShowCategoryDropdown(false);
              }}
              className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm transition-colors"
            >
              <span>{selectedWeight}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showWeightDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showWeightDropdown && (
              <div className="absolute top-full mt-1 w-full bg-slate-800 rounded-lg border border-slate-600 p-1 z-10">
                {weights.map((weight) => (
                  <button
                    key={weight}
                    onClick={() => {
                      setSelectedWeight(weight);
                      setShowWeightDropdown(false);
                    }}
                    className={`w-full text-left p-2 rounded text-sm transition-colors ${
                      selectedWeight === weight 
                        ? 'bg-blue-500 text-white' 
                        : 'text-slate-200 hover:bg-slate-700'
                    }`}
                    style={{ fontWeight: getFontWeight(weight) }}
                  >
                    {weight}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Category Selection */}
          <div className="relative">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
              Category
            </label>
            <button
              onClick={() => {
                setShowCategoryDropdown(!showCategoryDropdown);
                setShowFontDropdown(false);
                setShowWeightDropdown(false);
              }}
              className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm transition-colors"
            >
              <span>{selectedCategory}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showCategoryDropdown && (
              <div className="absolute top-full mt-1 w-full bg-slate-800 rounded-lg border border-slate-600 p-1 z-10">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowCategoryDropdown(false);
                    }}
                    className={`w-full text-left p-2 rounded text-sm transition-colors ${
                      selectedCategory === category 
                        ? 'bg-blue-500 text-white' 
                        : 'text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Glyph Grid */}
          <div className="space-y-2">
            <div className="grid grid-cols-6 gap-1 max-h-48 overflow-y-auto">
              {currentGlyphs.map((glyph, index) => (
                <button
                  key={`${selectedCategory}-${index}`}
                  className="w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded text-white text-lg flex items-center justify-center transition-colors"
                  onClick={() => handleGlyphSelect(glyph)}
                  title={`Insert "${glyph}"`}
                  style={{
                    fontFamily: selectedFont,
                    fontWeight: getFontWeight(selectedWeight)
                  }}
                >
                  {glyph}
                </button>
              ))}
            </div>
          </div>

          {/* Space button */}
          <div className="mt-4">
            <button
              className="w-full bg-slate-700 hover:bg-slate-600 rounded px-4 py-2 text-white text-sm transition-colors"
              onClick={() => handleGlyphSelect(' ')}
              title="Insert space"
              style={{
                fontFamily: selectedFont,
                fontWeight: getFontWeight(selectedWeight)
              }}
            >
              Space
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
