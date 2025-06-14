
import React, { useRef, useState } from 'react';
import { Copy, Plus } from 'lucide-react';
import { DesignElement } from './BrandifyStudio';

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

  const handleArtboardClick = (e: React.MouseEvent) => {
    if (!artboardRef.current) return;
    
    const rect = artboardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Limpar seleções primeiro
    onSelectElement(null);

    if (selectedTool === 'text') {
      onCreateText(x, y);
    } else if (selectedTool === 'shapes') {
      onAddElement({
        type: 'shape',
        x,
        y,
        color: selectedColor,
        width: 100,
        height: 100,
      });
    }
  };

  const handleElementClick = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    onSelectElement(elementId);
  };

  return (
    <div className="h-screen flex items-center justify-center relative">
      {/* Artboard Title and Controls - Floating outside */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -translate-y-72">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-medium text-slate-300">Design sem título</h2>
          
          {/* Color Picker */}
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
                      onClick={() => {
                        setArtboardColor(color);
                        setShowColorPicker(false);
                      }}
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
