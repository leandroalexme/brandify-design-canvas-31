
import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { DesignElement } from '../types/design';

interface FloatingPropertiesPanelProps {
  selectedElement: DesignElement | null;
  onUpdateElement: (id: string, updates: Partial<DesignElement>) => void;
  onDeleteElement: (id: string) => void;
  onClose: () => void;
}

export const FloatingPropertiesPanel = ({ 
  selectedElement, 
  onUpdateElement, 
  onDeleteElement, 
  onClose 
}: FloatingPropertiesPanelProps) => {
  if (!selectedElement) return null;

  return (
    <div className="fixed top-1/2 right-6 transform -translate-y-1/2 z-[500] animate-scale-in-60fps">
      <div className="panel-container-unified w-64">
        <div className="panel-header-unified">
          <div className="panel-title-unified">
            {selectedElement.type === 'text' ? 'Texto' : 
             selectedElement.type === 'shape' ? 'Forma' : 'Elemento'}
          </div>
          <button
            onClick={onClose}
            className="panel-close-button-unified"
            aria-label="Fechar painel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="panel-content-unified">
          <div className="panel-section-unified space-y-4">
            {selectedElement.type === 'text' && (
              <>
                <div className="space-y-2">
                  <label className="panel-section-title-unified">Conteúdo</label>
                  <input
                    type="text"
                    value={selectedElement.content || ''}
                    onChange={(e) => onUpdateElement(selectedElement.id, { content: e.target.value })}
                    className="input-unified"
                    placeholder="Digite o texto..."
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="panel-section-title-unified">Tamanho</label>
                  <input
                    type="number"
                    value={selectedElement.fontSize || 24}
                    onChange={(e) => onUpdateElement(selectedElement.id, { fontSize: parseInt(e.target.value) })}
                    className="input-unified"
                    min="8"
                    max="200"
                  />
                </div>
              </>
            )}
            
            {selectedElement.type === 'shape' && (
              <div className="grid-unified-2">
                <div className="space-y-2">
                  <label className="panel-section-title-unified">Largura</label>
                  <input
                    type="number"
                    value={selectedElement.width || 100}
                    onChange={(e) => onUpdateElement(selectedElement.id, { width: parseInt(e.target.value) })}
                    className="input-unified"
                    min="10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="panel-section-title-unified">Altura</label>
                  <input
                    type="number"
                    value={selectedElement.height || 100}
                    onChange={(e) => onUpdateElement(selectedElement.id, { height: parseInt(e.target.value) })}
                    className="input-unified"
                    min="10"
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="panel-section-title-unified">Cor</label>
              <div className="flex items-center space-x-2">
                <div
                  className="w-8 h-8 rounded-lg border-2 border-slate-600/60 shadow-sm cursor-pointer transition-transform hover:scale-105"
                  style={{ backgroundColor: selectedElement.color }}
                  title="Cor do elemento"
                />
                <input
                  type="text"
                  value={selectedElement.color}
                  onChange={(e) => onUpdateElement(selectedElement.id, { color: e.target.value })}
                  className="input-unified flex-1"
                  placeholder="#000000"
                />
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-700/60">
              <button
                onClick={() => onDeleteElement(selectedElement.id)}
                className="w-full px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 hover:border-red-500/60 text-red-400 hover:text-red-300 rounded-xl transition-all duration-150 hover:scale-[1.02] text-sm font-medium flex items-center justify-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Excluir</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
