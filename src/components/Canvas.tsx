import React, { useRef, useState, useCallback } from 'react';
import { Copy, Plus } from 'lucide-react';
import { DesignElement } from '../types/design';
import { useEventListener } from '../hooks/useEventListener';
import { logger, isValidPosition } from '../utils/validation';

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

  // Event listener otimizado para fechar color picker
  useEventListener('mousedown', useCallback((event: MouseEvent) => {
    const target = event.target as Element;
    if (showColorPicker && !target.closest('.color-picker-container')) {
      setShowColorPicker(false);
    }
  }, [showColorPicker]));

  const handleArtboardClick = useCallback((e: React.MouseEvent) => {
    try {
      console.log('Artboard clicked with tool:', selectedTool);
      
      if (!artboardRef.current) return;
      
      const rect = artboardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      console.log('Click coordinates:', { x, y });

      if (!isValidPosition({ x, y })) {
        logger.error('Invalid click position', { x, y });
        return;
      }

      // Limpar seleções primeiro
      onSelectElement(null);

      if (selectedTool === 'text') {
        console.log('Creating text at:', { x, y });
        onCreateText(x, y);
        logger.debug('Text creation triggered', { x, y });
      } else if (selectedTool === 'shapes') {
        console.log('Creating shape at:', { x, y });
        onAddElement({
          type: 'shape',
          x,
          y,
          color: selectedColor,
          width: 100,
          height: 100,
        });
        logger.debug('Shape created', { x, y, color: selectedColor });
      }
    } catch (error) {
      logger.error('Error handling artboard click', error);
    }
  }, [artboardRef, onSelectElement, selectedTool, onCreateText, onAddElement, selectedColor]);

  const handleElementClick = useCallback((e: React.MouseEvent, elementId: string) => {
    try {
      e.stopPropagation();
      onSelectElement(elementId);
      logger.debug('Element selected', elementId);
    } catch (error) {
      logger.error('Error selecting element', error);
    }
  }, [onSelectElement]);

  const handleColorChange = useCallback((color: string) => {
    try {
      setArtboardColor(color);
      setShowColorPicker(false);
      logger.debug('Artboard color changed', color);
    } catch (error) {
      logger.error('Error changing artboard color', error);
    }
  }, []);

  return (
    <div className="h-screen flex items-center justify-center relative">
      {/* Artboard Title and Controls - Floating outside */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -translate-y-72">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-medium text-slate-300">Design sem título</h2>
          
          {/* Color Picker */}
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
          
          {/* Duplicate/Add Icons */}
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
        {/* Artboard Content */}
        <div
          ref={artboardRef}
          className="w-full h-full relative cursor-crosshair rounded-2xl overflow-hidden"
          onClick={handleArtboardClick}
        >
          {elements.map((element) => (
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
                  className="select-none"
                  style={{
                    color: element.color,
                    fontSize: `${element.fontSize}px`,
                    fontFamily: element.fontFamily,
                    fontWeight: element.fontWeight,
                  }}
                >
                  {element.content}
                </div>
              )}
              
              {element.type === 'shape' && (
                <div
                  className="rounded-2xl"
                  style={{
                    backgroundColor: element.color,
                    width: element.width,
                    height: element.height,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
