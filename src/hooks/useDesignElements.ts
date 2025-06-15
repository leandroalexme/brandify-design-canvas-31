
import { useState, useCallback, useMemo } from 'react';
import { DesignElement } from '../types/design';
import { isValidDesignElement, isValidPosition, logger } from '../utils/validation';

export const useDesignElements = () => {
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  // Memoizar elemento selecionado para evitar re-renders
  const selectedElementData = useMemo(() => {
    if (!selectedElement) return null;
    return elements.find(el => el.id === selectedElement) || null;
  }, [elements, selectedElement]);

  // Memoizar contagem de elementos para métricas
  const elementsCount = useMemo(() => elements.length, [elements.length]);

  // Memoizar elementos visíveis (otimização futura para viewport)
  const visibleElements = useMemo(() => {
    // Por enquanto retorna todos, mas pode ser otimizado para viewport
    return elements;
  }, [elements]);

  const addElement = useCallback((element: Omit<DesignElement, 'id' | 'selected'>) => {
    try {
      if (!isValidPosition({ x: element.x, y: element.y })) {
        logger.error('Invalid position for new element', element);
        return;
      }

      const newElement: DesignElement = {
        ...element,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // ID mais único
        selected: false,
      };

      if (!isValidDesignElement(newElement)) {
        logger.error('Invalid design element created', newElement);
        return;
      }

      setElements(prev => [...prev, newElement]);
      logger.debug('Element added successfully', newElement.id);
    } catch (error) {
      logger.error('Error adding element', error);
    }
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<DesignElement>) => {
    try {
      setElements(prev => {
        const elementIndex = prev.findIndex(el => el.id === id);
        if (elementIndex === -1) {
          logger.warn('Element not found for update', id);
          return prev;
        }

        const updatedElement = { ...prev[elementIndex], ...updates };
        if (!isValidDesignElement(updatedElement)) {
          logger.error('Invalid element update', { id, updates });
          return prev;
        }

        // Otimização: criar novo array apenas se necessário
        const newElements = [...prev];
        newElements[elementIndex] = updatedElement;
        return newElements;
      });
      
      logger.debug('Element updated successfully', { id, updates });
    } catch (error) {
      logger.error('Error updating element', error);
    }
  }, []);

  const selectElement = useCallback((id: string | null) => {
    try {
      // Otimização: verificar se já está selecionado
      if (selectedElement === id) {
        return;
      }

      setElements(prev => 
        prev.map(el => ({ ...el, selected: el.id === id }))
      );
      setSelectedElement(id);
      logger.debug('Element selected', id);
    } catch (error) {
      logger.error('Error selecting element', error);
    }
  }, [selectedElement]);

  const deleteElement = useCallback((id: string) => {
    try {
      setElements(prev => {
        const filtered = prev.filter(el => el.id !== id);
        if (filtered.length === prev.length) {
          logger.warn('Element not found for deletion', id);
          return prev;
        }
        return filtered;
      });
      
      if (selectedElement === id) {
        setSelectedElement(null);
      }
      logger.debug('Element deleted', id);
    } catch (error) {
      logger.error('Error deleting element', error);
    }
  }, [selectedElement]);

  // Função otimizada para bulk operations
  const bulkUpdateElements = useCallback((updates: Array<{ id: string; updates: Partial<DesignElement> }>) => {
    try {
      setElements(prev => {
        const newElements = [...prev];
        let hasChanges = false;

        updates.forEach(({ id, updates: elementUpdates }) => {
          const index = newElements.findIndex(el => el.id === id);
          if (index !== -1) {
            const updated = { ...newElements[index], ...elementUpdates };
            if (isValidDesignElement(updated)) {
              newElements[index] = updated;
              hasChanges = true;
            }
          }
        });

        return hasChanges ? newElements : prev;
      });
      
      logger.debug('Bulk update completed', updates.length);
    } catch (error) {
      logger.error('Error in bulk update', error);
    }
  }, []);

  return {
    elements: visibleElements,
    selectedElement,
    selectedElementData,
    elementsCount,
    addElement,
    updateElement,
    selectElement,
    deleteElement,
    setSelectedElement,
    bulkUpdateElements
  };
};
