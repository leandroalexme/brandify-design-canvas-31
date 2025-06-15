
import { useState, useCallback, useRef } from 'react';
import { DesignElement } from '../types/design';
import { logger } from '../utils/validation';

interface DragState {
  isDragging: boolean;
  draggedElementId: string | null;
  dragOffset: { x: number; y: number };
  startPosition: { x: number; y: number };
}

export const useDragAndDrop = (
  elements: DesignElement[],
  onUpdateElement: (id: string, updates: Partial<DesignElement>) => void,
  selectedElement: string | null
) => {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedElementId: null,
    dragOffset: { x: 0, y: 0 },
    startPosition: { x: 0, y: 0 }
  });

  const dragStartTimeRef = useRef<number>(0);

  const startDrag = useCallback((elementId: string, clientX: number, clientY: number) => {
    const element = elements.find(el => el.id === elementId);
    if (!element) {
      logger.error('Element not found for drag start', elementId);
      return;
    }

    dragStartTimeRef.current = Date.now();
    
    setDragState({
      isDragging: true,
      draggedElementId: elementId,
      dragOffset: {
        x: clientX - element.x,
        y: clientY - element.y
      },
      startPosition: { x: element.x, y: element.y }
    });

    logger.debug('Drag started', { elementId, startPosition: { x: element.x, y: element.y } });
  }, [elements]);

  const updateDrag = useCallback((clientX: number, clientY: number) => {
    if (!dragState.isDragging || !dragState.draggedElementId) return;

    const newX = Math.max(0, clientX - dragState.dragOffset.x);
    const newY = Math.max(0, clientY - dragState.dragOffset.y);

    // Throttle updates para performance
    const now = Date.now();
    if (now - dragStartTimeRef.current < 16) return; // ~60fps

    onUpdateElement(dragState.draggedElementId, { x: newX, y: newY });
    dragStartTimeRef.current = now;
  }, [dragState, onUpdateElement]);

  const endDrag = useCallback(() => {
    if (!dragState.isDragging) return;

    const dragDuration = Date.now() - dragStartTimeRef.current;
    logger.debug('Drag ended', { 
      elementId: dragState.draggedElementId, 
      duration: dragDuration 
    });

    setDragState({
      isDragging: false,
      draggedElementId: null,
      dragOffset: { x: 0, y: 0 },
      startPosition: { x: 0, y: 0 }
    });
  }, [dragState.isDragging, dragState.draggedElementId]);

  const cancelDrag = useCallback(() => {
    if (!dragState.isDragging || !dragState.draggedElementId) return;

    // Restaurar posição original
    onUpdateElement(dragState.draggedElementId, {
      x: dragState.startPosition.x,
      y: dragState.startPosition.y
    });

    endDrag();
    logger.debug('Drag cancelled', dragState.draggedElementId);
  }, [dragState, onUpdateElement, endDrag]);

  return {
    dragState,
    startDrag,
    updateDrag,
    endDrag,
    cancelDrag,
    isDragging: dragState.isDragging
  };
};
