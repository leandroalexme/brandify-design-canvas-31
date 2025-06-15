
import React, { useState, useCallback } from 'react';
import { Copy, Plus, Trash2 } from 'lucide-react';
import { KonvaCanvasComponent } from './KonvaCanvas';
import { DesignElement } from '../types/design';

interface ProfessionalCanvasProps {
  elements: DesignElement[];
  selectedTool: 'select' | 'pen' | 'shapes' | 'text';
  selectedColor: string;
  onAddElement: (element: Omit<DesignElement, 'id' | 'selected'>) => void;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<DesignElement>) => void;
  onDeleteElement: (id: string) => void;
  onCopyElement: (id: string) => void;
  onPasteElement: () => void;
  onCreateText: (x: number, y: number) => void;
  selectedShape?: string | null;
}

export const ProfessionalCanvas = ({
  elements,
  selectedTool,
  selectedColor,
  onAddElement,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  onCopyElement,
  onPasteElement,
  onCreateText,
  selectedShape = null,
}: ProfessionalCanvasProps) => {
  const [artboardColor, setArtboardColor] = useState('#ffffff');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [clipboard, setClipboard] = useState<DesignElement | null>(null);

  const handleColorChange = useCallback((color: string) => {
    setArtboardColor(color);
    setShowColorPicker(false);
    console.log('🎨 [PROFESSIONAL CANVAS] Artboard color changed:', color);
  }, []);

  const handleCopyElement = useCallback((id: string) => {
    const element = elements.find(el => el.id === id);
    if (element) {
      setClipboard(element);
      console.log('📋 [PROFESSIONAL CANVAS] Element copied:', element);
    }
  }, [elements]);

  const handlePasteElement = useCallback(() => {
    if (clipboard) {
      const newElement = {
        ...clipboard,
        x: clipboard.x + 20,
        y: clipboard.y + 20,
        selected: false
      };
      delete (newElement as any).id;
      onAddElement(newElement);
      console.log('📋 [PROFESSIONAL CANVAS] Element pasted:', newElement);
    }
  }, [clipboard, onAddElement]);

  const selectedElement = elements.find(el => el.selected);

  // Debug log
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 [PROFESSIONAL CANVAS] State:', {
        elementsCount: elements.length,
        selectedTool,
        selectedColor,
        selectedShape,
        artboardColor,
        hasClipboard: !!clipboard
      });
    }
  }, [elements.length, selectedTool, selectedColor, selectedShape, artboardColor, clipboard]);

  return (
    <div className="h-screen flex items-center justify-center relative">
      {/* Artboard Title and Controls */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -translate-y-72">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-medium text-slate-300">Design Profissional</h2>
          
          <div className="relative">
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
            onClick={() => selectedElement && handleCopyElement(selectedElement.id)}
            disabled={!selectedElement}
          >
            <Copy className="w-4 h-4" />
          </button>
          
          <button 
            className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
            title="Nova prancheta"
          >
            <Plus className="w-4 h-4" />
          </button>

          {selectedElement && (
            <button 
              className="w-6 h-6 flex items-center justify-center text-red-400 hover:text-red-200 transition-colors"
              title="Excluir elemento selecionado"
              onClick={() => onDeleteElement(selectedElement.id)}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Atalhos de teclado - info */}
      <div className="absolute top-4 right-4 text-xs text-slate-400 bg-slate-800/50 px-3 py-2 rounded max-w-xs">
        <div className="font-medium mb-1">Atalhos:</div>
        <div>Delete/Backspace: Excluir</div>
        <div>Ctrl+C: Copiar</div>
        <div>Ctrl+V: Colar</div>
        <div>Ctrl+D: Duplicar</div>
        <div>Shift: Manter proporção</div>
        <div>Esc: Deselecionar</div>
      </div>

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 text-xs text-slate-400 bg-slate-800/50 px-3 py-2 rounded z-10">
          <div>Elementos: {elements.length}</div>
          <div>Ferramenta: {selectedTool}</div>
          <div>Forma: {selectedShape || 'nenhuma'}</div>
          <div>Cor: {selectedColor}</div>
          <div>Clipboard: {clipboard ? '✓' : '✗'}</div>
          <div>🎯 Konva.js Canvas Ativo</div>
        </div>
      )}

      {/* Konva.js Canvas */}
      <KonvaCanvasComponent
        elements={elements}
        selectedTool={selectedTool}
        selectedColor={selectedColor}
        onAddElement={onAddElement}
        onSelectElement={onSelectElement}
        onUpdateElement={onUpdateElement}
        onDeleteElement={onDeleteElement}
        onCopyElement={handleCopyElement}
        onPasteElement={handlePasteElement}
        onCreateText={onCreateText}
        artboardColor={artboardColor}
        selectedShape={selectedShape as any}
      />
    </div>
  );
};
