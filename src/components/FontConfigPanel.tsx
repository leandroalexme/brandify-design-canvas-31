
import React from 'react';
import { Type, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { PanelContainer } from './ui/PanelContainer';

interface FontConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
  position?: { x: number; y: number };
}

export const FontConfigPanel = ({ 
  isOpen, 
  onClose, 
  position = { x: 200, y: 200 }
}: FontConfigPanelProps) => {
  const [selectedFont, setSelectedFont] = React.useState('Inter');
  const [fontSize, setFontSize] = React.useState(16);
  const [fontWeight, setFontWeight] = React.useState('400');
  const [lineHeight, setLineHeight] = React.useState(1.5);
  const [letterSpacing, setLetterSpacing] = React.useState(0);

  const fonts = [
    'Inter', 'Helvetica', 'Arial', 'Times New Roman', 
    'Georgia', 'Roboto', 'Open Sans', 'Lato'
  ];

  const weights = [
    { label: 'Thin', value: '100' },
    { label: 'Light', value: '300' },
    { label: 'Regular', value: '400' },
    { label: 'Medium', value: '500' },
    { label: 'Semi Bold', value: '600' },
    { label: 'Bold', value: '700' },
    { label: 'Black', value: '900' }
  ];

  const handleFontChange = (font: string) => {
    setSelectedFont(font);
    console.log('🎨 [FONT CONFIG] Font changed to:', font);
  };

  return (
    <PanelContainer
      isOpen={isOpen}
      onClose={onClose}
      title="Tipografia"
      position={position}
      width={384}
      height={600}
      dataAttribute="data-font-panel"
      isDraggable={true}
    >
      <div className="panel-scrollable-unified h-full">
        <div className="panel-section-unified space-y-6">
          {/* Font Family */}
          <div className="space-y-3">
            <label className="panel-section-title-unified">Família da Fonte</label>
            <select
              value={selectedFont}
              onChange={(e) => handleFontChange(e.target.value)}
              className="input-unified"
            >
              {fonts.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>

          {/* Font Size */}
          <div className="space-y-3">
            <label className="panel-section-title-unified">Tamanho</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="8"
                max="72"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="flex-1"
              />
              <input
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="input-unified w-16 text-center"
                min="8"
                max="72"
              />
            </div>
          </div>

          {/* Font Weight */}
          <div className="space-y-3">
            <label className="panel-section-title-unified">Peso</label>
            <select
              value={fontWeight}
              onChange={(e) => setFontWeight(e.target.value)}
              className="input-unified"
            >
              {weights.map(weight => (
                <option key={weight.value} value={weight.value}>
                  {weight.label}
                </option>
              ))}
            </select>
          </div>

          {/* Line Height */}
          <div className="space-y-3">
            <label className="panel-section-title-unified">Altura da Linha</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={lineHeight}
                onChange={(e) => setLineHeight(Number(e.target.value))}
                className="flex-1"
              />
              <input
                type="number"
                value={lineHeight}
                onChange={(e) => setLineHeight(Number(e.target.value))}
                className="input-unified w-16 text-center"
                min="1"
                max="3"
                step="0.1"
              />
            </div>
          </div>

          {/* Letter Spacing */}
          <div className="space-y-3">
            <label className="panel-section-title-unified">Espaçamento</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="-2"
                max="4"
                step="0.1"
                value={letterSpacing}
                onChange={(e) => setLetterSpacing(Number(e.target.value))}
                className="flex-1"
              />
              <input
                type="number"
                value={letterSpacing}
                onChange={(e) => setLetterSpacing(Number(e.target.value))}
                className="input-unified w-16 text-center"
                min="-2"
                max="4"
                step="0.1"
              />
            </div>
          </div>

          {/* Style Controls */}
          <div className="space-y-3">
            <label className="panel-section-title-unified">Estilo</label>
            <div className="grid-unified-3">
              <button className="button-icon-unified" title="Negrito">
                <Bold className="w-5 h-5" />
              </button>
              <button className="button-icon-unified" title="Itálico">
                <Italic className="w-5 h-5" />
              </button>
              <button className="button-icon-unified" title="Sublinhado">
                <Underline className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-3">
            <label className="panel-section-title-unified">Prévia</label>
            <div 
              className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/40"
              style={{
                fontFamily: selectedFont,
                fontSize: `${fontSize}px`,
                fontWeight: fontWeight,
                lineHeight: lineHeight,
                letterSpacing: `${letterSpacing}px`
              }}
            >
              <p className="text-slate-200">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PanelContainer>
  );
};
