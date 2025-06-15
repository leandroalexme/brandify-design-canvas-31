
import React from 'react';
import { Search } from 'lucide-react';

interface GlyphSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const GlyphSearch = ({ searchTerm, onSearchChange }: GlyphSearchProps) => {
  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
        Buscar Glyph
      </label>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Digite para buscar..."
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-700/40 border border-slate-600/30 
                   focus:border-orange-500/50 focus:bg-slate-600/40 text-slate-200 text-sm 
                   outline-none transition-all duration-200 placeholder-slate-500"
        />
      </div>
    </div>
  );
};
