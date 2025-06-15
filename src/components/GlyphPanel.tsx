
import React, { useRef, useEffect } from 'react';
import { X } from 'lucide-react';

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

  // Lista de caracteres especiais e símbolos
  const glyphCategories = {
    symbols: ['!', '"', '#', '$', '%', '&'],
    punctuation: ['.', '(', ')', '*', '+', ','],
    numbers: ['-', '.', '/', '0', '1', '2'],
    moreNumbers: ['3', '4', '5', '6', '7', '8'],
    evenMore: ['9', ':', ';', '<', '=', '>'],
    letters1: ['?', '@', 'A', 'B', 'C', 'D'],
    letters2: ['E', 'F', 'G', 'H', 'I', 'J'],
    letters3: ['K', 'L', 'M', 'N', 'O', 'P'],
    letters4: ['Q', 'R', 'S', 'T', 'U', 'V'],
    letters5: ['W', 'X', 'Y', 'Z', '[', '\\'],
    lowercase1: [']', '^', '_', '`', 'a', 'b'],
    lowercase2: ['c', 'd', 'e', 'f', 'g', 'h'],
    lowercase3: ['i', 'j', 'k', 'l', 'm', 'n']
  };

  const handleGlyphSelect = (glyph: string) => {
    console.log('Glyph selected:', glyph);
    // TODO: Implement glyph insertion functionality
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
      <div className="text-panel-container w-72">
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
            <h3 className="text-lg font-semibold text-slate-200 mb-1">Insert</h3>
            <h4 className="text-sm text-slate-400">Glyph</h4>
          </div>

          {/* Glyph Grid */}
          <div className="space-y-2">
            {Object.entries(glyphCategories).map(([category, glyphs]) => (
              <div key={category} className="grid grid-cols-6 gap-1">
                {glyphs.map((glyph, index) => (
                  <button
                    key={`${category}-${index}`}
                    className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded text-white text-sm font-mono flex items-center justify-center transition-colors"
                    onClick={() => handleGlyphSelect(glyph)}
                    title={`Insert "${glyph}"`}
                  >
                    {glyph}
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* Space button */}
          <div className="mt-4">
            <button
              className="w-full bg-slate-700 hover:bg-slate-600 rounded px-4 py-2 text-white text-sm transition-colors"
              onClick={() => handleGlyphSelect(' ')}
              title="Insert space"
            >
              Space
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
