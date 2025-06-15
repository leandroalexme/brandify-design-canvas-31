
import { useState, useCallback, useMemo, useRef } from 'react';
import { ToolType, UIState, ToolState } from '../types/tools';
import { isValidTool, logger } from '../utils/validation';

interface StateChangeMetrics {
  toolChanges: number;
  uiChanges: number;
  lastChange: number;
}

export const useOptimizedAppState = () => {
  const [toolState, setToolState] = useState<ToolState>({
    selectedTool: 'select',
    selectedColor: '#4285F4',
    zoom: 100
  });
  
  const [uiState, setUIState] = useState<UIState>({
    showLayersPanel: false,
    showAlignmentPanel: false,
    showArtboardsPanel: false,
    showTextPropertiesPanel: false,
    selectedShape: null,
    textCreated: false
  });

  // Métricas de performance para debugging
  const metricsRef = useRef<StateChangeMetrics>({
    toolChanges: 0,
    uiChanges: 0,
    lastChange: 0
  });

  // Memoizar estados computados
  const hasAnyPanelOpen = useMemo(() => {
    return uiState.showLayersPanel || 
           uiState.showAlignmentPanel || 
           uiState.showArtboardsPanel || 
           uiState.showTextPropertiesPanel;
  }, [uiState.showLayersPanel, uiState.showAlignmentPanel, uiState.showArtboardsPanel, uiState.showTextPropertiesPanel]);

  const currentToolInfo = useMemo(() => {
    return {
      tool: toolState.selectedTool,
      isDrawingTool: ['pen', 'brush', 'pencil', 'draw'].includes(toolState.selectedTool),
      isSelectTool: ['select', 'node', 'move'].includes(toolState.selectedTool),
      isTextTool: toolState.selectedTool === 'text',
      isShapeTool: toolState.selectedTool === 'shapes'
    };
  }, [toolState.selectedTool]);

  const updateToolState = useCallback((updates: Partial<ToolState>) => {
    try {
      if (updates.selectedTool && !isValidTool(updates.selectedTool)) {
        logger.error('Invalid tool selected', updates.selectedTool);
        return;
      }
      
      setToolState(prev => {
        // Verificar se há mudanças reais
        const hasRealChanges = Object.keys(updates).some(key => {
          const updateKey = key as keyof ToolState;
          return prev[updateKey] !== updates[updateKey];
        });

        if (!hasRealChanges) {
          logger.debug('No real tool state changes, skipping update');
          return prev;
        }

        // Atualizar métricas
        metricsRef.current.toolChanges++;
        metricsRef.current.lastChange = Date.now();

        const newState = { ...prev, ...updates };
        logger.debug('Tool state updated', { updates, metrics: metricsRef.current });
        return newState;
      });
    } catch (error) {
      logger.error('Error updating tool state', error);
    }
  }, []);

  const updateUIState = useCallback((updates: Partial<UIState>) => {
    try {
      setUIState(prev => {
        // Verificar se há mudanças reais
        const hasRealChanges = Object.keys(updates).some(key => {
          const updateKey = key as keyof UIState;
          return prev[updateKey] !== updates[updateKey];
        });

        if (!hasRealChanges) {
          logger.debug('No real UI state changes, skipping update');
          return prev;
        }

        // Atualizar métricas
        metricsRef.current.uiChanges++;
        metricsRef.current.lastChange = Date.now();

        const newState = { ...prev, ...updates };
        logger.debug('UI state updated', { updates, metrics: metricsRef.current });
        return newState;
      });
    } catch (error) {
      logger.error('Error updating UI state', error);
    }
  }, []);

  // Função para fechar todos os painéis
  const closeAllPanels = useCallback(() => {
    updateUIState({
      showLayersPanel: false,
      showAlignmentPanel: false,
      showArtboardsPanel: false,
      showTextPropertiesPanel: false
    });
  }, [updateUIState]);

  // Função para alternar painel específico
  const togglePanel = useCallback((panelName: keyof Pick<UIState, 'showLayersPanel' | 'showAlignmentPanel' | 'showArtboardsPanel' | 'showTextPropertiesPanel'>) => {
    setUIState(prev => ({
      ...prev,
      [panelName]: !prev[panelName]
    }));
  }, []);

  // Reset de métricas (útil para debugging)
  const resetMetrics = useCallback(() => {
    metricsRef.current = {
      toolChanges: 0,
      uiChanges: 0,
      lastChange: 0
    };
  }, []);

  return {
    toolState,
    uiState,
    hasAnyPanelOpen,
    currentToolInfo,
    updateToolState,
    updateUIState,
    closeAllPanels,
    togglePanel,
    resetMetrics,
    metrics: metricsRef.current
  };
};
