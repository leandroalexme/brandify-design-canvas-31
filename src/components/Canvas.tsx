
import React, { useRef, useState, useCallback } from 'react';
import { Copy, Plus } from 'lucide-react';
import { DesignElement } from '../types/design';
import { useEventListener } from '../hooks/useEventListener';

interface CanvasProps {
  elements: DesignElement[];
  selectedTool: 'select' | 'pen' | 'shapes' | 'text';
  selectedColor: string;
  onAddElement: (element: Omit<DesignElement, 'id' | 'selected'>) => void;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<DesignElement>) => void;
  onCreateText: (x: number, y: number) => void;
}

export const Canvas = ({ 
  elements, 
  selectedTool, 
  selectedColor, 
  onAddElement, 
  onSelectElement,
  onUpdateElement,
  onCreateText
}: CanvasProps) => {
  const artboardRef = useRef<HTMLDivElement>(null);
  const [artboardColor, setArtboardColor] = useState('#ffffff');
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEventListener('mousedown', useCallback((event: MouseEvent) => {
    const target = event.target as Element;
    if (showColorPicker && !target.closest('.color-picker-container')) {
      setShowColorPicker(false);
    }
  }, [showColorPicker]));

  const handleArtboardClick = useCallback((e: React.MouseEvent) => {
    console.log('🎯 [CANVAS] Artboard clicked');
    console.log('🔧 [CANVAS] Current tool:', selectedTool);
    console.log('📊 [CANVAS] Elements count:', elements.length);
    
    if (!artboardRef.current) {
      console.error('❌ [CANVAS] Artboard ref is null');
      return;
    }
    
    const rect = artboardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    console.log('📍 [CANVAS] Click coordinates:', { x, y });

    // Validar coordenadas
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      console.warn('⚠️ [CANVAS] Click outside artboard bounds');
      return;
    }

    // Limpar seleções primeiro
    onSelectElement(null);

    if (selectedTool === 'text') {
      console.log('📝 [CANVAS] Creating text element');
      onCreateText(x, y);
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
    }
  }, [artboardRef, onSelectElement, selectedTool, onCreateText, onAddElement, selectedColor, elements.length]);

  const handleElementClick = useCallback((e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    console.log('🎯 [CANVAS] Element clicked:', elementId);
    onSelectElement(elementId);
  }, [onSelectElement]);

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
          className="w-full h-full relative cursor-crosshair rounded-2xl overflow-hidden"
          onClick={handleArtboardClick}
        >
          {/* Debug info */}
          <div className="absolute top-2 left-2 text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded z-10">
            Elementos: {elements.length} | Ferramenta: {selectedTool}
          </div>
          
          {/* Render elements */}
          {elements.map((element) => {
            console.log('🎨 [CANVAS] Rendering element:', element);
            
            return (
              <div
                key={element.id}
                className={`absolute cursor-pointer transition-all duration-200 ${
                  element.selected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white' : ''
                }`}
                style={{
                  left: element.x,
                  top: element.y,
                  transform: `rotate(${element.rotation || 0}deg)`,
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
