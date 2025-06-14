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
    <div className="fixed top-1/2 right-6 transform -translate-y-1/2 z-50 animate-fade-in">
      <div className="floating-module p-4 w-64">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-200 text-sm">
            {selectedElement.type === 'text' ? 'Texto' : 
             selectedElement.type === 'shape' ? 'Forma' : 'Elemento'}
          </h3>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-lg bg-slate-700/60 hover:bg-slate-600/80 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {selectedElement.type === 'text' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Conteúdo</label>
              <input
                type="text"
                value={selectedElement.content || ''}
                onChange={(e) => onUpdateElement(selectedElement.id, { content: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700/60 border border-slate-600/60 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Tamanho</label>
              <input
                type="number"
                value={selectedElement.fontSize || 24}
                onChange={(e) => onUpdateElement(selectedElement.id, { fontSize: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-700/60 border border-slate-600/60 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
              />
            </div>
          </div>
        )}
        
        {selectedElement.type === 'shape' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Largura</label>
                <input
                  type="number"
                  value={selectedElement.width || 100}
                  onChange={(e) => onUpdateElement(selectedElement.id, { width: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-700/60 border border-slate-600/60 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Altura</label>
                <input
                  type="number"
                  value={selectedElement.height || 100}
                  onChange={(e) => onUpdateElement(selectedElement.id, { height: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-700/60 border border-slate-600/60 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                />
              </div>
            </div>
          </div>
        )}
        
        <div className="pt-4 mt-4 border-t border-slate-700/60">
          <button
            onClick={() => onDeleteElement(selectedElement.id)}
            className="w-full px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 hover:text-red-300 rounded-lg transition-colors text-sm font-medium flex items-center justify-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Excluir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
