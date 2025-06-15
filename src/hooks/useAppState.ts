
import { useState, useCallback } from 'react';
import { ToolType, UIState, ToolState } from '../types/tools';
import { isValidTool, logger } from '../utils/validation';

export const useAppState = () => {
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

  const updateToolState = useCallback((updates: Partial<ToolState>) => {
    try {
      if (updates.selectedTool && !isValidTool(updates.selectedTool)) {
        logger.error('Invalid tool selected', updates.selectedTool);
        return;
      }
      
      setToolState(prev => ({ ...prev, ...updates }));
      logger.debug('Tool state updated', updates);
    } catch (error) {
      logger.error('Error updating tool state', error);
    }
  }, []);

  const updateUIState = useCallback((updates: Partial<UIState>) => {
    try {
      setUIState(prev => ({ ...prev, ...updates }));
      logger.debug('UI state updated', updates);
    } catch (error) {
      logger.error('Error updating UI state', error);
    }
  }, []);

  return {
    toolState,
    uiState,
    updateToolState,
    updateUIState
  };
};
