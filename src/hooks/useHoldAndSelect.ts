
import { useRef, useCallback } from 'react';

interface UseHoldAndSelectParams {
  onShapeSelect: (shape: string) => void;
  holdDelay?: number;
}

export const useHoldAndSelect = ({ 
  onShapeSelect, 
  holdDelay = 500 
}: UseHoldAndSelectParams) => {
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isHoldingRef = useRef(false);
  const holdStartPositionRef = useRef<{ x: number; y: number } | null>(null);

  const startHold = useCallback((e: React.MouseEvent, onHoldComplete: () => void) => {
    isHoldingRef.current = true;
    holdStartPositionRef.current = { x: e.clientX, y: e.clientY };
    
    holdTimeoutRef.current = setTimeout(() => {
      if (isHoldingRef.current) {
        onHoldComplete();
      }
    }, holdDelay);
  }, [holdDelay]);

  const endHold = useCallback(() => {
    isHoldingRef.current = false;
    holdStartPositionRef.current = null;
    
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
  }, []);

  const checkMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isHoldingRef.current || !holdStartPositionRef.current) return;

    const moveThreshold = 10; // pixels
    const deltaX = Math.abs(e.clientX - holdStartPositionRef.current.x);
    const deltaY = Math.abs(e.clientY - holdStartPositionRef.current.y);

    // Se o mouse se moveu muito, cancelar o hold
    if (deltaX > moveThreshold || deltaY > moveThreshold) {
      endHold();
    }
  }, [endHold]);

  const handleShapeHover = useCallback((shapeId: string) => {
    if (isHoldingRef.current) {
      onShapeSelect(shapeId);
      endHold();
    }
  }, [onShapeSelect, endHold]);

  return {
    startHold,
    endHold,
    checkMouseMove,
    handleShapeHover,
    isHolding: () => isHoldingRef.current
  };
};
