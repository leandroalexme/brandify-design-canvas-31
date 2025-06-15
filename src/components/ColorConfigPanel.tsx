
import React from 'react';
import { PanelContainer } from './ui/PanelContainer';

interface ColorConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
  position?: { x: number; y: number };
}

export const ColorConfigPanel = ({ 
  isOpen, 
  onClose, 
  position = { x: 350, y: 200 }
}: ColorConfigPanelProps) => {
  const [selectedColor, setSelectedColor] = React.useState('#3B82F6');
  const [opacity, setOpacity] = React.useState(100);

  const predefinedColors = [
    '#EF4444', '#F97316', '#EAB308', '#22C55E',
    '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899',
    '#6B7280', '#000000', '#FFFFFF', '#F3F4F6'
  ];

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    console.log('🎨 [COLOR CONFIG] Color changed to:', color);
  };

  const handleOpacityChange = (newOpacity: number) => {
    setOpacity(newOpacity);
    console.log('🎨 [COLOR CONFIG] Opacity changed to:', newOpacity);
  };

  return (
    <PanelContainer
      isOpen={isOpen}
      onClose={onClose}
      title="Cor"
      position={position}
      width={320}
      height={400}
      dataAttribute="data-color-panel"
      isDraggable={true}
    >
      <div className="panel-scrollable-unified h-full">
        <div className="panel-section-unified space-y-6">
          {/* Color Picker */}
          <div className="space-y-3">
            <label className="panel-section-title-unified">Seletor de Cor</label>
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-full h-12 rounded-xl border border-slate-600/40 bg-transparent cursor-pointer"
            />
          </div>

          {/* Predefined Colors */}
          <div className="space-y-3">
            <label className="panel-section-title-unified">Cores Predefinidas</label>
            <div className="grid grid-cols-4 gap-2">
              {predefinedColors.map((color, index) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={`w-12 h-12 rounded-xl border-2 transition-all duration-150 hover:scale-105 animate-stagger-fade ${
                    selectedColor === color 
                      ? 'border-blue-400 shadow-lg shadow-blue-500/25' 
                      : 'border-slate-600/40 hover:border-slate-500/60'
                  }`}
                  style={{ 
                    backgroundColor: color,
                    animationDelay: `${index * 0.03}s`,
                    animationFillMode: 'both'
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Opacity Slider */}
          <div className="space-y-3">
            <label className="panel-section-title-unified">Opacidade</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={opacity}
                  onChange={(e) => handleOpacityChange(Number(e.target.value))}
                  className="flex-1"
                />
                <input
                  type="number"
                  value={opacity}
                  onChange={(e) => handleOpacityChange(Number(e.target.value))}
                  className="input-unified w-16 text-center"
                  min="0"
                  max="100"
                />
              </div>
              <div className="text-xs text-slate-400 text-center">
                {opacity}%
              </div>
            </div>
          </div>

          {/* Color Preview */}
          <div className="space-y-3">
            <label className="panel-section-title-unified">Prévia</label>
            <div className="relative">
              <div 
                className="w-full h-16 rounded-xl border border-slate-600/40"
                style={{ 
                  backgroundColor: selectedColor,
                  opacity: opacity / 100
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-medium text-white drop-shadow-lg">
                  {selectedColor.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PanelContainer>
  );
};
