
import React from 'react';
import { Lock, Unlock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ColorPicker } from '../ColorPicker';

interface MarginControlsProps {
  proportionLocked: boolean;
  guideColor: string;
  showColorPicker: boolean;
  onProportionToggle: () => void;
  onColorChange: (color: string) => void;
  onColorPickerToggle: (show: boolean) => void;
}

export const MarginControls = ({
  proportionLocked,
  guideColor,
  showColorPicker,
  onProportionToggle,
  onColorChange,
  onColorPickerToggle
}: MarginControlsProps) => {
  return (
    <div className="flex items-center gap-3">
      <Popover open={showColorPicker} onOpenChange={onColorPickerToggle}>
        <PopoverTrigger asChild>
          <button 
            className="w-10 h-10 rounded-xl border-2 border-slate-600/40 hover:border-slate-500/60 transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: guideColor }}
          />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <ColorPicker
            selectedColor={guideColor}
            onColorSelect={(color) => {
              onColorChange(color);
              onColorPickerToggle(false);
            }}
            onClose={() => onColorPickerToggle(false)}
          />
        </PopoverContent>
      </Popover>
      
      <button
        onClick={onProportionToggle}
        className={`w-10 h-10 rounded-xl border-2 transition-all duration-200 flex items-center justify-center hover:scale-105 ${
          proportionLocked 
            ? 'bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/25' 
            : 'border-slate-600/40 hover:border-slate-500/60 text-slate-300 bg-slate-700/30'
        }`}
      >
        {proportionLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
      </button>
    </div>
  );
};
