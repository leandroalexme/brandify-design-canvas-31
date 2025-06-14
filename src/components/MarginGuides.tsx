
import React from 'react';
import { MarginGuidesProps, MarginSide, PRESETS } from './margin-guides/types';
import { MarginVisualizer } from './margin-guides/MarginVisualizer';
import { MarginControls } from './margin-guides/MarginControls';
import { MarginPresets } from './margin-guides/MarginPresets';
import { StatusIndicators } from './margin-guides/StatusIndicators';

export const MarginGuides = ({
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
  onMarginChange,
}: MarginGuidesProps) => {
  const [selectedMargin, setSelectedMargin] = React.useState<MarginSide | null>('left');
  const [currentPreset, setCurrentPreset] = React.useState<string>('personalizado');
  const [proportionLocked, setProportionLocked] = React.useState(false);
  const [guideColor, setGuideColor] = React.useState('#4285F4');
  const [showColorPicker, setShowColorPicker] = React.useState(false);

  const handleMarginClick = (margin: MarginSide) => {
    setSelectedMargin(margin);
  };

  const handlePresetChange = (preset: string) => {
    setCurrentPreset(preset);
    if (preset !== 'personalizado' && PRESETS[preset]) {
      const presetValues = PRESETS[preset]!;
      onMarginChange('top', presetValues.top);
      onMarginChange('right', presetValues.right);
      onMarginChange('bottom', presetValues.bottom);
      onMarginChange('left', presetValues.left);
    }
  };

  const handleInputChange = (margin: MarginSide, value: string) => {
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

  const handleSpinner = (margin: MarginSide, direction: 'up' | 'down') => {
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

  const handleReset = () => {
    onMarginChange('top', '0');
    onMarginChange('right', '0');
    onMarginChange('bottom', '0');
    onMarginChange('left', '0');
    setCurrentPreset('personalizado');
  };

  return (
    <div className="bg-slate-800/20 rounded-2xl p-6 space-y-6 border border-slate-700/30">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-slate-200">Margin Guides</h4>
        <MarginControls
          proportionLocked={proportionLocked}
          guideColor={guideColor}
          showColorPicker={showColorPicker}
          onProportionToggle={() => setProportionLocked(!proportionLocked)}
          onColorChange={setGuideColor}
          onColorPickerToggle={setShowColorPicker}
        />
      </div>

      <MarginVisualizer
        marginTop={marginTop}
        marginRight={marginRight}
        marginBottom={marginBottom}
        marginLeft={marginLeft}
        selectedMargin={selectedMargin}
        guideColor={guideColor}
        onMarginClick={handleMarginClick}
        onInputChange={handleInputChange}
        onSpinner={handleSpinner}
      />

      <MarginPresets
        currentPreset={currentPreset}
        onPresetChange={handlePresetChange}
        onReset={handleReset}
      />

      <StatusIndicators
        selectedMargin={selectedMargin}
        proportionLocked={proportionLocked}
      />
    </div>
  );
};
