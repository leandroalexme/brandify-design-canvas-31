
import React from 'react';
import { Percent } from 'lucide-react';
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
    <div className="bg-slate-800/30 rounded-lg p-6 space-y-6">
      <h4 className="text-lg font-medium text-slate-200 text-center">Margem Guias</h4>

      {/* Visual Margin Layout - Exactly like reference */}
      <div className="relative bg-slate-700/40 rounded-xl p-8 border border-slate-600/30">
        {/* Top Margin Input */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <input
            type="text"
            value={marginTop}
            onChange={(e) => onMarginChange('top', e.target.value)}
            className="w-16 px-2 py-1 text-sm bg-slate-600 text-slate-200 rounded-lg text-center border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="10px"
            disabled={presetEnabled}
          />
        </div>
        
        {/* Left Margin Input */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4">
          <input
            type="text"
            value={marginLeft}
            onChange={(e) => onMarginChange('left', e.target.value)}
            className="w-16 px-2 py-1 text-sm bg-blue-500 text-white rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="30px"
            disabled={presetEnabled}
          />
        </div>
        
        {/* Right Margin Input */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4">
          <input
            type="text"
            value={marginRight}
            onChange={(e) => onMarginChange('right', e.target.value)}
            className="w-16 px-2 py-1 text-sm bg-slate-600 text-slate-200 rounded-lg text-center border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="10px"
            disabled={presetEnabled}
          />
        </div>
        
        {/* Bottom Margin Input */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
          <input
            type="text"
            value={marginBottom}
            onChange={(e) => onMarginChange('bottom', e.target.value)}
            className="w-16 px-2 py-1 text-sm bg-slate-600 text-slate-200 rounded-lg text-center border border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="10px"
            disabled={presetEnabled}
          />
        </div>

        {/* Visual Border Lines - Blue outline like in reference */}
        <div className="w-full h-24 border-2 border-blue-500 rounded-lg relative flex items-center justify-center">
          {/* Center Spacing Input - Highlighted in blue like reference */}
          <input
            type="text"
            value={centerSpacing}
            onChange={(e) => onMarginChange('center', e.target.value)}
            className="w-20 px-3 py-2 text-base font-medium bg-blue-500 text-white rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="30px"
            disabled={presetEnabled}
          />
        </div>

        {/* Proportion Icon - Top right like in reference */}
        <div className="absolute -top-2 -right-2">
          <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center border border-slate-500">
            <Percent className="w-4 h-4 text-slate-300" />
          </div>
        </div>
      </div>

      {/* Preset Toggle - Bottom section like reference */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
          <div className="w-6 h-6 bg-slate-600 rounded-full border-2 border-slate-500"></div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-base text-slate-200">Preset</span>
          <Switch
            checked={presetEnabled}
            onCheckedChange={onPresetToggle}
          />
        </div>
      </div>
    </div>
  );
};
