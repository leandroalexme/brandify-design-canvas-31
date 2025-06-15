
import React, { useRef, useEffect, useState } from 'react';
import { X } from 'lucide-react';
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
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);

  const handleColorChange = (newHue: number, newSaturation: number, newLightness: number) => {
    setHue(newHue);
    setSaturation(newSaturation);
    setLightness(newLightness);
    
    const newColor = `hsl(${newHue}, ${newSaturation}%, ${newLightness}%)`;
    setSelectedColor(newColor);
  };

  const handleAddToPalette = () => {
    console.log('Adding color to palette:', selectedColor);
    // TODO: Implement add to palette functionality
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
      <div className="text-panel-container w-80">
        {/* Header */}
        <div className="text-panel-header">
          <div className="text-panel-indicator" />
          <button
            onClick={onClose}
            className="text-panel-close-button"
            title="Fechar"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Color Wheel */}
          <ColorWheel
            hue={hue}
            saturation={saturation}
            lightness={lightness}
            onColorChange={handleColorChange}
          />

          {/* Opacity Slider */}
          <OpacitySlider
            opacity={opacity}
            onOpacityChange={setOpacity}
          />

          {/* Color Preview and Controls */}
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
