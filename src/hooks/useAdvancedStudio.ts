import React from 'react';
import { useCallback, useMemo } from 'react';
import { useDesignElements } from './useDesignElements';
import { useOptimizedAppState } from './useOptimizedAppState';
import { useAdvancedInteractions } from './useAdvancedInteractions';
import { useNotifications } from './useNotifications';
import { useVisualHistory } from './useVisualHistory';
import { useCustomShortcuts } from './useCustomShortcuts';
import { useIntelligentZoom } from './useIntelligentZoom';
import { ToolType } from '../types/tools';
import { DesignElement } from '../types/design';

export const useAdvancedStudio = () => {
  const designElements = useDesignElements();
  const appState = useOptimizedAppState();
  const notifications = useNotifications();

  // Histórico visual avançado
  const visualHistory = useVisualHistory(
    designElements.elements,
    (elements: DesignElement[]) => {
      // Implementar setElements quando necessário
      console.log('🔄 [ADVANCED STUDIO] Setting elements from history:', elements.length);
    }
  );

  // Sistema de atalhos customizáveis
  const shortcuts = useCustomShortcuts();

  // Zoom inteligente
  const intelligentZoom = useIntelligentZoom(designElements.elements);

  // Advanced interactions com histórico integrado
  const interactions = useAdvancedInteractions(
    designElements.elements,
    (elements: DesignElement[]) => {
      // Aqui implementaria a integração real
      console.log('🔄 [ADVANCED STUDIO] Setting elements:', elements.length);
    },
    designElements.updateElement,
    designElements.selectedElement
  );

  // Handlers integrados com histórico e feedback
  const handleToolSelect = useCallback((tool: ToolType) => {
    appState.updateToolState({ selectedTool: tool });
    
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

    // Salvar estado no histórico visual
    visualHistory.saveSnapshot('Delete elements');

    interactions.selectedElements.forEach(element => {
      designElements.deleteElement(element.id);
    });

    interactions.clearSelection();
    
    notifications.showUndoNotification(
      `${selectedCount} elemento(s) deletado(s)`,
      () => visualHistory.undo()
    );
  }, [interactions, designElements, notifications, visualHistory]);

  const handleDuplicateElements = useCallback(() => {
    const selectedCount = interactions.selectedCount;
    if (selectedCount === 0) {
      notifications.warning('Nenhum elemento selecionado para duplicar');
      return;
    }

    visualHistory.saveSnapshot('Duplicate elements');

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
  }, [interactions, designElements, notifications, visualHistory]);

  // Ação de salvar checkpoint
  const saveCheckpoint = useCallback((action: string) => {
    visualHistory.saveSnapshot(action);
    notifications.info(`Checkpoint salvo: ${action}`);
  }, [visualHistory, notifications]);

  // Handlers de zoom integrados
  const handleZoomToSelection = useCallback(() => {
    const selectedElements = interactions.selectedElements;
    if (selectedElements.length === 0) {
      notifications.info('Nenhum elemento selecionado para zoom');
      return;
    }

    intelligentZoom.zoomToSelection(selectedElements);
    notifications.info(`Zoom aplicado a ${selectedElements.length} elemento(s)`);
  }, [interactions.selectedElements, intelligentZoom, notifications]);

  // Atalhos de teclado integrados com novas funcionalidades
  const shortcutHandlers = useMemo(() => ({
    // Histórico
    undo: () => {
      if (visualHistory.canUndo) {
        visualHistory.undo();
        notifications.info('Desfazer aplicado');
      }
    },
    redo: () => {
      if (visualHistory.canRedo) {
        visualHistory.redo();
        notifications.info('Refazer aplicado');
      }
    },
    
    // Seleção
    selectAll: () => {
      interactions.selectAll();
      notifications.info(`${designElements.elementsCount} elementos selecionados`);
    },
    
    // Edição
    duplicate: handleDuplicateElements,
    delete: handleDeleteElements,
    
    // Zoom
    zoomIn: intelligentZoom.zoomIn,
    zoomOut: intelligentZoom.zoomOut,
    zoomToFit: intelligentZoom.zoomToFit,
    zoomToSelection: handleZoomToSelection,
    resetZoom: intelligentZoom.resetZoom,
    
    // Checkpoint
    saveCheckpoint: () => saveCheckpoint('Manual checkpoint'),
    
    // Navegação
    escape: () => {
      if (interactions.isDragging) {
        interactions.cancelDrag();
        notifications.info('Arrastar cancelado');
      } else if (interactions.selectedCount > 0) {
        interactions.clearSelection();
        notifications.info('Seleção limpa');
      }
    }
  }), [
    visualHistory, 
    interactions, 
    designElements.elementsCount, 
    handleDeleteElements, 
    handleDuplicateElements,
    handleZoomToSelection,
    intelligentZoom,
    notifications,
    saveCheckpoint
  ]);

  // Registrar atalhos
  const registerShortcuts = useCallback(() => {
    shortcuts.registerShortcut({
      name: 'Salvar Checkpoint',
      description: 'Salvar ponto de checkpoint manual',
      keys: ['ctrl', 's'],
      category: 'edit',
      enabled: true,
      action: shortcutHandlers.saveCheckpoint
    });

    shortcuts.registerShortcut({
      name: 'Zoom na Seleção',
      description: 'Fazer zoom nos elementos selecionados',
      keys: ['ctrl', 'shift', 'f'],
      category: 'view',
      enabled: true,
      action: shortcutHandlers.zoomToSelection
    });
  }, [shortcuts, shortcutHandlers]);

  // Estado consolidado com novas funcionalidades
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
    canUndo: visualHistory.canUndo,
    canRedo: visualHistory.canRedo,
    isDragging: interactions.isDragging,
    selectedCount: interactions.selectedCount,
    isMultiSelectMode: interactions.isMultiSelectMode,
    interactionMode: interactions.interactionMode,

    // Histórico visual
    historySnapshots: visualHistory.snapshots,
    historyBranches: visualHistory.branches,
    currentSnapshotId: visualHistory.currentSnapshotId,
    currentBranchId: visualHistory.currentBranchId,
    historyInfo: visualHistory.historyInfo,

    // Atalhos
    customShortcuts: shortcuts.customShortcuts,
    currentShortcutMode: shortcuts.currentMode,
    shortcutModes: shortcuts.modes,
    activeShortcuts: shortcuts.getActiveShortcuts,

    // Zoom inteligente
    zoomLevel: intelligentZoom.zoomInfo.level,
    zoomPercentage: intelligentZoom.zoomInfo.percentage,
    canZoomIn: intelligentZoom.zoomInfo.canZoomIn,
    canZoomOut: intelligentZoom.zoomInfo.canZoomOut,
    viewport: intelligentZoom.viewport,
    visibleElements: intelligentZoom.visibleElements,

    // Computed
    hasActiveInteractions: interactions.hasActiveInteractions,
    isAdvancedMode: true
  }), [
    designElements,
    appState,
    interactions,
    visualHistory,
    shortcuts,
    intelligentZoom
  ]);

  // Inicializar atalhos
  React.useEffect(() => {
    registerShortcuts();
  }, [registerShortcuts]);

  return {
    // Estado consolidado
    ...studioState,

    // Handlers principais
    handleToolSelect,
    handleDeleteElements,
    handleDuplicateElements,
    handleZoomToSelection,
    saveCheckpoint,

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

    // Histórico visual
    ...visualHistory,

    // Atalhos
    ...shortcuts,

    // Zoom inteligente
    ...intelligentZoom,

    // Notifications
    notifications
  };
};
