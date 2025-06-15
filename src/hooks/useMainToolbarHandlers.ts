
import React, { useCallback } from 'react';
import { ToolType, MainTool } from '../types/tools';
import { debug } from '../utils/debug';

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
    debug.log('Tool clicked', { toolId }, 'toolbar');
    
    const tool = mainTools.find(t => t.id === toolId);
    if (!tool) {
      debug.warn('Tool not found', { toolId }, 'toolbar');
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
    debug.log('Tool right clicked', { toolId }, 'toolbar');
    
    const tool = mainTools.find(t => t.id === toolId);
    if (!tool?.hasSubmenu) {
      debug.log('Tool has no submenu', { toolId }, 'toolbar');
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
        debug.log('Opening shapes menu', { position }, 'toolbar');
        setShapesMenuPosition(position);
        setShowShapesMenu(true);
      } else {
        debug.log('Opening submenu', { toolId, position }, 'toolbar');
        toggleSubmenu(toolId, position);
      }
    }
  }, [mainTools, toggleSubmenu, buttonRefs, setShapesMenuPosition, setShowShapesMenu]);

  const handleToolDoubleClick = useCallback((toolId: MainTool) => {
    debug.log('Tool double clicked', { toolId }, 'toolbar');
    
    const activeSub = activeSubTools[toolId];
    if (activeSub) {
      debug.log('Returning to main tool', { toolId, activeSub }, 'toolbar');
      returnToMainTool(toolId);
    }
    
    if (toolId === 'shapes') {
      debug.log('Clearing shape selection', undefined, 'toolbar');
      onShapeSelect(null);
    }
  }, [activeSubTools, returnToMainTool, onShapeSelect]);

  const handleSubToolSelect = useCallback((subToolId: string) => {
    debug.log('Sub-tool selected', { subToolId }, 'toolbar');
    
    // Se for o ícone de texto, abrir o painel de configuração
    if (subToolId === 'fontConfig') {
      debug.log('Opening font config panel', undefined, 'toolbar');
      
      // Calcular posição centralizada na tela
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      const position = { x: centerX, y: centerY };
      debug.log('Font panel position', { position }, 'toolbar');
      
      setFontPanelPosition(position);
      setShowFontPanel(true);
      
      // Fechar submenu
      toggleSubmenu(null);
      
      // Selecionar ferramenta de texto
      onToolSelect('text');
    } else {
      selectSubTool(subToolId as any);
    }
  }, [selectSubTool, toggleSubmenu, onToolSelect, setFontPanelPosition, setShowFontPanel]);

  const handleSubmenuClose = useCallback(() => {
    debug.log('Closing submenu', undefined, 'toolbar');
    toggleSubmenu(null);
  }, [toggleSubmenu]);

  const handleShapeSelect = useCallback((shapeId: string) => {
    debug.log('Shape selected', { shapeId }, 'toolbar');
    onShapeSelect(shapeId);
    setShowShapesMenu(false);
  }, [onShapeSelect, setShowShapesMenu]);

  const handleShapesMenuClose = useCallback(() => {
    debug.log('Closing shapes menu', undefined, 'toolbar');
    setShowShapesMenu(false);
    onShapeSelect(null);
  }, [onShapeSelect, setShowShapesMenu]);

  const handleFontPanelClose = useCallback(() => {
    debug.log('Closing font panel', undefined, 'toolbar');
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
