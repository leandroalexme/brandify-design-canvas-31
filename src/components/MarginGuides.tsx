
import React from 'react';
import { Lock, Unlock, ChevronUp, ChevronDown } from 'lucide-react';
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
    // Remove 'px' and any non-numeric characters except for decimal points
    const numericValue = value.replace(/[^\d.]/g, '');
    setCurrentPreset('personalizado');
    
    if (proportionLocked) {
      onMarginChange('top', numericValue);
      onMarginChange('right', numericValue);
      onMarginChange('bottom', numericValue);
      onMarginChange('left', numericValue);
    } else {
      onMarginChange(margin, numericValue);
    }
  };

  const handleSpinner = (margin: 'top' | 'right' | 'bottom' | 'left', direction: 'up' | 'down') => {
    const currentValue = (() => {
      switch (margin) {
        case 'top': return parseFloat(marginTop) || 0;
        case 'right': return parseFloat(marginRight) || 0;
        case 'bottom': return parseFloat(marginBottom) || 0;
        case 'left': return parseFloat(marginLeft) || 0;
      }
    })();
    
    const newValue = direction === 'up' ? currentValue + 1 : Math.max(0, currentValue - 1);
    handleInputChange(margin, newValue.toString());
  };

  const formatValue = (value: string) => {
    const numericValue = parseFloat(value) || 0;
    return `${numericValue}px`;
  };

  const getBorderStyle = () => {
    if (!selectedMargin) return 'border-2 border-slate-600/30';
    
    const baseStyle = 'border-2';
    const gradientColor = guideColor;
    
    switch (selectedMargin) {
      case 'top':
        return `${baseStyle} border-t-2 border-r-slate-600/30 border-b-slate-600/30 border-l-slate-600/30`;
      case 'right':
        return `${baseStyle} border-r-2 border-t-slate-600/30 border-b-slate-600/30 border-l-slate-600/30`;
      case 'bottom':
        return `${baseStyle} border-b-2 border-t-slate-600/30 border-r-slate-600/30 border-l-slate-600/30`;
      case 'left':
        return `${baseStyle} border-l-2 border-t-slate-600/30 border-r-slate-600/30 border-b-slate-600/30`;
      default:
        return `${baseStyle} border-slate-600/30`;
    }
  };

  const getBorderGradientStyle = () => {
    if (!selectedMargin) return {};
    
    const gradientColor = guideColor;
    
    return {
      borderImage: `linear-gradient(45deg, ${gradientColor}, #60A5FA, ${gradientColor}) 1`,
      borderImageSlice: 1,
    };
  };

  const handleReset = () => {
    onMarginChange('top', '0');
    onMarginChange('right', '0');
    onMarginChange('bottom', '0');
    onMarginChange('left', '0');
    setCurrentPreset('personalizado');
  };

  const SpinnerInput = ({ 
    value, 
    onChange, 
    onClick, 
    onSpinner, 
    isSelected, 
    position 
  }: {
    value: string;
    onChange: (value: string) => void;
    onClick: () => void;
    onSpinner: (direction: 'up' | 'down') => void;
    isSelected: boolean;
    position: 'top' | 'right' | 'bottom' | 'left';
  }) => (
    <div className="relative group">
      <input
        type="text"
        value={formatValue(value)}
        onChange={(e) => onChange(e.target.value)}
        onClick={onClick}
        className={`w-20 px-2 py-1 text-sm rounded-lg text-center border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
          isSelected 
            ? 'bg-blue-500 text-white border-blue-400' 
            : 'bg-slate-600 text-slate-200 border-slate-500 hover:bg-slate-500'
        }`}
        readOnly
      />
      <div className="absolute right-1 top-0 bottom-0 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            onSpinner('up');
          }}
          className="text-blue-400 hover:text-blue-300 p-0.5"
        >
          <ChevronUp className="w-3 h-3" />
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            onSpinner('down');
          }}
          className="text-blue-400 hover:text-blue-300 p-0.5"
        >
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-800/30 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-slate-200">Margin Guides</h4>
        <div className="flex items-center gap-2">
          <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
            <PopoverTrigger asChild>
              <button 
                className="w-8 h-8 rounded-lg border-2 border-slate-600/60 hover:border-slate-500/80 transition-colors"
                style={{ backgroundColor: guideColor }}
              />
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

      {/* Visual Margin Layout - Square Format */}
      <div className="relative bg-slate-700/40 rounded-xl p-12 flex items-center justify-center">
        {/* Top Margin Input */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <SpinnerInput
            value={marginTop}
            onChange={(value) => handleInputChange('top', value)}
            onClick={() => handleMarginClick('top')}
            onSpinner={(direction) => handleSpinner('top', direction)}
            isSelected={selectedMargin === 'top'}
            position="top"
          />
        </div>
        
        {/* Left Margin Input */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <SpinnerInput
            value={marginLeft}
            onChange={(value) => handleInputChange('left', value)}
            onClick={() => handleMarginClick('left')}
            onSpinner={(direction) => handleSpinner('left', direction)}
            isSelected={selectedMargin === 'left'}
            position="left"
          />
        </div>
        
        {/* Right Margin Input */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <SpinnerInput
            value={marginRight}
            onChange={(value) => handleInputChange('right', value)}
            onClick={() => handleMarginClick('right')}
            onSpinner={(direction) => handleSpinner('right', direction)}
            isSelected={selectedMargin === 'right'}
            position="right"
          />
        </div>
        
        {/* Bottom Margin Input */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <SpinnerInput
            value={marginBottom}
            onChange={(value) => handleInputChange('bottom', value)}
            onClick={() => handleMarginClick('bottom')}
            onSpinner={(direction) => handleSpinner('bottom', direction)}
            isSelected={selectedMargin === 'bottom'}
            position="bottom"
          />
        </div>

        {/* Central Square Canvas Area with gradient borders */}
        <div 
          className={`w-32 h-32 rounded-2xl bg-slate-600/20 transition-all duration-300 ${getBorderStyle()}`}
          style={getBorderGradientStyle()}
        >
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
