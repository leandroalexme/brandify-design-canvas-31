
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas as FabricCanvas, FabricObject, Circle, Rect, IText } from 'fabric';
import { DesignElement } from '../types/design';

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const elementMapRef = useRef<Map<string, FabricObject>>(new Map());

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: artboardColor,
      selection: selectedTool === 'select',
      preserveObjectStacking: true,
    });

    // Configure drawing mode
    canvas.isDrawingMode = selectedTool === 'pen';
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = selectedColor;
      canvas.freeDrawingBrush.width = 2;
    }

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  // Update canvas settings when tool changes
  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = selectedTool === 'pen';
    fabricCanvas.selection = selectedTool === 'select';

    if (selectedTool === 'pen' && fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = selectedColor;
      fabricCanvas.freeDrawingBrush.width = 2;
    }

    fabricCanvas.renderAll();
  }, [selectedTool, selectedColor, fabricCanvas]);

  // Update artboard color
  useEffect(() => {
    if (!fabricCanvas) return;
    fabricCanvas.set('backgroundColor', artboardColor);
    fabricCanvas.renderAll();
  }, [artboardColor, fabricCanvas]);

  // Convert DesignElement to Fabric object
  const createFabricObject = useCallback((element: DesignElement): FabricObject | null => {
    switch (element.type) {
      case 'shape':
        return new Rect({
          left: element.x,
          top: element.y,
          width: element.width || 100,
          height: element.height || 100,
          fill: element.color,
          angle: element.rotation || 0,
        });

      case 'text':
        return new IText(element.content || 'Texto', {
          left: element.x,
          top: element.y,
          fill: element.color,
          fontSize: element.fontSize || 24,
          fontFamily: element.fontFamily || 'Inter',
          fontWeight: element.fontWeight || 'normal',
          angle: element.rotation || 0,
        });

      case 'drawing':
        return new Circle({
          left: element.x,
          top: element.y,
          radius: (element.width || 4) / 2,
          fill: element.color,
          angle: element.rotation || 0,
        });

      default:
        return null;
    }
  }, []);

  // Convert Fabric object to DesignElement
  const createDesignElement = useCallback((fabricObj: FabricObject, type: DesignElement['type']): Omit<DesignElement, 'id' | 'selected'> => {
    // Helper function to ensure color is always a string
    const getColorAsString = (fill: any): string => {
      if (typeof fill === 'string') {
        return fill;
      }
      // For non-string fills (gradients, patterns, etc.), return the selected color as fallback
      return selectedColor;
    };

    const commonProps = {
      x: fabricObj.left || 0,
      y: fabricObj.top || 0,
      color: getColorAsString(fabricObj.fill),
      rotation: fabricObj.angle || 0,
    };

    switch (type) {
      case 'shape':
        return {
          ...commonProps,
          type: 'shape',
          width: fabricObj.width || 100,
          height: fabricObj.height || 100,
        };

      case 'text':
        const textObj = fabricObj as IText;
        return {
          ...commonProps,
          type: 'text',
          content: textObj.text || 'Texto',
          fontSize: textObj.fontSize || 24,
          fontFamily: textObj.fontFamily || 'Inter',
          fontWeight: textObj.fontWeight || 'normal',
        };

      case 'drawing':
        const circleObj = fabricObj as Circle;
        return {
          ...commonProps,
          type: 'drawing',
          width: (circleObj.radius || 2) * 2,
          height: (circleObj.radius || 2) * 2,
        };

      default:
        return commonProps as any;
    }
  }, [selectedColor]);

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
  }, [elements, fabricCanvas, createFabricObject, artboardColor]);

  // Handle canvas events
  useEffect(() => {
    if (!fabricCanvas) return;

    const handleObjectSelection = () => {
      const activeObject = fabricCanvas.getActiveObject();
      if (activeObject && activeObject.get('elementId')) {
        onSelectElement(activeObject.get('elementId') as string);
      } else {
        onSelectElement(null);
      }
    };

    const handleObjectModified = () => {
      const activeObject = fabricCanvas.getActiveObject();
      if (activeObject && activeObject.get('elementId')) {
        const elementId = activeObject.get('elementId') as string;
        const element = elements.find(el => el.id === elementId);
        if (element) {
          const updates = createDesignElement(activeObject, element.type);
          onUpdateElement(elementId, updates);
        }
      }
    };

    const handleCanvasClick = (e: any) => {
      if (!e.target && selectedTool !== 'select') {
        const pointer = fabricCanvas.getPointer(e.e);
        
        if (selectedTool === 'text') {
          onCreateText(pointer.x, pointer.y);
        } else if (selectedTool === 'shapes') {
          onAddElement({
            type: 'shape',
            x: pointer.x - 50,
            y: pointer.y - 50,
            color: selectedColor,
            width: 100,
            height: 100,
          });
        }
      }
    };

    const handlePathCreated = (e: any) => {
      if (selectedTool === 'pen') {
        const path = e.path;
        onAddElement({
          type: 'drawing',
          x: path.left || 0,
          y: path.top || 0,
          color: selectedColor,
          width: path.width || 4,
          height: path.height || 4,
        });
      }
    };

    fabricCanvas.on('selection:created', handleObjectSelection);
    fabricCanvas.on('selection:updated', handleObjectSelection);
    fabricCanvas.on('selection:cleared', () => onSelectElement(null));
    fabricCanvas.on('object:modified', handleObjectModified);
    fabricCanvas.on('mouse:down', handleCanvasClick);
    fabricCanvas.on('path:created', handlePathCreated);

    return () => {
      fabricCanvas.off('selection:created', handleObjectSelection);
      fabricCanvas.off('selection:updated', handleObjectSelection);
      fabricCanvas.off('selection:cleared');
      fabricCanvas.off('object:modified', handleObjectModified);
      fabricCanvas.off('mouse:down', handleCanvasClick);
      fabricCanvas.off('path:created', handlePathCreated);
    };
  }, [fabricCanvas, selectedTool, selectedColor, elements, onSelectElement, onUpdateElement, onCreateText, onAddElement, createDesignElement]);

  return (
    <div className="flex items-center justify-center">
      <canvas ref={canvasRef} className="border border-slate-300 rounded-lg shadow-lg" />
    </div>
  );
};
