
import React, { useState } from 'react';
import { Percent } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';

interface MarginGuidesProps {
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;
  centerSpacing: string;
  presetEnabled: boolean;
  onMarginChange: (margin: 'top' | 'right' | 'bottom' | 'left' | 'center', value: string) => void;
  onPresetToggle: () => void;
}

export const MarginGuides = ({
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
  centerSpacing,
  presetEnabled,
  onMarginChange,
  onPresetToggle,
}: MarginGuidesProps) => {
  return (
    <div className="bg-slate-800/30 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-slate-200">Margem Guias</h4>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors">
              <Percent className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Proporção não travada</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Visual Margin Diagram */}
      <div className="relative">
        <div className="w-full h-32 bg-slate-700/30 rounded-lg border border-slate-600/40 relative flex items-center justify-center">
          {/* Top Margin */}
          <input
            type="text"
            value={marginTop}
            onChange={(e) => onMarginChange('top', e.target.value)}
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-12 px-1 py-0.5 text-xs bg-blue-500 text-white rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="10px"
            disabled={presetEnabled}
          />
          
          {/* Left Margin */}
          <input
            type="text"
            value={marginLeft}
            onChange={(e) => onMarginChange('left', e.target.value)}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full -ml-2 w-12 px-1 py-0.5 text-xs bg-blue-500 text-white rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="10px"
            disabled={presetEnabled}
          />
          
          {/* Right Margin */}
          <input
            type="text"
            value={marginRight}
            onChange={(e) => onMarginChange('right', e.target.value)}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-full ml-2 w-12 px-1 py-0.5 text-xs bg-blue-500 text-white rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="10px"
            disabled={presetEnabled}
          />
          
          {/* Bottom Margin */}
          <input
            type="text"
            value={marginBottom}
            onChange={(e) => onMarginChange('bottom', e.target.value)}
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-12 px-1 py-0.5 text-xs bg-blue-500 text-white rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="10px"
            disabled={presetEnabled}
          />
          
          {/* Center Spacing */}
          <input
            type="text"
            value={centerSpacing}
            onChange={(e) => onMarginChange('center', e.target.value)}
            className="w-16 px-2 py-1 text-sm bg-blue-500 text-white rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="30px"
            disabled={presetEnabled}
          />
        </div>
      </div>

      {/* Preset Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-300">Preset</span>
        <Switch
          checked={presetEnabled}
          onCheckedChange={onPresetToggle}
        />
      </div>
    </div>
  );
};
