
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

const PRESETS = {
  padrao: { top: '20', right: '20', bottom: '20', left: '20' },
  compacto: { top: '10', right: '10', bottom: '10', left: '10' },
  espacoso: { top: '40', right: '40', bottom: '40', left: '40' },
  semMargem: { top: '0', right: '0', bottom: '0', left: '0' },
  personalizado: null
};

export const MarginGuides = ({
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
  presetEnabled,
  onMarginChange,
  onPresetToggle,
}: MarginGuidesProps) => {
  const [selectedMargin, setSelectedMargin] = React.useState<'top' | 'right' | 'bottom' | 'left' | null>('left');
  const [currentPreset, setCurrentPreset] = React.useState<keyof typeof PRESETS>('personalizado');

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
    onMarginChange(margin, value);
  };

  const getGradientClass = (position: 'top' | 'right' | 'bottom' | 'left') => {
    if (selectedMargin !== position) return '';
    
    switch (position) {
      case 'top': return 'bg-gradient-to-b from-blue-500/20 to-transparent';
      case 'right': return 'bg-gradient-to-l from-blue-500/20 to-transparent';
      case 'bottom': return 'bg-gradient-to-t from-blue-500/20 to-transparent';
      case 'left': return 'bg-gradient-to-r from-blue-500/20 to-transparent';
      default: return '';
    }
  };

  return (
    <div className="bg-slate-800/30 rounded-lg p-6 space-y-6">
      <h4 className="text-lg font-medium text-slate-200 text-center">Margem Guias</h4>

      {/* Visual Margin Layout */}
      <div className="relative bg-slate-700/40 rounded-xl p-8 border border-slate-600/30">
        {/* Gradient Lines */}
        <div className={`absolute inset-x-0 top-0 h-8 ${getGradientClass('top')} transition-all duration-300`} />
        <div className={`absolute inset-y-0 right-0 w-8 ${getGradientClass('right')} transition-all duration-300`} />
        <div className={`absolute inset-x-0 bottom-0 h-8 ${getGradientClass('bottom')} transition-all duration-300`} />
        <div className={`absolute inset-y-0 left-0 w-8 ${getGradientClass('left')} transition-all duration-300`} />

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
            disabled={presetEnabled && currentPreset !== 'personalizado'}
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
            disabled={presetEnabled && currentPreset !== 'personalizado'}
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
            disabled={presetEnabled && currentPreset !== 'personalizado'}
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
            disabled={presetEnabled && currentPreset !== 'personalizado'}
          />
        </div>

        {/* Central Canvas Area - Visual Only */}
        <div className="w-full h-24 border-2 border-slate-500/60 rounded-lg bg-slate-600/20"></div>

        {/* Proportion Icon */}
        <div className="absolute -top-2 -right-2">
          <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center border border-slate-500 hover:bg-slate-500 transition-colors cursor-pointer">
            <Percent className="w-4 h-4 text-slate-300" />
          </div>
        </div>
      </div>

      {/* Preset System */}
      <div className="space-y-4">
        {/* Preset Selector */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-300">Preset:</span>
          <select
            value={currentPreset}
            onChange={(e) => handlePresetChange(e.target.value as keyof typeof PRESETS)}
            className="bg-slate-700 text-slate-200 border border-slate-600 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!presetEnabled}
          >
            <option value="personalizado">Personalizado</option>
            <option value="padrao">Padrão (20px)</option>
            <option value="compacto">Compacto (10px)</option>
            <option value="espacoso">Espaçoso (40px)</option>
            <option value="semMargem">Sem Margem (0px)</option>
          </select>
        </div>

        {/* Preset Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full transition-colors ${selectedMargin ? 'bg-blue-500' : 'bg-slate-600'}`}></div>
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
    </div>
  );
};
