
import React from 'react';
import { MarginSide } from './types';

interface StatusIndicatorsProps {
  selectedMargin: MarginSide | null;
  proportionLocked: boolean;
}

export const StatusIndicators = ({ selectedMargin, proportionLocked }: StatusIndicatorsProps) => {
  return (
    <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-800/20 rounded-lg px-3 py-2">
      <span className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
        Selected: {selectedMargin ? selectedMargin.charAt(0).toUpperCase() + selectedMargin.slice(1) : 'None'}
      </span>
      <span className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${proportionLocked ? 'bg-green-500' : 'bg-slate-500'}`}></div>
        Proportion: {proportionLocked ? 'Locked' : 'Unlocked'}
      </span>
    </div>
  );
};
