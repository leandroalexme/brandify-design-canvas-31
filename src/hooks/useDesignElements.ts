
import { useState, useCallback } from 'react';
import { DesignElement } from '../types/design';
import { isValidDesignElement, isValidPosition } from '../utils/validation';
import { debug } from '../utils/debug';

export const useDesignElements = () => {
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const addElement = useCallback((element: Omit<DesignElement, 'id' | 'selected'>) => {
    try {
      if (!isValidPosition({ x: element.x, y: element.y })) {
        debug.error('Invalid position for new element', element);
        return;
      }

      const newElement: DesignElement = {
        ...element,
        id: Date.now().toString(),
        selected: false,
      };

      if (!isValidDesignElement(newElement)) {
        debug.error('Invalid design element created', newElement);
        return;
      }

      setElements(prev => [...prev, newElement]);
      debug.log('Element added successfully', newElement);
    } catch (error) {
      debug.error('Error adding element', error);
    }
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<DesignElement>) => {
    try {
      setElements(prev => 
        prev.map(el => {
          if (el.id === id) {
            const updated = { ...el, ...updates };
            if (!isValidDesignElement(updated)) {
              debug.error('Invalid element update', { id, updates });
              return el;
            }
            return updated;
          }
          return el;
        })
      );
      debug.log('Element updated successfully', { id, updates });
    } catch (error) {
      debug.error('Error updating element', error);
    }
  }, []);

  const selectElement = useCallback((id: string | null) => {
    try {
      setElements(prev => 
        prev.map(el => ({ ...el, selected: el.id === id }))
      );
      setSelectedElement(id);
      debug.log('Element selected', id);
    } catch (error) {
      debug.error('Error selecting element', error);
    }
  }, []);

  const deleteElement = useCallback((id: string) => {
    try {
      setElements(prev => prev.filter(el => el.id !== id));
      if (selectedElement === id) {
        setSelectedElement(null);
      }
      debug.log('Element deleted', id);
    } catch (error) {
      debug.error('Error deleting element', error);
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
