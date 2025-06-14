
import React, { useRef, useEffect, useState } from 'react';
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
  const [isDrawing, setIsDrawing] = useState(false);

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
    <div className="flex-1 p-8 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/50 h-full relative overflow-hidden">
        <div
          ref={canvasRef}
          className="w-full h-full relative cursor-crosshair"
          onClick={handleCanvasClick}
          style={{
            backgroundImage: 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        >
          {elements.map((element) => (
            <div
              key={element.id}
              className={`absolute cursor-pointer ${
                element.selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
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
                  className="font-bold"
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
  );
};
