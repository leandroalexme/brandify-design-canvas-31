
import { useCallback, useMemo } from 'react';
import { useDesignElements } from './useDesignElements';
import { useOptimizedAppState } from './useOptimizedAppState';
import { useAdvancedInteractions } from './useAdvancedInteractions';
import { useNotifications } from './useNotifications';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import { ToolType } from '../types/tools';
import { DesignElement } from '../types/design';

export const useIntegratedStudio = () => {
  const designElements = useDesignElements();
  const appState = useOptimizedAppState();
  const notifications = useNotifications();

  // Advanced interactions com notificações integradas
  const interactions = useAdvancedInteractions(
    designElements.elements,
    (elements: DesignElement[]) => {
      // Implementar setElements quando necessário
      console.log('🔄 [INTEGRATED] Setting elements:', elements.length);
    },
    designElements.updateElement,
    designElements.selectedElement
  );

  // Handlers integrados com feedback
  const handleToolSelect = useCallback((tool: ToolType) => {
    appState.updateToolState({ selectedTool: tool });
    
    // Feedback visual para mudança de ferramenta
    const toolNames: Record<ToolType, string> = {
      select: 'Seleção',
      pen: 'Caneta',
      shapes: 'Formas',
      text: 'Texto',
      node: 'Nó',
      move: 'Mover',
      comment: 'Comentário',
      brush: 'Pincel',
      pencil: 'Lápis'
    };

    notifications.info(`Ferramenta alterada para: ${toolNames[tool]}`);
  }, [appState, notifications]);

  const handleDeleteElements = useCallback(() => {
    const selectedCount = interactions.selectedCount;
    if (selectedCount === 0) {
      notifications.warning('Nenhum elemento selecionado para deletar');
      return;
    }

    // Salvar estado para undo
    interactions.saveState('Delete elements');

    // Deletar elementos selecionados
    interactions.selectedElements.forEach(element => {
      designElements.deleteElement(element.id);
    });

    interactions.clearSelection();
    
    notifications.showUndoNotification(
      `${selectedCount} elemento(s) deletado(s)`,
      () => interactions.undo()
    );
  }, [interactions, designElements, notifications]);

  const handleDuplicateElements = useCallback(() => {
    const selectedCount = interactions.selectedCount;
    if (selectedCount === 0) {
      notifications.warning('Nenhum elemento selecionado para duplicar');
      return;
    }

    interactions.saveState('Duplicate elements');

    interactions.selectedElements.forEach(element => {
      const duplicated = {
        ...element,
        x: element.x + 20,
        y: element.y + 20,
        content: element.content ? `${element.content} (cópia)` : undefined
      };
      delete (duplicated as any).id;
      delete (duplicated as any).selected;
      
      designElements.addElement(duplicated);
    });

    notifications.success(`${selectedCount} elemento(s) duplicado(s)`);
  }, [interactions, designElements, notifications]);

  // Atalhos de teclado integrados
  const shortcuts = useMemo(() => [
    {
      key: 'z',
      ctrlKey: true,
      handler: () => {
        if (interactions.canUndo) {
          interactions.undo();
          notifications.info('Desfazer aplicado');
        }
      },
      description: 'Desfazer'
    },
    {
      key: 'y',
      ctrlKey: true,
      handler: () => {
        if (interactions.canRedo) {
          interactions.redo();
          notifications.info('Refazer aplicado');
        }
      },
      description: 'Refazer'
    },
    {
      key: 'z',
      ctrlKey: true,
      shiftKey: true,
      handler: () => {
        if (interactions.canRedo) {
          interactions.redo();
          notifications.info('Refazer aplicado');
        }
      },
      description: 'Refazer (alternativo)'
    },
    {
      key: 'a',
      ctrlKey: true,
      handler: () => {
        interactions.selectAll();
        notifications.info(`${designElements.elementsCount} elementos selecionados`);
      },
      description: 'Selecionar tudo'
    },
    {
      key: 'd',
      ctrlKey: true,
      handler: () => {
        handleDuplicateElements();
      },
      description: 'Duplicar selecionados'
    },
    {
      key: 'Delete',
      handler: handleDeleteElements,
      description: 'Deletar selecionados'
    },
    {
      key: 'Backspace',
      handler: handleDeleteElements,
      description: 'Deletar selecionados'
    },
    {
      key: 'Escape',
      handler: () => {
        if (interactions.isDragging) {
          interactions.cancelDrag();
          notifications.info('Arrastar cancelado');
        } else if (interactions.selectedCount > 0) {
          interactions.clearSelection();
          notifications.info('Seleção limpa');
        }
      },
      description: 'Cancelar/Limpar seleção'
    }
  ], [interactions, designElements.elementsCount, handleDeleteElements, handleDuplicateElements, notifications]);

  const { getShortcutsList } = useKeyboardShortcuts(shortcuts);

  // Estado consolidado
  const studioState = useMemo(() => ({
    // Design elements
    elements: designElements.elements,
    selectedElement: designElements.selectedElement,
    selectedElementData: designElements.selectedElementData,
    elementsCount: designElements.elementsCount,

    // App state
    toolState: appState.toolState,
    uiState: appState.uiState,
    hasAnyPanelOpen: appState.hasAnyPanelOpen,
    currentToolInfo: appState.currentToolInfo,

    // Interactions
    canUndo: interactions.canUndo,
    canRedo: interactions.canRedo,
    isDragging: interactions.isDragging,
    selectedCount: interactions.selectedCount,
    isMultiSelectMode: interactions.isMultiSelectMode,
    interactionMode: interactions.interactionMode,

    // Computed
    hasActiveInteractions: interactions.hasActiveInteractions,
    shortcuts: getShortcutsList()
  }), [
    designElements,
    appState,
    interactions,
    getShortcutsList
  ]);

  return {
    // Estado consolidado
    ...studioState,

    // Handlers principais
    handleToolSelect,
    handleDeleteElements,
    handleDuplicateElements,

    // Design elements
    addElement: designElements.addElement,
    updateElement: designElements.updateElement,
    selectElement: designElements.selectElement,
    deleteElement: designElements.deleteElement,
    setSelectedElement: designElements.setSelectedElement,

    // App state
    updateToolState: appState.updateToolState,
    updateUIState: appState.updateUIState,
    closeAllPanels: appState.closeAllPanels,
    togglePanel: appState.togglePanel,

    // Interactions
    ...interactions,

    // Notifications
    notifications
  };
};
