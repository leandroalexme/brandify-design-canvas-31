
import React from 'react';

interface GlyphGridProps {
  glyphs: string[];
  selectedFont: string;
  selectedWeight: string;
  onGlyphSelect: (glyph: string) => void;
}

export const GlyphGrid = ({ glyphs, selectedFont, selectedWeight, onGlyphSelect }: GlyphGridProps) => {
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          Glyphs Disponíveis
        </label>
        <div className="px-2 py-1 rounded-lg bg-slate-700/40 text-xs text-slate-400">
          {glyphs.length} items
        </div>
      </div>
      
      <div className="grid grid-cols-8 gap-2 max-h-64 overflow-y-auto p-1">
        {glyphs.map((glyph, index) => (
          <button
            key={`glyph-${index}`}
            className="w-10 h-10 bg-slate-700/40 hover:bg-orange-500/20 hover:border-orange-400/50
                     border border-slate-600/30 rounded-lg text-white text-base flex items-center 
                     justify-center transition-all duration-150 hover:scale-110 active:scale-95
                     animate-stagger-fade"
            style={{
              animationDelay: `${index * 0.01}s`,
              animationFillMode: 'both'
            }}
            onClick={() => onGlyphSelect(glyph)}
            title={`Inserir "${glyph}"`}
          >
            <span
              style={{
                fontFamily: selectedFont,
                fontWeight: getFontWeight(selectedWeight)
              }}
            >
              {glyph}
            </span>
          </button>
        ))}
      </div>

      {/* Space button */}
      <button
        className="w-full bg-slate-700/40 hover:bg-orange-500/20 hover:border-orange-400/50
                 border border-slate-600/30 rounded-xl px-4 py-3 text-white text-sm 
                 transition-all duration-150 hover:scale-105 active:scale-95
                 flex items-center justify-center gap-3"
        onClick={() => onGlyphSelect(' ')}
        title="Inserir espaço"
      >
        <span className="text-xl font-mono">␣</span>
        <span className="font-medium">Inserir Espaço</span>
      </button>
    </div>
  );
};
