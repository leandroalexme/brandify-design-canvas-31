
import React, { useRef, useEffect, useState } from 'react';
import { X, ChevronDown, Search, FileType } from 'lucide-react';

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
  const [selectedFont, setSelectedFont] = useState('Roboto Sans');
  const [selectedWeight, setSelectedWeight] = useState('Regular');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showWeightDropdown, setShowWeightDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Available fonts with better organization
  const fonts = [
    { name: 'Roboto Sans', preview: 'Ag' },
    { name: 'Inter', preview: 'Ag' },
    { name: 'Arial', preview: 'Ag' },
    { name: 'Helvetica', preview: 'Ag' },
    { name: 'Times New Roman', preview: 'Ag' },
    { name: 'Georgia', preview: 'Ag' },
    { name: 'Playfair Display', preview: 'Ag' }
  ];

  const weights = ['Light', 'Regular', 'Medium', 'Semi Bold', 'Bold', 'Extra Bold'];

  // Categories with icons
  const categoryData = {
    'All': { icon: '🔤', glyphs: ['!', '"', '#', '$', '%', '&', '(', ')', '*', '+', ',', '-', '.', '/', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '?', '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_', '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'] },
    'Symbols': { icon: '🔣', glyphs: ['!', '"', '#', '$', '%', '&', '*', '+', '-', '/', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`'] },
    'Numbers': { icon: '🔢', glyphs: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] },
    'Punctuation': { icon: '❓', glyphs: ['.', ',', ';', ':', '(', ')', '!', '?'] },
    'Uppercase': { icon: '🔠', glyphs: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'] },
    'Lowercase': { icon: '🔡', glyphs: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'] }
  };

  const categories = Object.keys(categoryData);

  const handleGlyphSelect = (glyph: string) => {
    console.log('Glyph selected:', glyph, 'Font:', selectedFont, 'Weight:', selectedWeight);
    // TODO: Implement glyph insertion functionality
  };

  const getFontWeight = (weight: string) => {
    const weightMap: { [key: string]: string } = {
      'Light': '300',
      'Regular': '400',
      'Medium': '500',
      'Semi Bold': '600',
      'Bold': '700',
      'Extra Bold': '800'
    };
    return weightMap[weight] || '400';
  };

  // Filter glyphs based on search
  const filteredGlyphs = categoryData[selectedCategory as keyof typeof categoryData]?.glyphs.filter(glyph => 
    searchTerm === '' || glyph.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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
      <div className="floating-module w-80 overflow-hidden">
        {/* Header redesenhado */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/40">
          <div className="flex items-center gap-3">
            <FileType className="w-5 h-5 text-orange-400" />
            <span className="text-sm font-medium text-slate-200">Glyph Browser</span>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-lg bg-slate-700/60 hover:bg-red-500/80 
                     flex items-center justify-center text-slate-400 hover:text-white 
                     transition-all duration-100 hover:scale-105 active:scale-95"
            title="Fechar"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Font Selection com preview */}
          <div className="space-y-3">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
              Fonte
            </label>
            <div className="grid grid-cols-2 gap-2">
              {/* Font Family */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowFontDropdown(!showFontDropdown);
                    setShowWeightDropdown(false);
                    setShowCategoryDropdown(false);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-700/60 hover:bg-slate-600/80 text-slate-200 text-sm transition-colors"
                >
                  <span className="truncate">{selectedFont}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showFontDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showFontDropdown && (
                  <div className="absolute top-full mt-1 w-48 bg-slate-800 rounded-lg border border-slate-600 p-1 z-10 animate-fade-in-60fps">
                    {fonts.map((font) => (
                      <button
                        key={font.name}
                        onClick={() => {
                          setSelectedFont(font.name);
                          setShowFontDropdown(false);
                        }}
                        className={`w-full text-left p-2 rounded text-sm transition-colors ${
                          selectedFont === font.name 
                            ? 'bg-blue-500 text-white' 
                            : 'text-slate-200 hover:bg-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate">{font.name}</span>
                          <span style={{ fontFamily: font.name }} className="text-lg">{font.preview}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Font Weight */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowWeightDropdown(!showWeightDropdown);
                    setShowFontDropdown(false);
                    setShowCategoryDropdown(false);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-700/60 hover:bg-slate-600/80 text-slate-200 text-sm transition-colors"
                >
                  <span className="truncate">{selectedWeight}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showWeightDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showWeightDropdown && (
                  <div className="absolute top-full mt-1 w-full bg-slate-800 rounded-lg border border-slate-600 p-1 z-10 animate-fade-in-60fps">
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
            </div>
          </div>

          {/* Category Selection com ícones */}
          <div className="space-y-3">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
              Categoria
            </label>
            <div className="relative">
              <button
                onClick={() => {
                  setShowCategoryDropdown(!showCategoryDropdown);
                  setShowFontDropdown(false);
                  setShowWeightDropdown(false);
                }}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-700/60 hover:bg-slate-600/80 text-slate-200 text-sm transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span>{categoryData[selectedCategory as keyof typeof categoryData]?.icon}</span>
                  <span>{selectedCategory}</span>
                </div>
                <ChevronDown className={`w-3 h-3 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showCategoryDropdown && (
                <div className="absolute top-full mt-1 w-full bg-slate-800 rounded-lg border border-slate-600 p-1 z-10 animate-fade-in-60fps">
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
                      <div className="flex items-center gap-2">
                        <span>{categoryData[category as keyof typeof categoryData]?.icon}</span>
                        <span>{category}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="space-y-3">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar glyph..."
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-slate-700/60 border border-slate-600/40 focus:border-blue-500/60 text-slate-200 text-sm outline-none transition-colors"
              />
            </div>
          </div>

          {/* Glyph Grid otimizado */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Glyphs
              </label>
              <span className="text-xs text-slate-500">{filteredGlyphs.length} items</span>
            </div>
            <div className="grid grid-cols-6 gap-1 max-h-48 overflow-y-auto">
              {filteredGlyphs.map((glyph, index) => (
                <button
                  key={`${selectedCategory}-${index}`}
                  className="w-10 h-10 bg-slate-700/60 hover:bg-blue-500/80 rounded-lg text-white text-lg flex items-center justify-center transition-all duration-100 hover:scale-110"
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

          {/* Space button melhorado */}
          <button
            className="w-full bg-slate-700/60 hover:bg-blue-500/80 rounded-lg px-4 py-3 text-white text-sm transition-all duration-100 hover:scale-105 flex items-center justify-center gap-2"
            onClick={() => handleGlyphSelect(' ')}
            title="Insert space"
          >
            <span>␣</span>
            <span>Espaço</span>
          </button>
        </div>
      </div>
    </div>
  );
};
