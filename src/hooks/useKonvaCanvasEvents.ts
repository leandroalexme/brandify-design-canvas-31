
import { useEffect } from 'react';
import Konva from 'konva';
import { DesignElement } from '../types/design';

interface UseKonvaCanvasEventsProps {
  stage: Konva.Stage | null;
  layer: Konva.Layer | null;
  selectedTool: 'select' | 'pen' | 'shapes' | 'text';
  selectedColor: string;
  elements: DesignElement[];
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<DesignElement>) => void;
  onCreateText: (x: number, y: number) => void;
  onAddElement: (element: Omit<DesignElement, 'id' | 'selected'>) => void;
}

export const useKonvaCanvasEvents = ({
  stage,
  layer,
  selectedTool,
  selectedColor,
  elements,
  onSelectElement,
  onUpdateElement,
  onCreateText,
  onAddElement,
}: UseKonvaCanvasEventsProps) => {
  useEffect(() => {
    if (!stage || !layer) return;

    const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
      const clickedOnEmpty = e.target === stage;
      
      if (clickedOnEmpty && selectedTool !== 'select' && selectedTool !== 'shapes') {
        const pos = stage.getPointerPosition();
        if (!pos) return;

        if (selectedTool === 'text') {
          onCreateText(pos.x, pos.y);
        } else if (selectedTool === 'pen') {
          onAddElement({
            type: 'drawing',
            x: pos.x,
            y: pos.y,
            color: selectedColor,
            width: 4,
            height: 4,
          });
        }
      }
      
      if (clickedOnEmpty) {
        onSelectElement(null);
      }
    };

    const handleShapeClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (selectedTool === 'select' && e.target !== stage) {
        const shape = e.target;
        const elementId = shape.getAttr('elementId');
        if (elementId) {
          onSelectElement(elementId);
        }
      }
    };

    const handleShapeDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
      const shape = e.target;
      const elementId = shape.getAttr('elementId');
      if (elementId) {
        onUpdateElement(elementId, {
          x: shape.x(),
          y: shape.y(),
        });
      }
    };

    stage.on('click', handleStageClick);
    stage.on('click', handleShapeClick);
    stage.on('dragend', handleShapeDragEnd);

    return () => {
      stage.off('click', handleStageClick);
      stage.off('click', handleShapeClick);
      stage.off('dragend', handleShapeDragEnd);
    };
  }, [stage, layer, selectedTool, selectedColor, elements, onSelectElement, onUpdateElement, onCreateText, onAddElement]);
};
