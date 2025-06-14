
import React, { useRef, useEffect } from 'react';
import { X, Eye, EyeOff, Lock, Unlock, Type, Square, MoreHorizontal } from 'lucide-react';
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
  const panelRef = useRef<HTMLDivElement>(null);

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

  const handleKeyDown = (event: React.KeyboardEvent, elementId?: string) => {
    if (!elementId) return;
    
    switch (event.key) {
      case 'Delete':
      case 'Backspace':
        event.preventDefault();
        onDeleteElement(elementId);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        onSelectElement(elementId);
        break;
    }
  };

  const toggleVisibility = (elementId: string, currentlyVisible: boolean = true) => {
    // Implementação futura - por agora apenas visual
    console.log(`Toggle visibility for ${elementId}: ${!currentlyVisible}`);
  };

  const toggleLock = (elementId: string, currentlyLocked: boolean = false) => {
    // Implementação futura - por agora apenas visual
    console.log(`Toggle lock for ${elementId}: ${!currentlyLocked}`);
  };

  // Calculate dynamic height based on viewport
  const maxHeight = Math.min(480, window.innerHeight - 200);

  return (
    <div 
      ref={panelRef}
      className="fixed bottom-20 left-6 z-50 floating-module p-0 w-72"
      style={{ maxHeight: `${maxHeight}px` }}
      role="dialog"
      aria-label="Painel de Camadas"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/60 flex-shrink-0">
        <h3 className="text-lg font-semibold text-slate-200">
          Layers ({elements.length})
        </h3>
        <div className="flex items-center gap-2">
          <button 
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-700/50"
            title="Mais opções"
            aria-label="Mais opções"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-700/50"
            title="Fechar painel"
            aria-label="Fechar painel de camadas"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Design Elements - Scrollable Area */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full max-h-80">
          <div 
            className="p-2 space-y-1"
            role="listbox"
            aria-label="Lista de camadas"
          >
            {elements.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-slate-500">Nenhuma camada criada</p>
              </div>
            ) : (
              <>
                {/* Design elements - reverse order to show last created on top */}
                {[...elements].reverse().map((element, reverseIndex) => {
                  const originalIndex = elements.length - 1 - reverseIndex;
                  return (
                    <div
                      key={element.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                        element.selected 
                          ? 'bg-blue-500/20 border border-blue-500/50 ring-2 ring-blue-500/30' 
                          : 'hover:bg-slate-700/30 focus-within:bg-slate-700/30'
                      }`}
                      onClick={() => onSelectElement(element.id)}
                      onKeyDown={(e) => handleKeyDown(e, element.id)}
                      tabIndex={0}
                      role="option"
                      aria-selected={element.selected}
                      aria-label={`Camada ${getElementName(element, originalIndex)}`}
                    >
                      {/* Layer thumbnail/icon */}
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
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
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                        <button 
                          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors rounded-md hover:bg-slate-600/50"
                          title="Alternar visibilidade (V)"
                          aria-label="Alternar visibilidade"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleVisibility(element.id);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors rounded-md hover:bg-slate-600/50"
                          title="Alternar bloqueio (L)"
                          aria-label="Alternar bloqueio"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLock(element.id);
                          }}
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

      {/* Background Layer - Fixed at Bottom */}
      <div className="border-t border-slate-700/60 p-2 flex-shrink-0">
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700/30 transition-colors group">
          <div className="w-12 h-12 rounded-lg bg-slate-100 border-2 border-slate-600/60 flex items-center justify-center flex-shrink-0">
            <div className="w-8 h-8 bg-white rounded-sm" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200">Background</p>
            <p className="text-xs text-slate-400">Camada de fundo</p>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors rounded-md hover:bg-slate-600/50"
              title="Alternar visibilidade"
              aria-label="Alternar visibilidade do fundo"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button 
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors rounded-md hover:bg-slate-600/50"
              title="Alternar bloqueio"
              aria-label="Alternar bloqueio do fundo"
            >
              <Unlock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
