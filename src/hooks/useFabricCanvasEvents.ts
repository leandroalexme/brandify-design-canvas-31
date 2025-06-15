import { useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DesignElement } from '../types/design';
import { createDesignElement } from '../utils/fabricElementConverter';

interface UseFabricCanvasEventsProps {
  fabricCanvas: FabricCanvas | null;
  selectedTool: 'select' | 'pen' | 'shapes' | 'text';
  selectedColor: string;
  elements: DesignElement[];
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<DesignElement>) => void;
  onCreateText: (x: number, y: number) => void;
  onAddElement: (element: Omit<DesignElement, 'id' | 'selected'>) => void;
}

export const useFabricCanvasEvents = ({
  fabricCanvas,
  selectedTool,
  selectedColor,
  elements,
  onSelectElement,
  onUpdateElement,
  onCreateText,
  onAddElement,
}: UseFabricCanvasEventsProps) => {
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
          const updates = createDesignElement(activeObject, element.type, selectedColor);
          onUpdateElement(elementId, updates);
        }
      }
    };

    const handleCanvasClick = (e: any) => {
      if (!e.target && selectedTool !== 'select' && selectedTool !== 'shapes') {
        const pointer = fabricCanvas.getPointer(e.e);
        if (selectedTool === 'text') {
          onCreateText(pointer.x, pointer.y);
        }
        else if (selectedTool === 'pen') {
          onAddElement({
            type: 'drawing',
            x: pointer.x,
            y: pointer.y,
            color: selectedColor,
            width: 4,
            height: 4,
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
  }, [fabricCanvas, selectedTool, selectedColor, elements, onSelectElement, onUpdateElement, onCreateText, onAddElement]);
};
