
import React, { useRef, useState, useCallback } from 'react';
import { Copy, Plus } from 'lucide-react';
import { DesignElement } from '../types/design';
import { useEventListener } from '../hooks/useEventListener';
import { useAdvancedInteractions } from '../hooks/useAdvancedInteractions';

interface CanvasProps {
  elements: DesignElement[];
  selectedTool: 'select' | 'pen' | 'shapes' | 'text';
  selectedColor: string;
  onAddElement: (element: Omit<DesignElement, 'id' | 'selected'>) => void;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<DesignElement>) => void;
  onCreateText: (x: number, y: number) => void;
  setElements?: (elements: DesignElement[]) => void;
}

export const Canvas = ({ 
  elements, 
  selectedTool, 
  selectedColor, 
  onAddElement, 
  onSelectElement,
  onUpdateElement,
  onCreateText,
  setElements = () => {}
}: CanvasProps) => {
  const artboardRef = useRef<HTMLDivElement>(null);
  const [artboardColor, setArtboardColor] = useState('#ffffff');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectionBox, setSelectionBox] = useState<{ start: { x: number; y: number }; end: { x: number; y: number } } | null>(null);

  // Advanced interactions
  const interactions = useAdvancedInteractions(
    elements,
    setElements,
    onUpdateElement,
    elements.find(el => el.selected)?.id || null
  );

  useEventListener('mousedown', useCallback((event: MouseEvent) => {
    const target = event.target as Element;
    if (showColorPicker && !target.closest('.color-picker-container')) {
      setShowColorPicker(false);
    }
  }, [showColorPicker]));

  // Handlers de mouse para seleção por área
  const [isAreaSelecting, setIsAreaSelecting] = useState(false);

  const handleArtboardMouseDown = useCallback((e: React.MouseEvent) => {
    if (!artboardRef.current) return;
    
    const rect = artboardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Validar coordenadas
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

    if (selectedTool === 'select') {
      // Iniciar seleção por área se Ctrl/Cmd estiver pressionado
      if (e.ctrlKey || e.metaKey) {
        setIsAreaSelecting(true);
        setSelectionBox({ start: { x, y }, end: { x, y } });
      } else {
        // Limpar seleção se clicar no artboard
        interactions.clearSelection();
        onSelectElement(null);
      }
    } else {
      // Comportamento original para outras ferramentas
      onSelectElement(null);

      if (selectedTool === 'text') {
        console.log('📝 [CANVAS] Creating text element');
        onCreateText(x, y);
        interactions.autoSaveState('Create text');
      } else if (selectedTool === 'shapes') {
        console.log('🔷 [CANVAS] Creating shape element');
        onAddElement({
          type: 'shape',
          x,
          y,
          color: selectedColor,
          width: 100,
          height: 100,
        });
        interactions.autoSaveState('Create shape');
      }
    }
  }, [selectedTool, selectedColor, onAddElement, onCreateText, onSelectElement, interactions]);

  const handleArtboardMouseMove = useCallback((e: React.MouseEvent) => {
    if (!artboardRef.current) return;

    // Handle drag operations
    interactions.handleMouseMove(e);

    // Handle area selection
    if (isAreaSelecting && selectionBox) {
      const rect = artboardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setSelectionBox(prev => prev ? { ...prev, end: { x, y } } : null);
    }
  }, [interactions, isAreaSelecting, selectionBox]);

  const handleArtboardMouseUp = useCallback(() => {
    // Handle drag end
    interactions.handleMouseUp();

    // Handle area selection end
    if (isAreaSelecting && selectionBox) {
      const { start, end } = selectionBox;
      interactions.selectInArea(start.x, start.y, end.x, end.y);
      setIsAreaSelecting(false);
      setSelectionBox(null);
    }
  }, [interactions, isAreaSelecting, selectionBox]);

  const handleElementClick = useCallback((e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    console.log('🎯 [CANVAS] Element clicked:', elementId);
    
    if (selectedTool === 'select') {
      interactions.handleElementMouseDown(elementId, e);
    } else {
      onSelectElement(elementId);
    }
  }, [selectedTool, interactions, onSelectElement]);

  const handleColorChange = useCallback((color: string) => {
    setArtboardColor(color);
    setShowColorPicker(false);
    console.log('🎨 [CANVAS] Artboard color changed:', color);
  }, []);

  // Debug log para elementos
  React.useEffect(() => {
    console.log('📊 [CANVAS] Elements updated:', {
      count: elements.length,
      elements: elements.map(el => ({ id: el.id, type: el.type, x: el.x, y: el.y }))
    });
  }, [elements]);

  return (
    <div className="h-screen flex items-center justify-center relative">
      {/* Artboard Title and Controls */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -translate-y-72">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-medium text-slate-300">Design sem título</h2>
          
          <div className="relative color-picker-container">
            <button
              className="w-6 h-6 rounded-lg border-2 border-slate-600/60 shadow-sm transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: artboardColor }}
              onClick={() => setShowColorPicker(!showColorPicker)}
              title="Cor da prancheta"
            />
            
            {showColorPicker && (
              <div className="absolute top-8 left-0 z-50 p-3 bg-slate-800 rounded-xl border border-slate-700 shadow-2xl">
                <div className="grid grid-cols-4 gap-2">
                  {['#ffffff', '#f8fafc', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', '#475569', '#334155'].map((color) => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded-lg border-2 border-slate-600/60 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorChange(color)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <button 
            className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
            title="Duplicar prancheta"
          >
            <Copy className="w-4 h-4" />
          </button>
          
          <button 
            className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
            title="Nova prancheta"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Artboard Container */}
      <div 
        className="artboard-container relative" 
        style={{ width: '800px', height: '600px', backgroundColor: artboardColor }}
      >
        <div
          ref={artboardRef}
          className={`w-full h-full relative rounded-2xl overflow-hidden ${
            selectedTool === 'select' ? 'cursor-default' : 'cursor-crosshair'
          }`}
          onMouseDown={handleArtboardMouseDown}
          onMouseMove={handleArtboardMouseMove}
          onMouseUp={handleArtboardMouseUp}
        >
          {/* Debug info */}
          <div className="absolute top-2 left-2 text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded z-10">
            Elementos: {elements.length} | Ferramenta: {selectedTool} | Modo: {interactions.interactionMode}
            {interactions.canUndo && <span> | Undo disponível</span>}
            {interactions.canRedo && <span> | Redo disponível</span>}
          </div>
          
          {/* Selection box */}
          {selectionBox && (
            <div
              className="absolute border-2 border-blue-500 bg-blue-500/20 pointer-events-none z-20"
              style={{
                left: Math.min(selectionBox.start.x, selectionBox.end.x),
                top: Math.min(selectionBox.start.y, selectionBox.end.y),
                width: Math.abs(selectionBox.end.x - selectionBox.start.x),
                height: Math.abs(selectionBox.end.y - selectionBox.start.y),
              }}
            />
          )}
          
          {/* Render elements */}
          {elements.map((element) => {
            const isMultiSelected = interactions.selectedIds.has(element.id);
            const isDragTarget = interactions.dragState.draggedElementId === element.id;
            
            return (
              <div
                key={element.id}
                className={`absolute transition-all duration-100 ${
                  selectedTool === 'select' ? 'cursor-move' : 'cursor-pointer'
                } ${
                  element.selected || isMultiSelected 
                    ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white' 
                    : ''
                } ${
                  isDragTarget ? 'opacity-80 scale-105' : ''
                } ${
                  isMultiSelected && interactions.selectedCount > 1 
                    ? 'ring-green-500' 
                    : ''
                }`}
                style={{
                  left: element.x,
                  top: element.y,
                  transform: `rotate(${element.rotation || 0}deg)`,
                  zIndex: isDragTarget ? 100 : 1
                }}
                onMouseDown={(e) => {
                  if (selectedTool === 'select') {
                    interactions.handleElementMouseDown(element.id, e);
                  }
                }}
                onClick={(e) => handleElementClick(e, element.id)}
              >
                {element.type === 'text' && (
                  <div
                    className="select-none min-w-[100px] min-h-[30px] bg-transparent p-1"
                    style={{
                      color: element.color || '#000000',
                      fontSize: `${element.fontSize || 24}px`,
                      fontFamily: element.fontFamily || 'Inter',
                      fontWeight: element.fontWeight || 'normal',
                      lineHeight: '1.2',
                    }}
                  >
                    {element.content || 'Texto vazio'}
                  </div>
                )}
                
                {element.type === 'shape' && (
                  <div
                    className="rounded-2xl"
                    style={{
                      backgroundColor: element.color,
                      width: element.width || 100,
                      height: element.height || 100,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
