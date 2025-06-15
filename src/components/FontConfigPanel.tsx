
import React, { useState } from 'react';
import { ChevronDown, Minus, Plus, Bold, Italic, Underline } from 'lucide-react';
import { PanelContainer } from './ui/PanelContainer';

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
    <PanelContainer
      isOpen={isOpen}
      onClose={onClose}
      title="Tipografia"
      position={position}
      width={384}
      height={700}
      dataAttribute="data-font-panel"
      isDraggable={true}
    >
      <div className="panel-scrollable-unified h-full">
        <div className="panel-section-unified space-y-6">
          {/* Font Family */}
          <div className="space-y-4">
            <h4 className="panel-section-title-unified">Família da Fonte</h4>
            <div className="relative">
              <button
                onClick={() => {
                  setShowFontDropdown(!showFontDropdown);
                  setShowWeightDropdown(false);
                }}
                className="input-unified flex items-center justify-between cursor-pointer"
              >
                <div className="text-left">
                  <div className="text-sm font-medium text-slate-200">{selectedFont}</div>
                  <div className="text-xs text-slate-400">
                    {fonts.find(f => f.name === selectedFont)?.category}
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFontDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showFontDropdown && (
                <div className="dropdown-unified">
                  {fonts.map((font) => (
                    <button
                      key={font.name}
                      onClick={() => {
                        setSelectedFont(font.name);
                        setShowFontDropdown(false);
                      }}
                      className={`dropdown-item-unified ${selectedFont === font.name ? 'selected' : ''}`}
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
          <div className="space-y-4">
            <h4 className="panel-section-title-unified">Peso da Fonte</h4>
            <div className="relative">
              <button
                onClick={() => {
                  setShowWeightDropdown(!showWeightDropdown);
                  setShowFontDropdown(false);
                }}
                className="input-unified flex items-center justify-between cursor-pointer"
              >
                <span className="text-sm font-medium text-slate-200">{selectedWeight}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showWeightDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showWeightDropdown && (
                <div className="dropdown-unified">
                  {weights.map((weight) => (
                    <button
                      key={weight}
                      onClick={() => {
                        setSelectedWeight(weight);
                        setShowWeightDropdown(false);
                      }}
                      className={`dropdown-item-unified ${selectedWeight === weight ? 'selected' : ''}`}
                    >
                      {weight}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Font Size */}
          <div className="space-y-4">
            <h4 className="panel-section-title-unified">Tamanho da Fonte</h4>
            
            {/* Presets rápidos */}
            <div className="grid-unified-auto">
              {sizePresets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setFontSize(preset.size)}
                  className={`button-secondary-unified text-xs ${
                    fontSize === preset.size ? 'bg-blue-500/80 text-white border-blue-400/60' : ''
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
                className="button-icon-unified"
              >
                <Minus className="w-4 h-4" />
              </button>
              
              <div className="flex-1 text-center">
                <input
                  type="number"
                  value={fontSize}
                  onChange={(e) => handleFontSizeChange(parseInt(e.target.value) || fontSize)}
                  className="input-unified text-center text-xl font-bold"
                  min="8"
                  max="72"
                />
                <div className="text-xs text-slate-400 mt-1">pixels</div>
              </div>
              
              <button
                onClick={() => handleFontSizeChange(fontSize + 1)}
                className="button-icon-unified bg-blue-500/80 border-blue-400/60 text-white"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Text Styles */}
          <div className="space-y-4">
            <h4 className="panel-section-title-unified">Estilos</h4>
            <div className="grid-unified-3">
              {[
                { icon: Bold, label: 'Negrito' },
                { icon: Italic, label: 'Itálico' },
                { icon: Underline, label: 'Sublinhado' }
              ].map(({ icon: Icon, label }) => (
                <button 
                  key={label}
                  className="button-icon-unified"
                  title={label}
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <h4 className="panel-section-title-unified">Visualização</h4>
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
    </PanelContainer>
  );
};
