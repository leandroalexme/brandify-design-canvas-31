
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
  enabled: boolean; // Nova prop para controlar quando está ativo
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
  enabled,
}: UseKonvaCanvasEventsProps) => {
  useEffect(() => {
    if (!stage || !layer || !enabled) return;

    console.log('🎯 [CANVAS EVENTS] Registering events for tool:', selectedTool);

    const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
      const clickedOnEmpty = e.target === stage;
      
      if (clickedOnEmpty && selectedTool !== 'select' && selectedTool !== 'shapes') {
        const pos = stage.getPointerPosition();
        if (!pos) return;

        if (selectedTool === 'text') {
          console.log('🎯 [CANVAS EVENTS] Creating text at:', pos);
          onCreateText(pos.x, pos.y);
        } else if (selectedTool === 'pen') {
          console.log('🎯 [CANVAS EVENTS] Creating drawing at:', pos);
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
      
      if (clickedOnEmpty && selectedTool === 'select') {
        onSelectElement(null);
      }
    };

    const handleShapeClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (selectedTool === 'select' && e.target !== stage) {
        const shape = e.target;
        const elementId = shape.getAttr('elementId');
        if (elementId) {
          console.log('🎯 [CANVAS EVENTS] Selecting element:', elementId);
          onSelectElement(elementId);
        }
      }
    };

    const handleShapeDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
      const shape = e.target;
      const elementId = shape.getAttr('elementId');
      if (elementId) {
        console.log('🎯 [CANVAS EVENTS] Element dragged:', elementId);
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
      console.log('🎯 [CANVAS EVENTS] Removing events');
      stage.off('click', handleStageClick);
      stage.off('click', handleShapeClick);
      stage.off('dragend', handleShapeDragEnd);
    };
  }, [stage, layer, selectedTool, selectedColor, elements, onSelectElement, onUpdateElement, onCreateText, onAddElement, enabled]);
};
