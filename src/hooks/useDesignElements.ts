
import { useState, useCallback } from 'react';
import { DesignElement } from '../types/design';
import { isValidDesignElement, isValidPosition, logger } from '../utils/validation';

export const useDesignElements = () => {
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const addElement = useCallback((element: Omit<DesignElement, 'id' | 'selected'>) => {
    try {
      if (!isValidPosition({ x: element.x, y: element.y })) {
        logger.error('Invalid position for new element', element);
        return;
      }

      const newElement: DesignElement = {
        ...element,
        id: Date.now().toString(),
        selected: false,
      };

      if (!isValidDesignElement(newElement)) {
        logger.error('Invalid design element created', newElement);
        return;
      }

      setElements(prev => [...prev, newElement]);
      logger.debug('Element added successfully', newElement);
    } catch (error) {
      logger.error('Error adding element', error);
    }
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<DesignElement>) => {
    try {
      setElements(prev => 
        prev.map(el => {
          if (el.id === id) {
            const updated = { ...el, ...updates };
            if (!isValidDesignElement(updated)) {
              logger.error('Invalid element update', { id, updates });
              return el;
            }
            return updated;
          }
          return el;
        })
      );
      logger.debug('Element updated successfully', { id, updates });
    } catch (error) {
      logger.error('Error updating element', error);
    }
  }, []);

  const selectElement = useCallback((id: string | null) => {
    try {
      setElements(prev => 
        prev.map(el => ({ ...el, selected: el.id === id }))
      );
      setSelectedElement(id);
      logger.debug('Element selected', id);
    } catch (error) {
      logger.error('Error selecting element', error);
    }
  }, []);

  const deleteElement = useCallback((id: string) => {
    try {
      setElements(prev => prev.filter(el => el.id !== id));
      if (selectedElement === id) {
        setSelectedElement(null);
      }
      logger.debug('Element deleted', id);
    } catch (error) {
      logger.error('Error deleting element', error);
    }
  }, [selectedElement]);

  return {
    elements,
    selectedElement,
    addElement,
    updateElement,
    selectElement,
    deleteElement,
    setSelectedElement
  };
};
