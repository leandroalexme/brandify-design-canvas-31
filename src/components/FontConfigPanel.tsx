
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Type, Minus, Plus, Bold, Italic, Underline } from 'lucide-react';
import { StandardPanelHeader } from './panels/StandardPanelHeader';
import { StandardDropdown } from './panels/StandardDropdown';
import { PanelPositioningSystem } from '../utils/panelPositioning';

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
  const [finalPosition, setFinalPosition] = useState({ x: 0, y: 0 });
  
  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const panelRef = useRef<HTMLDivElement>(null);

  // Calculate optimal positioning
  useEffect(() => {
    if (isOpen && position && !isDragging) {
      const optimalPos = PanelPositioningSystem.calculateOptimalPosition(
        position,
        { width: 320, height: 600 },
        'top'
      );
      setFinalPosition(optimalPos);
    }
  }, [isOpen, position, isDragging]);

  // Dragging handlers
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - finalPosition.x,
      y: e.clientY - finalPosition.y,
    });
  }, [finalPosition]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newX = Math.max(16, Math.min(e.clientX - dragOffset.x, window.innerWidth - 336));
      const newY = Math.max(16, Math.min(e.clientY - dragOffset.y, window.innerHeight - 400));
      
      setFinalPosition({ x: newX, y: newY });
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

  const fontOptions = [
    { value: 'Roboto Sans', label: 'Roboto Sans', description: 'Sans Serif' },
    { value: 'Inter', label: 'Inter', description: 'Sans Serif' },
    { value: 'Arial', label: 'Arial', description: 'Sans Serif' },
    { value: 'Helvetica', label: 'Helvetica', description: 'Sans Serif' },
    { value: 'Times New Roman', label: 'Times New Roman', description: 'Serif' },
    { value: 'Georgia', label: 'Georgia', description: 'Serif' },
    { value: 'Playfair Display', label: 'Playfair Display', description: 'Display' }
  ];

  const weightOptions = [
    { value: 'Light', label: 'Light' },
    { value: 'Regular', label: 'Regular' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Semi Bold', label: 'Semi Bold' },
    { value: 'Bold', label: 'Bold' },
    { value: 'Extra Bold', label: 'Extra Bold' }
  ];

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
      className={`panel-container animate-scale-in-60fps ${isDragging ? 'cursor-grabbing' : ''}`}
      style={{ 
        left: finalPosition.x, 
        top: finalPosition.y,
        willChange: 'transform'
      }}
      data-font-panel
    >
      <StandardPanelHeader
        title="Tipografia"
        icon={Type}
        iconColor="text-blue-400"
        onClose={onClose}
        isDraggable={true}
        onDragStart={handleDragStart}
      />

      <div className="panel-content">
        <StandardDropdown
          label="Família da Fonte"
          value={selectedFont}
          options={fontOptions}
          isOpen={showFontDropdown}
          onToggle={() => {
            setShowFontDropdown(!showFontDropdown);
            setShowWeightDropdown(false);
          }}
          onSelect={(font) => {
            setSelectedFont(font);
            setShowFontDropdown(false);
          }}
        />

        <StandardDropdown
          label="Peso da Fonte"
          value={selectedWeight}
          options={weightOptions}
          isOpen={showWeightDropdown}
          onToggle={() => {
            setShowWeightDropdown(!showWeightDropdown);
            setShowFontDropdown(false);
          }}
          onSelect={(weight) => {
            setSelectedWeight(weight);
            setShowWeightDropdown(false);
          }}
        />

        {/* Font Size com presets */}
        <div className="panel-section">
          <label className="panel-label">Tamanho da Fonte</label>
          
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
        <div className="panel-section">
          <label className="panel-label">Estilos</label>
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
        <div className="panel-section">
          <label className="panel-label">Visualização</label>
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
  );
};
