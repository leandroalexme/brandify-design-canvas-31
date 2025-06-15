
import { useCallback, useEffect } from 'react';
import { DesignElement } from '../types/design';
import { useDragAndDrop } from './useDragAndDrop';
import { useMultiSelection } from './useMultiSelection';
import { useUndoRedo } from './useUndoRedo';
import { logger } from '../utils/validation';

export const useAdvancedInteractions = (
  elements: DesignElement[],
  setElements: (elements: DesignElement[]) => void,
  onUpdateElement: (id: string, updates: Partial<DesignElement>) => void,
  selectedElement: string | null
) => {
  // Hooks individuais
  const dragAndDrop = useDragAndDrop(elements, onUpdateElement, selectedElement);
  const multiSelection = useMultiSelection(elements, onUpdateElement);
  const undoRedo = useUndoRedo(elements, setElements);

  // Handlers de teclado para undo/redo e seleção
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const isCtrlOrCmd = event.ctrlKey || event.metaKey;
    
    if (isCtrlOrCmd) {
      switch (event.key.toLowerCase()) {
        case 'z':
          event.preventDefault();
          if (event.shiftKey) {
            undoRedo.redo();
          } else {
            undoRedo.undo();
          }
          break;
        
        case 'y':
          event.preventDefault();
          undoRedo.redo();
          break;
        
        case 'a':
          event.preventDefault();
          multiSelection.selectAll();
          break;
        
        case 'd':
          event.preventDefault();
          multiSelection.clearSelection();
          break;
      }
    }

    // Teclas especiais
    switch (event.key) {
      case 'Escape':
        if (dragAndDrop.isDragging) {
          dragAndDrop.cancelDrag();
        } else {
          multiSelection.clearSelection();
        }
        break;
      
      case 'Delete':
      case 'Backspace':
        if (multiSelection.selectedCount > 0) {
          event.preventDefault();
          // TODO: Implementar delete de elementos selecionados
          undoRedo.saveState('Delete elements');
        }
        break;
    }
  }, [dragAndDrop, multiSelection, undoRedo]);

  // Auto-salvar estado para undo/redo
  const autoSaveState = useCallback((action: string) => {
    // Debounce para evitar muitos saves
    const timeoutId = setTimeout(() => {
      undoRedo.saveState(action);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [undoRedo]);

  // Event listeners para teclado
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Handlers unificados para o Canvas
  const handleElementMouseDown = useCallback((
    elementId: string, 
    event: React.MouseEvent
  ) => {
    const isCtrlOrCmd = event.ctrlKey || event.metaKey;
    
    if (isCtrlOrCmd) {
      // Multi-seleção
      multiSelection.selectElement(elementId, true);
    } else if (multiSelection.selectedIds.has(elementId)) {
      // Início de drag de elementos selecionados
      dragAndDrop.startDrag(elementId, event.clientX, event.clientY);
    } else {
      // Seleção simples e início de drag
      multiSelection.clearSelection();
      multiSelection.selectElement(elementId);
      dragAndDrop.startDrag(elementId, event.clientX, event.clientY);
    }

    logger.debug('Element mouse down handled', { elementId, multiSelect: isCtrlOrCmd });
  }, [dragAndDrop, multiSelection]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (dragAndDrop.isDragging) {
      dragAndDrop.updateDrag(event.clientX, event.clientY);
    }
  }, [dragAndDrop]);

  const handleMouseUp = useCallback(() => {
    if (dragAndDrop.isDragging) {
      dragAndDrop.endDrag();
      autoSaveState('Move element');
    }
  }, [dragAndDrop, autoSaveState]);

  return {
    // Drag & Drop
    ...dragAndDrop,
    
    // Multi-seleção
    ...multiSelection,
    
    // Undo/Redo
    ...undoRedo,
    
    // Handlers unificados
    handleElementMouseDown,
    handleMouseMove,
    handleMouseUp,
    autoSaveState,
    
    // Estado combinado
    hasActiveInteractions: dragAndDrop.isDragging || multiSelection.selectedCount > 0,
    interactionMode: dragAndDrop.isDragging ? 'dragging' : 
                     multiSelection.selectedCount > 1 ? 'multi-select' : 
                     multiSelection.selectedCount === 1 ? 'single-select' : 'none'
  };
};
