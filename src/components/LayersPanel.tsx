
import React from 'react';
import { Eye, EyeOff, Lock, Unlock, Type, MoreHorizontal } from 'lucide-react';
import { DesignElement } from '../types/design';
import { PanelContainer } from './ui/PanelContainer';

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
    console.log(`Toggle visibility for ${elementId}: ${!currentlyVisible}`);
  };

  const toggleLock = (elementId: string, currentlyLocked: boolean = false) => {
    console.log(`Toggle lock for ${elementId}: ${!currentlyLocked}`);
  };

  return (
    <PanelContainer
      isOpen={true}
      onClose={onClose}
      title={`Layers (${elements.length})`}
      position={{ x: 24, y: window.innerHeight - 500 - 100 }}
      width={384}
      height={500}
      isDraggable={true}
    >
      <div className="panel-scrollable-unified h-full">
        <div className="panel-section-unified">
          {elements.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-slate-500">Nenhuma camada criada</p>
            </div>
          ) : (
            <div className="space-y-2">
              {[...elements].reverse().map((element, reverseIndex) => {
                const originalIndex = elements.length - 1 - reverseIndex;
                return (
                  <div
                    key={element.id}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-150 group ${
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
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
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
                        className="button-icon-unified w-8 h-8"
                        title="Alternar visibilidade (V)"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleVisibility(element.id);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="button-icon-unified w-8 h-8"
                        title="Alternar bloqueio (L)"
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
            </div>
          )}
        </div>

        {/* Background Layer - Footer */}
        <div className="panel-section-unified border-t border-slate-700/60 mt-4 pt-4">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-700/30 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border-2 border-slate-600/60 flex items-center justify-center flex-shrink-0">
              <div className="w-8 h-8 bg-white rounded-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200">Background</p>
              <p className="text-xs text-slate-400">Camada de fundo</p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="button-icon-unified w-8 h-8" title="Alternar visibilidade">
                <Eye className="w-4 h-4" />
              </button>
              <button className="button-icon-unified w-8 h-8" title="Alternar bloqueio">
                <Unlock className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </PanelContainer>
  );
};
