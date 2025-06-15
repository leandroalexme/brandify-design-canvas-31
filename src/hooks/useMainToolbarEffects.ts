
import React from 'react';
import { ToolType } from '../types/tools';
import { debug } from '../utils/debug';

export const useMainToolbarEffects = (
  currentTool: ToolType,
  selectedTool: ToolType,
  onToolSelect: (tool: ToolType) => void,
  showShapesMenu: boolean,
  showFontPanel: boolean,
  onShapeSelect: (shape: string | null) => void
) => {
  // Auto-retorno para shapes quando clica fora
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const isToolbarClick = target.closest('[data-toolbar]');
      const isSubmenuClick = target.closest('[data-submenu]');
      const isFontPanelClick = target.closest('[data-font-panel]');
      
      if (!isToolbarClick && !isSubmenuClick && !isFontPanelClick) {
        if (showShapesMenu) {
          debug.log('Clicking outside shapes menu, closing', undefined, 'toolbar');
          onShapeSelect(null);
        }
      }
    };

    if (showShapesMenu || showFontPanel) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShapesMenu, showFontPanel, onShapeSelect]);

  // Sincronizar com estado externo - otimizado para evitar loops
  React.useEffect(() => {
    if (currentTool !== selectedTool) {
      debug.log('Syncing tool state', { currentTool, selectedTool }, 'toolbar');
      onToolSelect(currentTool);
    }
  }, [currentTool, selectedTool, onToolSelect]);
};
