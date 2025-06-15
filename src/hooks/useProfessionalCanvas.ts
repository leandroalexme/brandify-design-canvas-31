
import { useCallback, useMemo, useState } from 'react';
import { DesignElement } from '../types/design';
import { logger } from '../utils/validation';

export const useProfessionalCanvas = () => {
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [showGuides, setShowGuides] = useState(true);
  const [gridSize, setGridSize] = useState(20);

  // Professional canvas features
  const snapToGridValue = useCallback((value: number): number => {
    if (!snapToGrid) return value;
    return Math.round(value / gridSize) * gridSize;
  }, [snapToGrid, gridSize]);

  const snapPosition = useCallback((x: number, y: number): { x: number; y: number } => {
    return {
      x: snapToGridValue(x),
      y: snapToGridValue(y)
    };
  }, [snapToGridValue]);

  // Advanced selection features
  const selectInArea = useCallback((
    elements: DesignElement[],
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ): string[] => {
    const minX = Math.min(startX, endX);
    const maxX = Math.max(startX, endX);
    const minY = Math.min(startY, endY);
    const maxY = Math.max(startY, endY);

    return elements
      .filter(element => {
        const elementRight = element.x + (element.width || 0);
        const elementBottom = element.y + (element.height || 0);
        
        return element.x >= minX && 
               elementRight <= maxX && 
               element.y >= minY && 
               elementBottom <= maxY;
      })
      .map(element => element.id);
  }, []);

  // Professional layer management
  const bringToFront = useCallback((elementId: string, elements: DesignElement[]): DesignElement[] => {
    const elementIndex = elements.findIndex(el => el.id === elementId);
    if (elementIndex === -1) return elements;

    const element = elements[elementIndex];
    const newElements = [...elements];
    newElements.splice(elementIndex, 1);
    newElements.push(element);

    logger.debug('Element brought to front', elementId);
    return newElements;
  }, []);

  const sendToBack = useCallback((elementId: string, elements: DesignElement[]): DesignElement[] => {
    const elementIndex = elements.findIndex(el => el.id === elementId);
    if (elementIndex === -1) return elements;

    const element = elements[elementIndex];
    const newElements = [...elements];
    newElements.splice(elementIndex, 1);
    newElements.unshift(element);

    logger.debug('Element sent to back', elementId);
    return newElements;
  }, []);

  // Professional alignment features
  const alignElements = useCallback((
    elementIds: string[],
    elements: DesignElement[],
    alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom'
  ): Partial<DesignElement>[] => {
    const selectedElements = elements.filter(el => elementIds.includes(el.id));
    if (selectedElements.length < 2) return [];

    let referenceValue: number;
    
    switch (alignment) {
      case 'left':
        referenceValue = Math.min(...selectedElements.map(el => el.x));
        return selectedElements.map(el => ({ id: el.id, x: referenceValue }));
        
      case 'right':
        referenceValue = Math.max(...selectedElements.map(el => el.x + (el.width || 0)));
        return selectedElements.map(el => ({ id: el.id, x: referenceValue - (el.width || 0) }));
        
      case 'center':
        const minX = Math.min(...selectedElements.map(el => el.x));
        const maxX = Math.max(...selectedElements.map(el => el.x + (el.width || 0)));
        referenceValue = (minX + maxX) / 2;
        return selectedElements.map(el => ({ id: el.id, x: referenceValue - (el.width || 0) / 2 }));
        
      case 'top':
        referenceValue = Math.min(...selectedElements.map(el => el.y));
        return selectedElements.map(el => ({ id: el.id, y: referenceValue }));
        
      case 'bottom':
        referenceValue = Math.max(...selectedElements.map(el => el.y + (el.height || 0)));
        return selectedElements.map(el => ({ id: el.id, y: referenceValue - (el.height || 0) }));
        
      case 'middle':
        const minY = Math.min(...selectedElements.map(el => el.y));
        const maxY = Math.max(...selectedElements.map(el => el.y + (el.height || 0)));
        referenceValue = (minY + maxY) / 2;
        return selectedElements.map(el => ({ id: el.id, y: referenceValue - (el.height || 0) / 2 }));
        
      default:
        return [];
    }
  }, []);

  // Professional distribution
  const distributeElements = useCallback((
    elementIds: string[],
    elements: DesignElement[],
    direction: 'horizontal' | 'vertical'
  ): Partial<DesignElement>[] => {
    const selectedElements = elements.filter(el => elementIds.includes(el.id));
    if (selectedElements.length < 3) return [];

    selectedElements.sort((a, b) => {
      return direction === 'horizontal' ? a.x - b.x : a.y - b.y;
    });

    const first = selectedElements[0];
    const last = selectedElements[selectedElements.length - 1];
    const totalSpace = direction === 'horizontal' 
      ? (last.x + (last.width || 0)) - first.x
      : (last.y + (last.height || 0)) - first.y;
    
    const elementSpace = selectedElements.reduce((acc, el) => {
      return acc + (direction === 'horizontal' ? (el.width || 0) : (el.height || 0));
    }, 0);

    const availableSpace = totalSpace - elementSpace;
    const spacing = availableSpace / (selectedElements.length - 1);

    let currentPosition = direction === 'horizontal' ? first.x : first.y;

    return selectedElements.map((el, index) => {
      if (index === 0) return { id: el.id };
      
      currentPosition += (direction === 'horizontal' ? (selectedElements[index - 1].width || 0) : (selectedElements[index - 1].height || 0)) + spacing;
      
      return {
        id: el.id,
        ...(direction === 'horizontal' ? { x: currentPosition } : { y: currentPosition })
      };
    });
  }, []);

  const professionalFeatures = useMemo(() => ({
    snapToGrid,
    showGuides,
    gridSize,
    snapPosition,
    selectInArea,
    bringToFront,
    sendToBack,
    alignElements,
    distributeElements
  }), [
    snapToGrid,
    showGuides,
    gridSize,
    snapPosition,
    selectInArea,
    bringToFront,
    sendToBack,
    alignElements,
    distributeElements
  ]);

  return {
    ...professionalFeatures,
    setSnapToGrid,
    setShowGuides,
    setGridSize
  };
};
