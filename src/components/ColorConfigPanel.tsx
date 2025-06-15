
import React, { useRef, useEffect, useState } from 'react';
import { X, Plus } from 'lucide-react';

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

  // Paleta de cores predefinidas
  const colorPalette = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00',
    '#ff00ff', '#00ffff', '#808080', '#800000', '#008000', '#000080',
    '#808000', '#800080', '#008080', '#c0c0c0', '#ff8000', '#8000ff',
    '#00ff80', '#ff0080', '#80ff00', '#0080ff', '#ff4000', '#4000ff',
    '#00ff40', '#ff0040', '#40ff00', '#0040ff', '#ffc0c0', '#c0ffc0',
    '#c0c0ff', '#ffffc0', '#ffc0ff', '#c0ffff'
  ];

  const handleToolClick = (action: string) => {
    console.log('🎨 [COLOR PANEL] Action selected:', action);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    console.log('🎨 [COLOR PANEL] Color selected:', color);
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpacity(Number(e.target.value));
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
          {/* Gradiente principal */}
          <div className="relative">
            <div 
              className="w-full h-32 rounded-lg relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, 
                  rgba(0,255,255,1) 0%, 
                  rgba(0,128,255,1) 25%, 
                  rgba(128,0,255,1) 50%, 
                  rgba(255,0,128,1) 75%, 
                  rgba(255,128,0,1) 100%)`
              }}
            >
              {/* Overlay de brilho */}
              <div 
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to bottom, 
                    rgba(255,255,255,0.8) 0%, 
                    rgba(255,255,255,0) 50%, 
                    rgba(0,0,0,0) 50%, 
                    rgba(0,0,0,0.8) 100%)`
                }}
              />
              
              {/* Seletor circular */}
              <div 
                className="absolute w-6 h-6 border-4 border-white rounded-full shadow-lg"
                style={{
                  left: '20px',
                  top: '20px',
                  transform: 'translate(-50%, -50%)'
                }}
              />
            </div>
          </div>

          {/* Slider de opacidade */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Opacidade</span>
              <span className="text-sm text-slate-300 font-mono">{opacity}</span>
            </div>
            
            <div className="relative">
              {/* Background com padrão xadrez */}
              <div 
                className="w-full h-6 rounded-full"
                style={{
                  background: `repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 8px 8px`,
                  backgroundClip: 'padding-box'
                }}
              />
              
              {/* Overlay do slider */}
              <div className="absolute inset-0 flex items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={opacity}
                  onChange={handleOpacityChange}
                  className="w-full h-6 bg-transparent appearance-none cursor-pointer slider-opacity"
                  style={{
                    background: `linear-gradient(to right, 
                      rgba(255,255,255,0) 0%, 
                      rgba(255,255,255,1) 100%)`
                  }}
                />
              </div>
              
              {/* Indicador circular */}
              <div 
                className="absolute w-6 h-6 bg-white border-2 border-slate-400 rounded-full shadow-lg pointer-events-none"
                style={{
                  left: `${opacity}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
            </div>
          </div>

          {/* Cor atual e código hex */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Preview da cor com padrão xadrez para transparência */}
              <div className="relative w-12 h-8 rounded">
                <div 
                  className="absolute inset-0 rounded"
                  style={{
                    background: `repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 4px 4px`
                  }}
                />
                <div 
                  className="absolute inset-0 rounded"
                  style={{
                    backgroundColor: selectedColor,
                    opacity: opacity / 100
                  }}
                />
              </div>
              
              {/* Código da cor */}
              <div className="text-sm font-mono text-slate-300 tracking-wider">
                {selectedColor.toUpperCase()}
              </div>
            </div>
            
            {/* Botão de adicionar cor */}
            <button
              onClick={() => handleToolClick('add-color')}
              className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              title="Adicionar à paleta"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Paleta de cores */}
          <div className="grid grid-cols-12 gap-1">
            {colorPalette.map((color, index) => (
              <button
                key={index}
                className={`w-6 h-6 rounded border-2 transition-all hover:scale-110 ${
                  selectedColor === color 
                    ? 'border-white ring-2 ring-blue-500' 
                    : 'border-slate-600 hover:border-slate-400'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
                title={color}
              />
            ))}
          </div>

          {/* Barra de gradiente arco-íris */}
          <div className="relative">
            <div 
              className="w-full h-4 rounded"
              style={{
                background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
              }}
            />
            
            {/* Indicador de posição */}
            <div className="absolute w-0.5 h-6 bg-black -top-1 left-1/4 transform -translate-x-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
};
