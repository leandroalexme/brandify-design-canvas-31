
import React, { useRef } from 'react';
import { DesignElement } from './BrandifyStudio';

interface CanvasProps {
  elements: DesignElement[];
  selectedTool: 'select' | 'pen' | 'shapes' | 'text';
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
  const artboardRef = useRef<HTMLDivElement>(null);

  const handleArtboardClick = (e: React.MouseEvent) => {
    if (!artboardRef.current) return;
    
    const rect = artboardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top - 32; // Account for title height

    if (selectedTool === 'text') {
      onAddElement({
        type: 'text',
        x,
        y,
        content: 'Texto de exemplo',
        color: selectedColor,
        fontSize: 24,
        fontFamily: 'Inter',
        fontWeight: '600',
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
    <div className="h-screen flex items-center justify-center">
      {/* Artboard Container with integrated title */}
      <div className="artboard-container" style={{ width: '800px', height: '600px' }}>
        {/* Integrated Title */}
        <div className="artboard-title">
          Design sem título
        </div>
        
        {/* Artboard Content */}
        <div
          ref={artboardRef}
          className="w-full h-full relative cursor-crosshair pt-8 rounded-2xl overflow-hidden"
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
