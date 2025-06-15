
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ChevronDown, Minus, Plus, Bold, Italic, Underline, X, GripVertical, Type } from 'lucide-react';

interface FontConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
  position?: { x: number; y: number };
}

export const FontConfigPanel = ({ isOpen, onClose, position }: FontConfigPanelProps) => {
  const [selectedFont, setSelectedFont] = useState('Roboto Sans');
  const [selectedWeight, setSelectedWeight] = useState('Regular');
  const [fontSize, setFontSize] = useState(16);
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

  const fonts = [
    { name: 'Roboto Sans', category: 'Sans Serif' },
    { name: 'Inter', category: 'Sans Serif' },
    { name: 'Arial', category: 'Sans Serif' },
    { name: 'Helvetica', category: 'Sans Serif' },
    { name: 'Times New Roman', category: 'Serif' },
    { name: 'Georgia', category: 'Serif' },
    { name: 'Playfair Display', category: 'Display' }
  ];

  const weights = ['Light', 'Regular', 'Medium', 'Semi Bold', 'Bold', 'Extra Bold'];
  const sizePresets = [
    { label: 'Caption', size: 12 },
    { label: 'Body', size: 16 },
    { label: 'Subtitle', size: 20 },
    { label: 'Title', size: 24 },
    { label: 'Heading', size: 32 }
  ];

  const handleFontSizeChange = (newSize: number) => {
    setFontSize(Math.max(8, Math.min(72, newSize)));
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
      data-font-panel
    >
      <div className="floating-module w-80 overflow-hidden">
        {/* Header redesenhado */}
        <div 
          ref={dragHandleRef}
          className="flex items-center justify-between p-4 border-b border-slate-700/40 cursor-grab active:cursor-grabbing bg-slate-800/60 hover:bg-slate-700/60 transition-colors duration-100"
        >
          <div className="flex items-center gap-3">
            <Type className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-medium text-slate-200">Tipografia</span>
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

        <div className="p-6 space-y-6">
          {/* Font Family com categorias */}
          <div className="space-y-3">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
              Família da Fonte
            </label>
            <div className="relative">
              <button
                onClick={() => {
                  setShowFontDropdown(!showFontDropdown);
                  setShowWeightDropdown(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-700/60 hover:bg-slate-600/80 border border-slate-600/40 hover:border-blue-500/60 text-slate-200 transition-all duration-100"
              >
                <div className="text-left">
                  <div className="text-sm font-medium">{selectedFont}</div>
                  <div className="text-xs text-slate-400">
                    {fonts.find(f => f.name === selectedFont)?.category}
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFontDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showFontDropdown && (
                <div className="absolute top-full mt-2 w-full floating-module p-2 animate-fade-in-60fps z-10 max-h-64 overflow-y-auto">
                  {fonts.map((font) => (
                    <button
                      key={font.name}
                      onClick={() => {
                        setSelectedFont(font.name);
                        setShowFontDropdown(false);
                      }}
                      className={`w-full text-left p-3 rounded-lg transition-colors duration-100 ${
                        selectedFont === font.name 
                          ? 'bg-blue-500/80 text-white' 
                          : 'text-slate-200 hover:bg-slate-700/50'
                      }`}
                      style={{ fontFamily: font.name }}
                    >
                      <div className="text-sm font-medium">{font.name}</div>
                      <div className="text-xs opacity-70">{font.category}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Font Weight */}
          <div className="space-y-3">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
              Peso da Fonte
            </label>
            <div className="relative">
              <button
                onClick={() => {
                  setShowWeightDropdown(!showWeightDropdown);
                  setShowFontDropdown(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-700/60 hover:bg-slate-600/80 border border-slate-600/40 hover:border-blue-500/60 text-slate-200 transition-all duration-100"
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
          </div>

          {/* Font Size com presets */}
          <div className="space-y-3">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
              Tamanho da Fonte
            </label>
            
            {/* Presets rápidos */}
            <div className="flex gap-2 mb-3">
              {sizePresets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setFontSize(preset.size)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all duration-100 ${
                    fontSize === preset.size
                      ? 'bg-blue-500/80 text-white'
                      : 'bg-slate-700/60 text-slate-300 hover:bg-slate-600/80'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Controles de tamanho */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleFontSizeChange(fontSize - 1)}
                className="w-10 h-10 rounded-full bg-slate-700/60 hover:bg-slate-600/80 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-100"
              >
                <Minus className="w-4 h-4" />
              </button>
              
              <div className="flex-1 text-center">
                <input
                  type="number"
                  value={fontSize}
                  onChange={(e) => handleFontSizeChange(parseInt(e.target.value) || fontSize)}
                  className="w-full text-center text-xl font-bold bg-transparent text-slate-200 border-b border-slate-600 focus:border-blue-500 outline-none py-1"
                  min="8"
                  max="72"
                />
                <div className="text-xs text-slate-400 mt-1">pixels</div>
              </div>
              
              <button
                onClick={() => handleFontSizeChange(fontSize + 1)}
                className="w-10 h-10 rounded-full bg-blue-500/80 hover:bg-blue-400/90 flex items-center justify-center text-white transition-all duration-100"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Text Styles */}
          <div className="space-y-3">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
              Estilos
            </label>
            <div className="flex gap-2">
              {[
                { icon: Bold, label: 'Negrito' },
                { icon: Italic, label: 'Itálico' },
                { icon: Underline, label: 'Sublinhado' }
              ].map(({ icon: Icon, label }) => (
                <button 
                  key={label}
                  className="flex-1 h-10 rounded-lg bg-slate-700/60 hover:bg-slate-600/80 border border-slate-600/40 hover:border-blue-500/60 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-100"
                  title={label}
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Preview melhorado */}
          <div className="space-y-3">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
              Visualização
            </label>
            <div 
              className="p-4 rounded-xl bg-slate-700/30 border border-slate-600/30 min-h-[60px] flex items-center justify-center"
              style={{
                fontFamily: selectedFont,
                fontWeight: selectedWeight.toLowerCase().replace(' ', ''),
                fontSize: `${fontSize}px`,
                color: '#f1f5f9'
              }}
            >
              <span contentEditable className="outline-none">O texto ficará assim</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
