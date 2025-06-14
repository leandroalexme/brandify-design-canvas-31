
import React, { useRef, useState } from 'react';
import { DesignElement } from './BrandifyStudio';

interface CanvasProps {
  elements: DesignElement[];
  selectedTool: 'select' | 'text' | 'shapes' | 'draw' | 'eraser';
  selectedColor: string;
  onAddElement: (element: Omit<DesignElement, 'id' | 'selected'>) => void;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<DesignElement>) => void;
}

export const Canvas = ({ 
  elements, 
  selectedTool, 
  selectedColor, 
  onAddElement, 
  onSelectElement,
  onUpdateElement 
}: CanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (selectedTool === 'text') {
      onAddElement({
        type: 'text',
        x,
        y,
        content: 'Olá meu nome é Leandro',
        color: selectedColor,
        fontSize: 72,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
      });
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
    <div className="h-screen flex items-center justify-center bg-slate-900">
      {/* Artboard */}
      <div className="relative">
        {/* Artboard Title */}
        <div className="absolute -top-12 left-0 right-0 text-center">
          <h2 className="text-slate-400 text-lg font-medium">Untitled Design</h2>
        </div>
        
        {/* Main Artboard */}
        <div className="bg-white rounded-2xl artboard-shadow relative overflow-hidden" style={{ width: '800px', height: '600px' }}>
          <div
            ref={canvasRef}
            className="w-full h-full relative cursor-crosshair"
            onClick={handleCanvasClick}
            style={{
              backgroundImage: 'radial-gradient(circle, #e2e8f0 2px, transparent 2px)',
              backgroundSize: '24px 24px',
            }}
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
                    className="font-bold select-none"
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
                    className="rounded-full"
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
    </div>
  );
};
