
import { useState, useCallback, useMemo } from 'react';
import { DesignElement, LayerGroup } from '../types/design';
import { logger } from '../utils/validation';

export const useLayerManagement = (
  elements: DesignElement[],
  updateElement: (id: string, updates: Partial<DesignElement>) => void,
  addElement: (element: Omit<DesignElement, 'id' | 'selected'>) => void,
  deleteElement: (id: string) => void
) => {
  const [groups, setGroups] = useState<LayerGroup[]>([]);

  // Sort elements by zIndex for proper layer order
  const sortedElements = useMemo(() => {
    return [...elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
  }, [elements]);

  const toggleVisibility = useCallback((elementId: string) => {
    const element = elements.find(el => el.id === elementId);
    if (element) {
      updateElement(elementId, { visible: !element.visible });
      logger.debug('Toggled visibility', { elementId, newVisible: !element.visible });
    }
  }, [elements, updateElement]);

  const toggleLock = useCallback((elementId: string) => {
    const element = elements.find(el => el.id === elementId);
    if (element) {
      updateElement(elementId, { locked: !element.locked });
      logger.debug('Toggled lock', { elementId, newLocked: !element.locked });
    }
  }, [elements, updateElement]);

  const reorderLayers = useCallback((dragIndex: number, hoverIndex: number) => {
    const sortedIds = sortedElements.map(el => el.id);
    const dragId = sortedIds[dragIndex];
    const hoverId = sortedIds[hoverIndex];
    
    // Update zIndex values
    updateElement(dragId, { zIndex: hoverIndex });
    updateElement(hoverId, { zIndex: dragIndex });
    
    logger.debug('Reordered layers', { dragIndex, hoverIndex });
  }, [sortedElements, updateElement]);

  const createGroup = useCallback((elementIds: string[], groupName: string = 'New Group') => {
    const groupId = `group-${Date.now()}`;
    const newGroup: LayerGroup = {
      id: groupId,
      name: groupName,
      visible: true,
      locked: false,
      children: elementIds,
      expanded: true
    };

    // Update elements to belong to the group
    elementIds.forEach(id => {
      updateElement(id, { groupId });
    });

    setGroups(prev => [...prev, newGroup]);
    logger.debug('Created group', { groupId, elementIds });
    
    return groupId;
  }, [updateElement]);

  const ungroupElements = useCallback((groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      // Remove group reference from elements
      group.children.forEach(id => {
        updateElement(id, { groupId: undefined });
      });

      setGroups(prev => prev.filter(g => g.id !== groupId));
      logger.debug('Ungrouped elements', { groupId });
    }
  }, [groups, updateElement]);

  const moveToFront = useCallback((elementId: string) => {
    const maxZ = Math.max(...elements.map(el => el.zIndex || 0));
    updateElement(elementId, { zIndex: maxZ + 1 });
    logger.debug('Moved to front', { elementId, newZIndex: maxZ + 1 });
  }, [elements, updateElement]);

  const moveToBack = useCallback((elementId: string) => {
    const minZ = Math.min(...elements.map(el => el.zIndex || 0));
    updateElement(elementId, { zIndex: minZ - 1 });
    logger.debug('Moved to back', { elementId, newZIndex: minZ - 1 });
  }, [elements, updateElement]);

  const duplicateElement = useCallback((elementId: string) => {
    const element = elements.find(el => el.id === elementId);
    if (element) {
      const duplicated = {
        ...element,
        x: element.x + 20,
        y: element.y + 20,
        zIndex: (element.zIndex || 0) + 1
      };
      delete (duplicated as any).id;
      delete (duplicated as any).selected;
      
      addElement(duplicated);
      logger.debug('Duplicated element', { elementId });
    }
  }, [elements, addElement]);

  return {
    sortedElements,
    groups,
    toggleVisibility,
    toggleLock,
    reorderLayers,
    createGroup,
    ungroupElements,
    moveToFront,
    moveToBack,
    duplicateElement,
    setGroups
  };
};
