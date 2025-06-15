
import React, { useCallback } from 'react';
import { ToolType, MainTool } from '../types/tools';
import { logger } from '../utils/validation';

interface ToolDefinition {
  id: MainTool;
  icon: any;
  label: string;
  hasSubmenu: boolean;
}

export const useMainToolbarHandlers = (
  mainTools: ToolDefinition[],
  buttonRefs: React.MutableRefObject<Record<string, HTMLButtonElement | null>>,
  activeSubTools: Record<MainTool, any>,
  selectMainTool: (tool: MainTool) => void,
  selectSubTool: (tool: any) => void,
  returnToMainTool: (tool: MainTool) => void,
  toggleSubmenu: (tool: MainTool | null, position?: { x: number; y: number }) => void,
  onToolSelect: (tool: ToolType) => void,
  onShapeSelect: (shape: string | null) => void,
  setShapesMenuPosition: (pos: { x: number; y: number }) => void,
  setShowShapesMenu: (show: boolean) => void,
  setFontPanelPosition: (pos: { x: number; y: number }) => void,
  setShowFontPanel: (show: boolean) => void
) => {
  // Handlers otimizados com melhor logging
  const handleToolClick = useCallback((toolId: MainTool) => {
    logger.debug('Tool clicked', { toolId });
    
    const tool = mainTools.find(t => t.id === toolId);
    if (!tool) {
      logger.warn('Tool not found', { toolId });
      return;
    }

    if (toolId === 'shapes') {
      selectMainTool(toolId);
    } else if (tool.hasSubmenu) {
      selectMainTool(toolId);
    } else {
      onToolSelect(toolId);
    }
  }, [mainTools, selectMainTool, onToolSelect]);

  const handleToolRightClick = useCallback((e: React.MouseEvent, toolId: MainTool) => {
    e.preventDefault();
    logger.debug('Tool right clicked', { toolId });
    
    const tool = mainTools.find(t => t.id === toolId);
    if (!tool?.hasSubmenu) {
      logger.debug('Tool has no submenu', { toolId });
      return;
    }

    const button = buttonRefs.current[toolId];
    if (button) {
      const rect = button.getBoundingClientRect();
      const position = {
        x: rect.left + rect.width / 2,
        y: rect.top
      };

      if (toolId === 'shapes') {
        logger.debug('Opening shapes menu', { position });
        setShapesMenuPosition(position);
        setShowShapesMenu(true);
      } else {
        logger.debug('Opening submenu', { toolId, position });
        toggleSubmenu(toolId, position);
      }
    }
  }, [mainTools, toggleSubmenu, buttonRefs, setShapesMenuPosition, setShowShapesMenu]);

  const handleToolDoubleClick = useCallback((toolId: MainTool) => {
    logger.debug('Tool double clicked', { toolId });
    
    const activeSub = activeSubTools[toolId];
    if (activeSub) {
      logger.debug('Returning to main tool', { toolId, activeSub });
      returnToMainTool(toolId);
    }
    
    if (toolId === 'shapes') {
      logger.debug('Clearing shape selection');
      onShapeSelect(null);
    }
  }, [activeSubTools, returnToMainTool, onShapeSelect]);

  const handleSubToolSelect = useCallback((subToolId: string) => {
    logger.debug('Sub-tool selected', { subToolId });
    
    // Se for o ícone de texto, abrir o painel de configuração
    if (subToolId === 'text') {
      console.log('📝 [MAIN TOOLBAR] Opening font panel for text tool');
      
      // Usar a posição do botão de texto da toolbar principal
      const textButton = buttonRefs.current['text'];
      if (textButton) {
        const rect = textButton.getBoundingClientRect();
        const position = {
          x: rect.left + rect.width / 2,
          y: rect.top
        };
        console.log('📝 [MAIN TOOLBAR] Font panel position:', position);
        setFontPanelPosition(position);
        setShowFontPanel(true);
      }
      
      // Fechar submenu
      toggleSubmenu(null);
      
      // Selecionar ferramenta de texto
      onToolSelect('text');
    } else {
      selectSubTool(subToolId as any);
    }
  }, [selectSubTool, toggleSubmenu, onToolSelect, buttonRefs, setFontPanelPosition, setShowFontPanel]);

  const handleSubmenuClose = useCallback(() => {
    logger.debug('Closing submenu');
    toggleSubmenu(null);
  }, [toggleSubmenu]);

  const handleShapeSelect = useCallback((shapeId: string) => {
    logger.debug('Shape selected', { shapeId });
    onShapeSelect(shapeId);
    setShowShapesMenu(false);
  }, [onShapeSelect, setShowShapesMenu]);

  const handleShapesMenuClose = useCallback(() => {
    logger.debug('Closing shapes menu');
    setShowShapesMenu(false);
    onShapeSelect(null);
  }, [onShapeSelect, setShowShapesMenu]);

  const handleFontPanelClose = useCallback(() => {
    console.log('📝 [MAIN TOOLBAR] Closing font panel');
    setShowFontPanel(false);
  }, [setShowFontPanel]);

  return {
    handleToolClick,
    handleToolRightClick,
    handleToolDoubleClick,
    handleSubToolSelect,
    handleSubmenuClose,
    handleShapeSelect,
    handleShapesMenuClose,
    handleFontPanelClose
  };
};
