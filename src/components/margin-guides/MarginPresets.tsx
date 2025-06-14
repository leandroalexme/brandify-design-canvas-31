
import React from 'react';
import { PRESETS, MarginPresetConfig } from './types';

interface MarginPresetsProps {
  currentPreset: string;
  onPresetChange: (preset: string) => void;
  onReset: () => void;
}

export const MarginPresets = ({ currentPreset, onPresetChange, onReset }: MarginPresetsProps) => {
  return (
    <div className="flex items-center justify-between">
      <select
        value={currentPreset}
        onChange={(e) => onPresetChange(e.target.value)}
        className="bg-slate-700/60 text-slate-200 border border-slate-600/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 mr-3 hover:bg-slate-600/60 transition-colors"
      >
        <option value="personalizado">Custom</option>
        <option value="padrao">Standard (20px)</option>
        <option value="compacto">Compact (10px)</option>
        <option value="espacoso">Spacious (40px)</option>
        <option value="semMargem">No Margin (0px)</option>
      </select>

      <button
        onClick={onReset}
        className="px-4 py-2.5 bg-slate-700/60 hover:bg-slate-600/60 text-slate-200 rounded-xl border border-slate-600/40 text-sm transition-colors hover:border-slate-500/60"
      >
        Reset
      </button>
    </div>
  );
};
