
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ChevronDown, Minus, Plus, Bold, Italic, Underline, X, GripVertical } from 'lucide-react';

interface FontConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
  position?: { x: number; y: number };
}

export const FontConfigPanel = ({ isOpen, onClose, position }: FontConfigPanelProps) => {
  const [selectedFont, setSelectedFont] = useState('Roboto Sans');
  const [selectedWeight, setSelectedWeight] = useState('Extra Bold');
  const [fontSize, setFontSize] = useState(15);
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showWeightDropdown, setShowWeightDropdown] = useState(false);
  
  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [panelPosition, setPanelPosition] = useState({ 
    x: position?.x || window.innerWidth / 2 - 160, 
    y: position?.y || window.innerHeight / 2 - 200 
  });
  
  const panelRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);

  // Update position when prop changes
  useEffect(() => {
    if (position && !isDragging) {
      setPanelPosition({ 
        x: position.x - 160, 
        y: position.y - 280 
      });
    }
  }, [position, isDragging]);

  // Dragging handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (dragHandleRef.current?.contains(e.target as Node)) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - panelPosition.x,
        y: e.clientY - panelPosition.y,
      });
    }
  }, [panelPosition]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newX = Math.max(16, Math.min(e.clientX - dragOffset.x, window.innerWidth - 336));
      const newY = Math.max(16, Math.min(e.clientY - dragOffset.y, window.innerHeight - 400));
      
      setPanelPosition({ x: newX, y: newY });
    }
  }, [isDragging, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Click outside to close
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

  const fonts = ['Roboto Sans', 'Inter', 'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Playfair Display'];
  const weights = ['Light', 'Regular', 'Medium', 'Semi Bold', 'Bold', 'Extra Bold', 'Black'];

  const handleFontSizeDecrease = () => {
    setFontSize(prev => Math.max(8, prev - 1));
  };

  const handleFontSizeIncrease = () => {
    setFontSize(prev => Math.min(72, prev + 1));
  };

  return (
    <div 
      ref={panelRef}
      className={`fixed z-[500] animate-scale-in-60fps select-none ${isDragging ? 'cursor-grabbing' : ''}`}
      style={{ 
        left: panelPosition.x, 
        top: panelPosition.y,
        willChange: 'transform'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="floating-module w-80 overflow-hidden">
        {/* Drag Handle Header */}
        <div 
          ref={dragHandleRef}
          className="flex items-center justify-between p-4 border-b border-slate-700/40 cursor-grab active:cursor-grabbing bg-slate-800/60 hover:bg-slate-700/60 transition-colors duration-100"
        >
          <div className="flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-200">Configuração de Fonte</span>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-lg bg-slate-700/60 hover:bg-red-500/80 
                     flex items-center justify-center text-slate-400 hover:text-white 
                     transition-all duration-100 hover:scale-105 active:scale-95"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Font Family Dropdown */}
          <div className="relative">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
              Família da Fonte
            </label>
            <button
              onClick={() => {
                setShowFontDropdown(!showFontDropdown);
                setShowWeightDropdown(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-700/60 hover:bg-slate-600/80 border border-slate-600/40 hover:border-slate-500/60 text-slate-200 transition-all duration-100"
            >
              <span className="text-sm font-medium">{selectedFont}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFontDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showFontDropdown && (
              <div className="absolute top-full mt-2 w-full floating-module p-2 animate-fade-in-60fps z-10">
                {fonts.map((font) => (
                  <button
                    key={font}
                    onClick={() => {
                      setSelectedFont(font);
                      setShowFontDropdown(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg text-slate-200 transition-colors duration-100 ${
                      selectedFont === font 
                        ? 'bg-blue-500/80 text-white' 
                        : 'hover:bg-slate-700/50'
                    }`}
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Font Weight Dropdown */}
          <div className="relative">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
              Peso da Fonte
            </label>
            <button
              onClick={() => {
                setShowWeightDropdown(!showWeightDropdown);
                setShowFontDropdown(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-700/60 hover:bg-slate-600/80 border border-slate-600/40 hover:border-slate-500/60 text-slate-200 transition-all duration-100"
            >
              <span className="text-sm font-medium">{selectedWeight}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showWeightDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showWeightDropdown && (
              <div className="absolute top-full mt-2 w-full floating-module p-2 animate-fade-in-60fps z-10">
                {weights.map((weight) => (
                  <button
                    key={weight}
                    onClick={() => {
                      setSelectedWeight(weight);
                      setShowWeightDropdown(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg text-slate-200 transition-colors duration-100 ${
                      selectedWeight === weight 
                        ? 'bg-blue-500/80 text-white' 
                        : 'hover:bg-slate-700/50'
                    }`}
                  >
                    {weight}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Font Size Controls */}
          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
              Tamanho da Fonte
            </label>
            <div className="flex items-center justify-between">
              <button
                onClick={handleFontSizeDecrease}
                className="w-12 h-12 rounded-full bg-slate-700/60 hover:bg-slate-600/80 border border-slate-600/40 hover:border-slate-500/60 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-100 hover:scale-105 active:scale-95"
              >
                <Minus className="w-5 h-5" />
              </button>
              
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-slate-200 min-w-[80px] text-center">
                  {fontSize}
                </span>
                <span className="text-xs text-slate-400">pixels</span>
              </div>
              
              <button
                onClick={handleFontSizeIncrease}
                className="w-12 h-12 rounded-full bg-blue-500/80 hover:bg-blue-400/90 border border-blue-400/60 hover:border-blue-300/80 flex items-center justify-center text-white transition-all duration-100 hover:scale-105 active:scale-95"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Text Style Controls */}
          <div>
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
              Estilos de Texto
            </label>
            <div className="flex items-center justify-between">
              <button 
                className="w-12 h-12 rounded-full bg-slate-700/60 hover:bg-slate-600/80 border border-slate-600/40 hover:border-slate-500/60 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-100 hover:scale-105 active:scale-95"
                title="Negrito"
              >
                <Bold className="w-5 h-5" />
              </button>
              
              <button 
                className="w-12 h-12 rounded-full bg-slate-700/60 hover:bg-slate-600/80 border border-slate-600/40 hover:border-slate-500/60 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-100 hover:scale-105 active:scale-95"
                title="Itálico"
              >
                <Italic className="w-5 h-5" />
              </button>
              
              <button 
                className="w-12 h-12 rounded-full bg-slate-700/60 hover:bg-slate-600/80 border border-slate-600/40 hover:border-slate-500/60 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-100 hover:scale-105 active:scale-95"
                title="Sublinhado"
              >
                <Underline className="w-5 h-5" />
              </button>
              
              <button 
                className="w-12 h-12 rounded-full bg-slate-700/60 hover:bg-slate-600/80 border border-slate-600/40 hover:border-slate-500/60 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-100 hover:scale-105 active:scale-95"
                title="Maiúsculas"
              >
                <span className="text-sm font-bold">AB</span>
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="border-t border-slate-700/40 pt-4">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
              Visualização
            </label>
            <div 
              className="p-4 rounded-xl bg-slate-700/30 border border-slate-600/30"
              style={{
                fontFamily: selectedFont,
                fontWeight: selectedWeight.toLowerCase().replace(' ', ''),
                fontSize: `${fontSize}px`,
                color: '#f1f5f9'
              }}
            >
              O texto ficará assim
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
