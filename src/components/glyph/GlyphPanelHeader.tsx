
import React from 'react';
import { X, FileType } from 'lucide-react';

interface GlyphPanelHeaderProps {
  onClose: () => void;
}

export const GlyphPanelHeader = ({ onClose }: GlyphPanelHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-700/40">
      <div className="flex items-center gap-3">
        <div className="w-2 h-6 bg-orange-400 rounded-full" />
        <FileType className="w-5 h-5 text-orange-400" />
        <span className="text-sm font-medium text-slate-200">Glyph Browser</span>
      </div>
      <button
        onClick={onClose}
        className="w-7 h-7 rounded-xl bg-slate-700/60 hover:bg-red-500/80 
                 flex items-center justify-center text-slate-400 hover:text-white 
                 transition-all duration-150 hover:scale-105 active:scale-95"
        title="Fechar"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
