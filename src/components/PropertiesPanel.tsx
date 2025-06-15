
import React from 'react';
import { DesignElement } from '../types/design';
import { Trash2, Bold, Italic, Underline } from 'lucide-react';
import { UnifiedDropdown } from './ui/UnifiedDropdown';

interface PropertiesPanelProps {
  selectedElement: DesignElement | null;
  onUpdateElement: (id: string, updates: Partial<DesignElement>) => void;
  onDeleteElement: (id: string) => void;
}

export const PropertiesPanel = ({ 
  selectedElement, 
  onUpdateElement, 
  onDeleteElement 
}: PropertiesPanelProps) => {
  const [showFontDropdown, setShowFontDropdown] = React.useState(false);
  const [showWeightDropdown, setShowWeightDropdown] = React.useState(false);

  const fonts = [
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Inter', label: 'Inter' },
    { value: 'Poppins', label: 'Poppins' },
    { value: 'Montserrat', label: 'Montserrat' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Lato', label: 'Lato' },
    { value: 'Nunito', label: 'Nunito' },
    { value: 'Source Sans Pro', label: 'Source Sans Pro' },
    { value: 'Raleway', label: 'Raleway' },
    { value: 'Ubuntu', label: 'Ubuntu' }
  ];

  const fontWeights = [
    { value: 'normal', label: 'Regular' },
    { value: 'bold', label: 'Bold' },
    { value: '300', label: 'Light' },
    { value: '600', label: 'Semi Bold' },
    { value: '800', label: 'Extra Bold' },
  ];

  if (!selectedElement) {
    return (
      <div className="w-80 panel-container-unified border-l border-slate-700/60">
        <div className="panel-content-unified">
          <div className="panel-section-unified">
            <div className="text-center py-20 animate-fade-in-60fps">
              <div className="w-16 h-16 bg-slate-700/50 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-system-title mb-2">Nenhum elemento selecionado</h3>
              <p className="text-system-caption">Selecione um elemento para editar suas propriedades</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 panel-container-unified border-l border-slate-700/60 animate-slide-in-right-60fps">
      <div className="panel-header-unified">
        <div className="panel-title-unified">Propriedades</div>
        <button
          className="panel-close-button-unified"
          onClick={() => onDeleteElement(selectedElement.id)}
          title="Excluir elemento"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="panel-content-unified">
        <div className="panel-scrollable-unified h-full">
          <div className="panel-section-unified space-y-6">
            {selectedElement.type === 'text' && (
              <>
                <div className="space-y-3">
                  <label className="panel-section-title-unified">Conteúdo</label>
                  <textarea
                    className="input-unified resize-none"
                    rows={3}
                    value={selectedElement.content || ''}
                    onChange={(e) => onUpdateElement(selectedElement.id, { content: e.target.value })}
                    placeholder="Digite o texto..."
                  />
                </div>

                <div className="space-y-3">
                  <label className="panel-section-title-unified">Família da Fonte</label>
                  <UnifiedDropdown
                    value={selectedElement.fontFamily || 'Inter'}
                    options={fonts}
                    onChange={(value) => onUpdateElement(selectedElement.id, { fontFamily: value })}
                    placeholder="Selecione uma fonte"
                    isOpen={showFontDropdown}
                    onToggle={() => setShowFontDropdown(!showFontDropdown)}
                  />
                </div>

                <div className="grid-unified-2">
                  <div className="space-y-3">
                    <label className="panel-section-title-unified">Tamanho</label>
                    <input
                      type="number"
                      min="8"
                      max="200"
                      value={selectedElement.fontSize || 24}
                      onChange={(e) => onUpdateElement(selectedElement.id, { fontSize: parseInt(e.target.value) })}
                      className="input-unified"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="panel-section-title-unified">Peso</label>
                    <UnifiedDropdown
                      value={selectedElement.fontWeight || 'normal'}
                      options={fontWeights}
                      onChange={(value) => onUpdateElement(selectedElement.id, { fontWeight: value })}
                      placeholder="Peso da fonte"
                      isOpen={showWeightDropdown}
                      onToggle={() => setShowWeightDropdown(!showWeightDropdown)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="panel-section-title-unified">Estilo</label>
                  <div className="grid-unified-3">
                    <button className="button-icon-unified" title="Negrito">
                      <Bold className="w-4 h-4" />
                    </button>
                    <button className="button-icon-unified" title="Itálico">
                      <Italic className="w-4 h-4" />
                    </button>
                    <button className="button-icon-unified" title="Sublinhado">
                      <Underline className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-3">
              <label className="panel-section-title-unified">Cor</label>
              <div className="flex items-center space-x-3">
                <div
                  className="w-12 h-12 rounded-xl border-4 border-slate-600/60 shadow-lg transition-transform hover:scale-105 cursor-pointer"
                  style={{ backgroundColor: selectedElement.color }}
                  title="Clique para alterar a cor"
                />
                <input
                  value={selectedElement.color}
                  onChange={(e) => onUpdateElement(selectedElement.id, { color: e.target.value })}
                  className="input-unified flex-1"
                  placeholder="#000000"
                />
              </div>
            </div>

            <div className="grid-unified-2">
              <div className="space-y-3">
                <label className="panel-section-title-unified">Posição X</label>
                <input
                  type="number"
                  value={Math.round(selectedElement.x)}
                  onChange={(e) => onUpdateElement(selectedElement.id, { x: parseInt(e.target.value) })}
                  className="input-unified"
                />
              </div>
              
              <div className="space-y-3">
                <label className="panel-section-title-unified">Posição Y</label>
                <input
                  type="number"
                  value={Math.round(selectedElement.y)}
                  onChange={(e) => onUpdateElement(selectedElement.id, { y: parseInt(e.target.value) })}
                  className="input-unified"
                />
              </div>
            </div>

            {selectedElement.type === 'shape' && (
              <div className="grid-unified-2">
                <div className="space-y-3">
                  <label className="panel-section-title-unified">Largura</label>
                  <input
                    type="number"
                    min="10"
                    value={selectedElement.width || 100}
                    onChange={(e) => onUpdateElement(selectedElement.id, { width: parseInt(e.target.value) })}
                    className="input-unified"
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="panel-section-title-unified">Altura</label>
                  <input
                    type="number"
                    min="10"
                    value={selectedElement.height || 100}
                    onChange={(e) => onUpdateElement(selectedElement.id, { height: parseInt(e.target.value) })}
                    className="input-unified"
                  />
                </div>
              </div>
            )}

            <div className="space-y-3">
              <label className="panel-section-title-unified">Rotação</label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={selectedElement.rotation || 0}
                  onChange={(e) => onUpdateElement(selectedElement.id, { rotation: parseInt(e.target.value) })}
                  className="flex-1"
                />
                <input
                  type="number"
                  min="-180"
                  max="180"
                  value={selectedElement.rotation || 0}
                  onChange={(e) => onUpdateElement(selectedElement.id, { rotation: parseInt(e.target.value) })}
                  className="input-unified w-16 text-center"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/60">
              <button
                onClick={() => onDeleteElement(selectedElement.id)}
                className="w-full px-4 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 hover:border-red-500/60 text-red-400 hover:text-red-300 rounded-xl transition-all duration-150 hover:scale-[1.02] text-sm font-medium flex items-center justify-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Excluir Elemento</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
