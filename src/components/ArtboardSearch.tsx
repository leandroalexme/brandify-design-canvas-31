
import React from 'react';
import { Search } from 'lucide-react';

interface ArtboardSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const ArtboardSearch = ({ value, onChange, placeholder = "Tamanho personalizado" }: ArtboardSearchProps) => {
  return (
    <div className="relative mb-4">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-3 py-2 bg-slate-700/50 border border-slate-600/60 rounded-lg text-slate-200 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      />
    </div>
  );
};
