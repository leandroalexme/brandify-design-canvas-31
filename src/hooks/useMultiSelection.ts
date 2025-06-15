
import { useState, useCallback, useMemo } from 'react';
import { DesignElement } from '../types/design';
import { logger } from '../utils/validation';

export const useMultiSelection = (
  elements: DesignElement[],
  onUpdateElement: (id: string, updates: Partial<DesignElement>) => void
) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);

  // Memoizar elementos selecionados
  const selectedElements = useMemo(() => {
    return elements.filter(el => selectedIds.has(el.id));
  }, [elements, selectedIds]);

  const selectedCount = useMemo(() => selectedIds.size, [selectedIds.size]);

  const selectElement = useCallback((elementId: string, addToSelection: boolean = false) => {
    setSelectedIds(prev => {
      const newSelection = new Set(addToSelection ? prev : []);
      
      if (newSelection.has(elementId)) {
        newSelection.delete(elementId);
      } else {
        newSelection.add(elementId);
      }

      logger.debug('Element selection changed', { 
        elementId, 
        addToSelection, 
        selectionSize: newSelection.size 
      });

      return newSelection;
    });

    // Atualizar estado visual dos elementos
    elements.forEach(element => {
      const shouldBeSelected = selectedIds.has(element.id) || 
        (elementId === element.id && !selectedIds.has(elementId));
      
      if (element.selected !== shouldBeSelected) {
        onUpdateElement(element.id, { selected: shouldBeSelected });
      }
    });
  }, [selectedIds, elements, onUpdateElement]);

  const selectMultiple = useCallback((elementIds: string[]) => {
    const newSelection = new Set(elementIds);
    setSelectedIds(newSelection);

    // Atualizar estado visual
    elements.forEach(element => {
      const shouldBeSelected = newSelection.has(element.id);
      if (element.selected !== shouldBeSelected) {
        onUpdateElement(element.id, { selected: shouldBeSelected });
      }
    });

    logger.debug('Multiple elements selected', { count: elementIds.length });
  }, [elements, onUpdateElement]);

  const clearSelection = useCallback(() => {
    // Limpar estado visual
    selectedElements.forEach(element => {
      onUpdateElement(element.id, { selected: false });
    });

    setSelectedIds(new Set());
    logger.debug('Selection cleared');
  }, [selectedElements, onUpdateElement]);

  const selectAll = useCallback(() => {
    const allIds = elements.map(el => el.id);
    selectMultiple(allIds);
    logger.debug('All elements selected', { count: allIds.length });
  }, [elements, selectMultiple]);

  const toggleMultiSelectMode = useCallback((enabled?: boolean) => {
    const newMode = enabled !== undefined ? enabled : !isMultiSelectMode;
    setIsMultiSelectMode(newMode);
    
    if (!newMode) {
      clearSelection();
    }
    
    logger.debug('Multi-select mode toggled', { enabled: newMode });
  }, [isMultiSelectMode, clearSelection]);

  // Seleção por área (bounding box)
  const selectInArea = useCallback((startX: number, startY: number, endX: number, endY: number) => {
    const minX = Math.min(startX, endX);
    const maxX = Math.max(startX, endX);
    const minY = Math.min(startY, endY);
    const maxY = Math.max(startY, endY);

    const elementsInArea = elements.filter(element => {
      const elementCenterX = element.x + (element.width || 0) / 2;
      const elementCenterY = element.y + (element.height || 0) / 2;
      
      return elementCenterX >= minX && elementCenterX <= maxX &&
             elementCenterY >= minY && elementCenterY <= maxY;
    });

    if (elementsInArea.length > 0) {
      selectMultiple(elementsInArea.map(el => el.id));
      logger.debug('Area selection completed', { 
        area: { minX, minY, maxX, maxY }, 
        selected: elementsInArea.length 
      });
    }
  }, [elements, selectMultiple]);

  return {
    selectedIds,
    selectedElements,
    selectedCount,
    isMultiSelectMode,
    selectElement,
    selectMultiple,
    clearSelection,
    selectAll,
    toggleMultiSelectMode,
    selectInArea
  };
};
