
import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Unlock, Type, MoreHorizontal, ChevronDown, ChevronRight, Copy, Trash2, MoveUp, MoveDown } from 'lucide-react';
import { DesignElement } from '../types/design';
import { PanelContainer } from './ui/PanelContainer';
import { useLayerManagement } from '../hooks/useLayerManagement';

interface EnhancedLayersPanelProps {
  elements: DesignElement[];
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<DesignElement>) => void;
  onDeleteElement: (id: string) => void;
  onAddElement: (element: Omit<DesignElement, 'id' | 'selected'>) => void;
  onClose: () => void;
}

export const EnhancedLayersPanel = ({ 
  elements, 
  onSelectElement, 
  onUpdateElement, 
  onDeleteElement,
  onAddElement,
  onClose 
}: EnhancedLayersPanelProps) => {
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; elementId: string } | null>(null);

  const {
    sortedElements,
    groups,
    toggleVisibility,
    toggleLock,
    createGroup,
    ungroupElements,
    moveToFront,
    moveToBack,
    duplicateElement
  } = useLayerManagement(elements, onUpdateElement, onAddElement, onDeleteElement);

  const getElementName = (element: DesignElement, index: number) => {
    if (element.type === 'text') {
      return element.content || 'Texto';
    }
    if (element.type === 'group') {
      return `Grupo ${index + 1}`;
    }
    return `${element.type === 'shape' ? 'Forma' : 'Desenho'} ${index + 1}`;
  };

  const handleLayerClick = (elementId: string, isMultiSelect: boolean = false) => {
    if (isMultiSelect) {
      setSelectedLayers(prev => 
        prev.includes(elementId) 
          ? prev.filter(id => id !== elementId)
          : [...prev, elementId]
      );
    } else {
      setSelectedLayers([elementId]);
      onSelectElement(elementId);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, elementId });
  };

  const handleCreateGroup = () => {
    if (selectedLayers.length >= 2) {
      createGroup(selectedLayers, `Grupo ${groups.length + 1}`);
      setSelectedLayers([]);
    }
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
      case 'd':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          duplicateElement(elementId);
        }
        break;
    }
  };

  return (
    <PanelContainer
      isOpen={true}
      onClose={onClose}
      title={`Layers (${elements.length})`}
      position={{ x: 24, y: window.innerHeight - 600 - 100 }}
      width={384}
      height={600}
      isDraggable={true}
    >
      <div className="panel-scrollable-unified h-full">
        {/* Layer controls */}
        <div className="panel-section-unified border-b border-slate-700/60 pb-3">
          <div className="flex gap-2">
            <button 
              className="button-unified text-xs px-3 py-1.5"
              onClick={handleCreateGroup}
              disabled={selectedLayers.length < 2}
              title="Agrupar selecionados (Ctrl+G)"
            >
              Agrupar
            </button>
            <button 
              className="button-unified text-xs px-3 py-1.5"
              onClick={() => selectedLayers.forEach(duplicateElement)}
              disabled={selectedLayers.length === 0}
              title="Duplicar (Ctrl+D)"
            >
              Duplicar
            </button>
          </div>
        </div>

        <div className="panel-section-unified">
          {sortedElements.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-slate-500">Nenhuma camada criada</p>
            </div>
          ) : (
            <div className="space-y-1">
              {[...sortedElements].reverse().map((element, reverseIndex) => {
                const originalIndex = sortedElements.length - 1 - reverseIndex;
                const isSelected = selectedLayers.includes(element.id);
                const isVisible = element.visible !== false;
                const isLocked = element.locked === true;
                
                return (
                  <div
                    key={element.id}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-150 group ${
                      element.selected || isSelected
                        ? 'bg-blue-500/20 border border-blue-500/50 ring-2 ring-blue-500/30' 
                        : 'hover:bg-slate-700/30 focus-within:bg-slate-700/30'
                    } ${!isVisible ? 'opacity-50' : ''}`}
                    onClick={(e) => handleLayerClick(element.id, e.ctrlKey || e.metaKey)}
                    onContextMenu={(e) => handleContextMenu(e, element.id)}
                    onKeyDown={(e) => handleKeyDown(e, element.id)}
                    tabIndex={0}
                    role="option"
                    aria-selected={element.selected || isSelected}
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
                      {element.groupId && (
                        <p className="text-xs text-blue-400 mt-0.5">
                          Grupo: {groups.find(g => g.id === element.groupId)?.name}
                        </p>
                      )}
                    </div>
                    
                    {/* Layer controls */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                      <button 
                        className="button-icon-unified w-8 h-8"
                        title={`Alternar visibilidade (${isVisible ? 'Ocultar' : 'Mostrar'})`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleVisibility(element.id);
                        }}
                      >
                        {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button 
                        className="button-icon-unified w-8 h-8"
                        title={`Alternar bloqueio (${isLocked ? 'Desbloquear' : 'Bloquear'})`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLock(element.id);
                        }}
                      >
                        {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </button>
                      <button 
                        className="button-icon-unified w-8 h-8"
                        title="Mais opções"
                        onClick={(e) => handleContextMenu(e, element.id)}
                      >
                        <MoreHorizontal className="w-4 h-4" />
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

      {/* Context Menu */}
      {contextMenu && (
        <div 
          className="fixed z-50 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl py-2 min-w-[160px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onBlur={() => setContextMenu(null)}
        >
          <button 
            className="w-full px-4 py-2 text-left text-sm text-slate-200 hover:bg-slate-700 flex items-center gap-2"
            onClick={() => {
              duplicateElement(contextMenu.elementId);
              setContextMenu(null);
            }}
          >
            <Copy className="w-4 h-4" />
            Duplicar
          </button>
          <button 
            className="w-full px-4 py-2 text-left text-sm text-slate-200 hover:bg-slate-700 flex items-center gap-2"
            onClick={() => {
              moveToFront(contextMenu.elementId);
              setContextMenu(null);
            }}
          >
            <MoveUp className="w-4 h-4" />
            Trazer para frente
          </button>
          <button 
            className="w-full px-4 py-2 text-left text-sm text-slate-200 hover:bg-slate-700 flex items-center gap-2"
            onClick={() => {
              moveToBack(contextMenu.elementId);
              setContextMenu(null);
            }}
          >
            <MoveDown className="w-4 h-4" />
            Enviar para trás
          </button>
          <div className="border-t border-slate-700 my-1"></div>
          <button 
            className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-slate-700 flex items-center gap-2"
            onClick={() => {
              onDeleteElement(contextMenu.elementId);
              setContextMenu(null);
            }}
          >
            <Trash2 className="w-4 h-4" />
            Deletar
          </button>
        </div>
      )}
    </PanelContainer>
  );
};
