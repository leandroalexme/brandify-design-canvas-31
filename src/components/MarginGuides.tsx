
import React from 'react';
import { Lock, Unlock, Palette } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ColorPicker } from './ColorPicker';

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

const PRESETS = {
  personalizado: null,
  padrao: { top: '20', right: '20', bottom: '20', left: '20' },
  compacto: { top: '10', right: '10', bottom: '10', left: '10' },
  espacoso: { top: '40', right: '40', bottom: '40', left: '40' },
  semMargem: { top: '0', right: '0', bottom: '0', left: '0' },
};

export const MarginGuides = ({
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
  onMarginChange,
}: MarginGuidesProps) => {
  const [selectedMargin, setSelectedMargin] = React.useState<'top' | 'right' | 'bottom' | 'left' | null>('left');
  const [currentPreset, setCurrentPreset] = React.useState<keyof typeof PRESETS>('personalizado');
  const [proportionLocked, setProportionLocked] = React.useState(false);
  const [guideColor, setGuideColor] = React.useState('#4285F4');
  const [showColorPicker, setShowColorPicker] = React.useState(false);

  const handleMarginClick = (margin: 'top' | 'right' | 'bottom' | 'left') => {
    setSelectedMargin(margin);
  };

  const handlePresetChange = (preset: keyof typeof PRESETS) => {
    setCurrentPreset(preset);
    if (preset !== 'personalizado' && PRESETS[preset]) {
      const presetValues = PRESETS[preset];
      onMarginChange('top', presetValues.top);
      onMarginChange('right', presetValues.right);
      onMarginChange('bottom', presetValues.bottom);
      onMarginChange('left', presetValues.left);
    }
  };

  const handleInputChange = (margin: 'top' | 'right' | 'bottom' | 'left', value: string) => {
    setCurrentPreset('personalizado');
    
    if (proportionLocked) {
      // Apply the same value to all margins when proportion is locked
      onMarginChange('top', value);
      onMarginChange('right', value);
      onMarginChange('bottom', value);
      onMarginChange('left', value);
    } else {
      onMarginChange(margin, value);
    }
  };

  const getBorderClass = (position: 'top' | 'right' | 'bottom' | 'left') => {
    if (selectedMargin !== position) return 'border-slate-600/30';
    
    switch (position) {
      case 'top': return 'border-t-4 border-t-blue-500 border-r-slate-600/30 border-b-slate-600/30 border-l-slate-600/30';
      case 'right': return 'border-r-4 border-r-blue-500 border-t-slate-600/30 border-b-slate-600/30 border-l-slate-600/30';
      case 'bottom': return 'border-b-4 border-b-blue-500 border-t-slate-600/30 border-r-slate-600/30 border-l-slate-600/30';
      case 'left': return 'border-l-4 border-l-blue-500 border-t-slate-600/30 border-r-slate-600/30 border-b-slate-600/30';
      default: return 'border-slate-600/30';
    }
  };

  const handleReset = () => {
    onMarginChange('top', '0');
    onMarginChange('right', '0');
    onMarginChange('bottom', '0');
    onMarginChange('left', '0');
    setCurrentPreset('personalizado');
  };

  return (
    <div className="bg-slate-800/30 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-slate-200">Margin Guides</h4>
        <div className="flex items-center gap-2">
          <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
            <PopoverTrigger asChild>
              <button className="w-8 h-8 rounded-lg border-2 border-slate-600/60 hover:border-slate-500/80 transition-colors flex items-center justify-center">
                <Palette className="w-4 h-4 text-slate-300" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <ColorPicker
                selectedColor={guideColor}
                onColorSelect={(color) => {
                  setGuideColor(color);
                  setShowColorPicker(false);
                }}
                onClose={() => setShowColorPicker(false)}
              />
            </PopoverContent>
          </Popover>
          
          <button
            onClick={() => setProportionLocked(!proportionLocked)}
            className={`w-8 h-8 rounded-lg border-2 transition-colors flex items-center justify-center ${
              proportionLocked 
                ? 'bg-blue-500 border-blue-400 text-white' 
                : 'border-slate-600/60 hover:border-slate-500/80 text-slate-300'
            }`}
          >
            {proportionLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Visual Margin Layout */}
      <div className="relative bg-slate-700/40 rounded-xl p-8">
        {/* Top Margin Input */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <input
            type="text"
            value={marginTop}
            onChange={(e) => handleInputChange('top', e.target.value)}
            onClick={() => handleMarginClick('top')}
            className={`w-16 px-2 py-1 text-sm rounded-lg text-center border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              selectedMargin === 'top' 
                ? 'bg-blue-500 text-white border-blue-400' 
                : 'bg-slate-600 text-slate-200 border-slate-500 hover:bg-slate-500'
            }`}
            placeholder="10px"
          />
        </div>
        
        {/* Left Margin Input */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4">
          <input
            type="text"
            value={marginLeft}
            onChange={(e) => handleInputChange('left', e.target.value)}
            onClick={() => handleMarginClick('left')}
            className={`w-16 px-2 py-1 text-sm rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
              selectedMargin === 'left' 
                ? 'bg-blue-500 text-white border-blue-400' 
                : 'bg-slate-600 text-slate-200 border border-slate-500 hover:bg-slate-500'
            }`}
            placeholder="30px"
          />
        </div>
        
        {/* Right Margin Input */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4">
          <input
            type="text"
            value={marginRight}
            onChange={(e) => handleInputChange('right', e.target.value)}
            onClick={() => handleMarginClick('right')}
            className={`w-16 px-2 py-1 text-sm rounded-lg text-center border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
              selectedMargin === 'right' 
                ? 'bg-blue-500 text-white border-blue-400' 
                : 'bg-slate-600 text-slate-200 border-slate-500 hover:bg-slate-500'
            }`}
            placeholder="10px"
          />
        </div>
        
        {/* Bottom Margin Input */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
          <input
            type="text"
            value={marginBottom}
            onChange={(e) => handleInputChange('bottom', e.target.value)}
            onClick={() => handleMarginClick('bottom')}
            className={`w-16 px-2 py-1 text-sm rounded-lg text-center border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
              selectedMargin === 'bottom' 
                ? 'bg-blue-500 text-white border-blue-400' 
                : 'bg-slate-600 text-slate-200 border-slate-500 hover:bg-slate-500'
            }`}
            placeholder="10px"
          />
        </div>

        {/* Central Canvas Area with dynamic border gradients */}
        <div className={`w-full h-24 rounded-lg bg-slate-600/20 border-2 transition-all duration-300 ${getBorderClass(selectedMargin || 'top')}`}>
        </div>
      </div>

      {/* Controls Row */}
      <div className="flex items-center justify-between">
        <select
          value={currentPreset}
          onChange={(e) => handlePresetChange(e.target.value as keyof typeof PRESETS)}
          className="bg-slate-700 text-slate-200 border border-slate-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 mr-3"
        >
          <option value="personalizado">Custom</option>
          <option value="padrao">Standard (20px)</option>
          <option value="compacto">Compact (10px)</option>
          <option value="espacoso">Spacious (40px)</option>
          <option value="semMargem">No Margin (0px)</option>
        </select>

        <button
          onClick={handleReset}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg border border-slate-600 text-sm transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>
          Selected: {selectedMargin ? selectedMargin.charAt(0).toUpperCase() + selectedMargin.slice(1) : 'None'}
        </span>
        <span>
          Proportion: {proportionLocked ? 'Locked' : 'Unlocked'}
        </span>
      </div>
    </div>
  );
};
