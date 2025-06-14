
import React from 'react';
import { X, Eye, EyeOff, Lock, Unlock, Type, Square, Image, MoreHorizontal } from 'lucide-react';
import { DesignElement } from './BrandifyStudio';
import { ScrollArea } from './ui/scroll-area';

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
  const getElementIcon = (element: DesignElement) => {
    switch (element.type) {
      case 'text':
        return <Type className="w-5 h-5 text-slate-300" />;
      case 'shape':
        return <Square className="w-5 h-5 text-slate-300" />;
      default:
        return <Square className="w-5 h-5 text-slate-300" />;
    }
  };

  const getElementName = (element: DesignElement, index: number) => {
    if (element.type === 'text') {
      return element.content || 'Texto';
    }
    return `Forma ${index + 1}`;
  };

  return (
    <div className="fixed bottom-20 left-6 z-50 floating-module p-0 w-72 h-96">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/60">
        <h3 className="text-lg font-semibold text-slate-200">Layers</h3>
        <div className="flex items-center gap-2">
          <button className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Layers List */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {elements.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-slate-500">Nenhuma camada criada</p>
            </div>
          ) : (
            <>
              {/* Background layer - always at bottom */}
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/30 transition-colors group">
                <div className="w-12 h-12 rounded-lg bg-slate-100 border-2 border-slate-600/60 flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200">Background</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
                    title="Visibilidade"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
                    title="Bloquear"
                  >
                    <Unlock className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Design elements - reverse order to show last created on top */}
              {[...elements].reverse().map((element, reverseIndex) => {
                const originalIndex = elements.length - 1 - reverseIndex;
                return (
                  <div
                    key={element.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors group ${
                      element.selected 
                        ? 'bg-blue-500/20 border border-blue-500/50' 
                        : 'hover:bg-slate-700/30'
                    }`}
                    onClick={() => onSelectElement(element.id)}
                  >
                    {/* Layer thumbnail/icon */}
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      element.type === 'text' 
                        ? 'bg-white text-black' 
                        : 'border-2'
                    }`} style={{
                      backgroundColor: element.type === 'shape' ? element.color : undefined,
                      borderColor: element.type === 'shape' ? element.color : '#64748b'
                    }}>
                      {element.type === 'text' ? (
                        <Type className="w-5 h-5" />
                      ) : (
                        <div className="w-6 h-6 rounded-sm" style={{ backgroundColor: element.color }} />
                      )}
                    </div>
                    
                    {/* Layer info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">
                        {getElementName(element, originalIndex)}
                      </p>
                      {element.type === 'text' && element.content && element.content.length > 20 && (
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {element.content}
                        </p>
                      )}
                    </div>
                    
                    {/* Layer controls */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
                        title="Visibilidade"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
                        title="Bloquear"
                      >
                        <Unlock className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
