
import React, { useEffect, useRef } from 'react';
import { DesignElement } from '../types/design';
import { useKonvaCanvas } from '../hooks/useKonvaCanvas';
import { useKonvaCanvasEvents } from '../hooks/useKonvaCanvasEvents';
import { useKonvaShapeCreation } from '../hooks/useKonvaShapeCreation';
import { createKonvaObject } from '../utils/konvaObjectFactory';
import { ShapeType } from '../utils/konvaShapeFactory';

interface KonvaCanvasProps {
  elements: DesignElement[];
  selectedTool: 'select' | 'pen' | 'shapes' | 'text';
  selectedColor: string;
  onAddElement: (element: Omit<DesignElement, 'id' | 'selected'>) => void;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<DesignElement>) => void;
  onCreateText: (x: number, y: number) => void;
  artboardColor?: string;
  selectedShape?: ShapeType | null;
}

export const KonvaCanvasComponent = ({
  elements,
  selectedTool,
  selectedColor,
  onAddElement,
  onSelectElement,
  onUpdateElement,
  onCreateText,
  artboardColor = '#ffffff',
  selectedShape = null,
}: KonvaCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementMapRef = useRef<Map<string, any>>(new Map());

  const { stageRef, layerRef, initializeCanvas, isReady } = useKonvaCanvas({
    selectedTool,
    selectedColor,
    artboardColor,
  });

  // Initialize canvas
  useEffect(() => {
    if (containerRef.current && !stageRef.current) {
      initializeCanvas(containerRef.current);
    }
  }, [initializeCanvas]);

  // Shape creation mode
  useKonvaShapeCreation({
    stage: stageRef.current,
    layer: layerRef.current,
    selectedShape: selectedTool === 'shapes' ? selectedShape : null,
    color: selectedColor,
    onAddElement: onAddElement,
  });

  // Set up canvas event handlers
  useKonvaCanvasEvents({
    stage: stageRef.current,
    layer: layerRef.current,
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
    if (!stageRef.current || !layerRef.current || !isReady) return;

    // Clear existing objects
    layerRef.current.destroyChildren();
    elementMapRef.current.clear();

    // Add elements to canvas
    elements.forEach(element => {
      const konvaObj = createKonvaObject(element);
      if (konvaObj) {
        // Store element ID in konva object for reference
        konvaObj.setAttr('elementId', element.id);
        layerRef.current!.add(konvaObj);
        elementMapRef.current.set(element.id, konvaObj);

        // Set selection state
        if (element.selected) {
          konvaObj.stroke('#2563eb');
          konvaObj.strokeWidth(2);
        } else {
          konvaObj.stroke(undefined);
          konvaObj.strokeWidth(0);
        }
      }
    });

    layerRef.current.draw();
  }, [elements, isReady]);

  return (
    <div className="flex items-center justify-center">
      <div 
        ref={containerRef}
        className="border border-slate-300 rounded-lg shadow-lg"
        style={{ backgroundColor: artboardColor }}
      />
    </div>
  );
};
