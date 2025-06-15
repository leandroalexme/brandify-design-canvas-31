
import React, { useEffect } from 'react';
import { DesignElement } from '../types/design';
import { useFabricCanvas } from '../hooks/useFabricCanvas';
import { useFabricCanvasEvents } from '../hooks/useFabricCanvasEvents';
import { createFabricObject } from '../utils/fabricObjectFactory';

interface FabricCanvasProps {
  elements: DesignElement[];
  selectedTool: 'select' | 'pen' | 'shapes' | 'text';
  selectedColor: string;
  onAddElement: (element: Omit<DesignElement, 'id' | 'selected'>) => void;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<DesignElement>) => void;
  onCreateText: (x: number, y: number) => void;
  artboardColor?: string;
}

export const FabricCanvasComponent = ({
  elements,
  selectedTool,
  selectedColor,
  onAddElement,
  onSelectElement,
  onUpdateElement,
  onCreateText,
  artboardColor = '#ffffff'
}: FabricCanvasProps) => {
  const { canvasRef, fabricCanvas, elementMapRef } = useFabricCanvas({
    selectedTool,
    selectedColor,
    artboardColor,
  });

  // Set up canvas event handlers
  useFabricCanvasEvents({
    fabricCanvas,
    selectedTool,
    selectedColor,
    elements,
    onSelectElement,
    onUpdateElement,
    onCreateText,
    onAddElement,
  });

  // Sync elements from state to canvas
  useEffect(() => {
    if (!fabricCanvas) return;

    // Clear existing objects
    fabricCanvas.clear();
    fabricCanvas.set('backgroundColor', artboardColor);
    elementMapRef.current.clear();

    // Add elements to canvas
    elements.forEach(element => {
      const fabricObj = createFabricObject(element);
      if (fabricObj) {
        // Store element ID in fabric object for reference
        fabricObj.set('elementId', element.id);
        fabricCanvas.add(fabricObj);
        elementMapRef.current.set(element.id, fabricObj);

        // Set selection state
        if (element.selected) {
          fabricCanvas.setActiveObject(fabricObj);
        }
      }
    });

    fabricCanvas.renderAll();
  }, [elements, fabricCanvas, artboardColor]);

  return (
    <div className="flex items-center justify-center">
      <canvas ref={canvasRef} className="border border-slate-300 rounded-lg shadow-lg" />
    </div>
  );
};
