
import React, { useRef, useEffect, useState } from 'react';
import { X, Palette } from 'lucide-react';
import { ColorWheel } from './ColorWheel';
import { OpacitySlider } from './OpacitySlider';
import { ColorPreview } from './ColorPreview';

interface ColorConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
  position?: { x: number; y: number };
}

export const ColorConfigPanel = ({ 
  isOpen, 
  onClose, 
  position = { x: 120, y: 200 }
}: ColorConfigPanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(100);
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [hue, setHue] = useState(217);
  const [saturation, setSaturation] = useState(91);
  const [lightness, setLightness] = useState(60);
  const [recentColors, setRecentColors] = useState([
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
    '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'
  ]);

  const handleColorChange = (newHue: number, newSaturation: number, newLightness: number) => {
    setHue(newHue);
    setSaturation(newSaturation);
    setLightness(newLightness);
    
    const newColor = `hsl(${newHue}, ${newSaturation}%, ${newLightness}%)`;
    setSelectedColor(newColor);
  };

  const handleAddToPalette = () => {
    const hexColor = hslToHex(hue, saturation, lightness);
    if (!recentColors.includes(hexColor)) {
      setRecentColors(prev => [hexColor, ...prev.slice(0, 7)]);
    }
    console.log('Adding color to palette:', hexColor);
  };

  const handleRecentColorSelect = (color: string) => {
    setSelectedColor(color);
    // Convert hex to HSL for the color wheel
    const hsl = hexToHsl(color);
    setHue(hsl.h);
    setSaturation(hsl.s);
    setLightness(hsl.l);
  };

  // Utility functions
  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={panelRef}
      className="fixed z-[500] animate-scale-in-60fps"
      style={{
        left: position.x,
        top: position.y
      }}
      data-color-panel
    >
      <div className="floating-module w-80 overflow-hidden">
        {/* Header redesenhado */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/40">
          <div className="flex items-center gap-3">
            <Palette className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium text-slate-200">Cor</span>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-lg bg-slate-700/60 hover:bg-red-500/80 
                     flex items-center justify-center text-slate-400 hover:text-white 
                     transition-all duration-100 hover:scale-105 active:scale-95"
            title="Fechar"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Color Wheel maior */}
          <div className="space-y-3">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
              Seletor de Cor
            </label>
            <ColorWheel
              hue={hue}
              saturation={saturation}
              lightness={lightness}
              onColorChange={handleColorChange}
            />
          </div>

          {/* Cores Recentes */}
          <div className="space-y-3">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
              Cores Recentes
            </label>
            <div className="grid grid-cols-8 gap-2">
              {recentColors.map((color, index) => (
                <button
                  key={index}
                  className="w-8 h-8 rounded-lg border-2 border-slate-600/40 hover:border-slate-500/60 transition-all duration-100 hover:scale-110"
                  style={{ backgroundColor: color }}
                  onClick={() => handleRecentColorSelect(color)}
                  title={`Usar cor ${color}`}
                />
              ))}
            </div>
          </div>

          {/* Opacity Slider */}
          <div className="space-y-3">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
              Opacidade
            </label>
            <OpacitySlider
              opacity={opacity}
              onOpacityChange={setOpacity}
            />
          </div>

          {/* Color Preview melhorado */}
          <ColorPreview
            selectedColor={selectedColor}
            opacity={opacity}
            hue={hue}
            saturation={saturation}
            lightness={lightness}
            onAddToPalette={handleAddToPalette}
          />
        </div>
      </div>
    </div>
  );
};
