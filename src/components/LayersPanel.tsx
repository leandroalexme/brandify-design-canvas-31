
import React from 'react';
import { X, Eye, EyeOff, Lock, Unlock, Type, Square } from 'lucide-react';
import { DesignElement } from './BrandifyStudio';

interface LayersPanelProps {
  elements: DesignElement[];
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<DesignElement>) => void;
  onDeleteElement: (id: string) => void;
  onClose: () => void;
}

export const LayersPanel = ({ 
  elements, 
  onSelectElement, 
  onUpdateElement, 
  onDeleteElement, 
  onClose 
}: LayersPanelProps) => {
  return (
    <div className="fixed bottom-20 left-6 z-50 floating-module p-4 w-64">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-200">Camadas</h3>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-2">
        {elements.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">Nenhuma camada criada</p>
        ) : (
          elements.map((element, index) => (
            <div
              key={element.id}
              className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                element.selected 
                  ? 'bg-blue-500/20 border border-blue-500/50' 
                  : 'hover:bg-slate-700/50'
              }`}
              onClick={() => onSelectElement(element.id)}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                {element.type === 'text' ? (
                  <Type className="w-4 h-4 text-slate-400" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-200 truncate">
                  {element.type === 'text' 
                    ? element.content || 'Texto' 
                    : `Forma ${index + 1}`
                  }
                </p>
              </div>
              
              <div className="flex items-center gap-1">
                <button className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-200">
                  <Eye className="w-3 h-3" />
                </button>
                <button className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-200">
                  <Unlock className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
