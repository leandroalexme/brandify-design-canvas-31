
import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { MarginSide } from './types';

interface SpinnerInputProps {
  value: string;
  onChange: (value: string) => void;
  onClick: () => void;
  onSpinner: (direction: 'up' | 'down') => void;
  isSelected: boolean;
  position: MarginSide;
}

export const SpinnerInput = ({ 
  value, 
  onChange, 
  onClick, 
  onSpinner, 
  isSelected, 
  position 
}: SpinnerInputProps) => {
  const formatValue = (value: string) => {
    const numericValue = parseFloat(value) || 0;
    return `${numericValue}px`;
  };

  return (
    <div className="relative group">
      <input
        type="text"
        value={formatValue(value)}
        onChange={(e) => onChange(e.target.value)}
        onClick={onClick}
        className={`w-16 h-16 px-2 py-1 text-sm rounded-xl text-center border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 cursor-ns-resize font-medium ${
          isSelected 
            ? 'bg-blue-500 text-white border-blue-400 shadow-lg shadow-blue-500/25' 
            : 'bg-slate-700/60 text-slate-200 border-slate-600/40 hover:bg-slate-600/60 hover:border-slate-500/60'
        }`}
        readOnly
      />
      <div className="absolute right-1 top-0 bottom-0 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            onSpinner('up');
          }}
          className="text-blue-400 hover:text-blue-300 p-0.5 hover:bg-blue-500/10 rounded transition-colors"
        >
          <ChevronUp className="w-3 h-3" />
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            onSpinner('down');
          }}
          className="text-blue-400 hover:text-blue-300 p-0.5 hover:bg-blue-500/10 rounded transition-colors"
        >
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
