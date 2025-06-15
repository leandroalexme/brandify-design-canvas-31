import React, { useRef, useMemo, useCallback } from 'react';
import { useToolState } from './useToolState';
import { ToolType, MainTool } from '../types/tools';
import { TOOL_ICONS, TOOL_LABELS, SUB_TOOL_OPTIONS } from '../utils/toolConfig';
import { SHAPE_ICONS } from '../utils/shapeIcons';
import { logger } from '../utils/validation';

interface ToolDefinition {
  id: MainTool;
  icon: any;
  label: string;
  hasSubmenu: boolean;
}

export const useMainToolbar = (
  selectedTool: ToolType,
  onToolSelect: (tool: ToolType) => void,
  selectedShape: string | null,
  onShapeSelect: (shape: string | null) => void
) => {
  const {
    currentTool,
    activeSubTools,
    showSubmenu,
    submenuPosition,
    selectMainTool,
    selectSubTool,
    returnToMainTool,
    toggleSubmenu,
    getCurrentMainTool
  } = useToolState(selectedTool);

  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Estados locais para shapes menu
  const [showShapesMenu, setShowShapesMenu] = React.useState(false);
  const [shapesMenuPosition, setShapesMenuPosition] = React.useState({ x: 0, y: 0 });

  // Estados para o painel de configuração de fonte
  const [showFontPanel, setShowFontPanel] = React.useState(false);
  const [fontPanelPosition, setFontPanelPosition] = React.useState({ x: 0, y: 0 });

  // Auto-retorno para shapes quando clica fora
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const isToolbarClick = target.closest('[data-toolbar]');
      const isSubmenuClick = target.closest('[data-submenu]');
      const isFontPanelClick = target.closest('[data-font-panel]');
      
      if (!isToolbarClick && !isSubmenuClick && !isFontPanelClick) {
        if (showShapesMenu) {
          logger.debug('Clicking outside shapes menu, closing');
          setShowShapesMenu(false);
          onShapeSelect(null);
        }
        if (showFontPanel) {
          logger.debug('Clicking outside font panel, closing');
          setShowFontPanel(false);
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
      logger.debug('Syncing tool state', { currentTool, selectedTool });
      onToolSelect(currentTool);
    }
  }, [currentTool, selectedTool, onToolSelect]);

  // Definição das ferramentas principais - memoizado para performance
  const mainTools: ToolDefinition[] = useMemo(() => {
    logger.debug('Recalculating main tools', { activeSubTools, selectedShape });
    
    return [
      {
        id: 'select',
        icon: activeSubTools.select ? TOOL_ICONS[activeSubTools.select] : TOOL_ICONS.select,
        label: activeSubTools.select ? TOOL_LABELS[activeSubTools.select] : TOOL_LABELS.select,
        hasSubmenu: true
      },
      {
        id: 'pen',
        icon: activeSubTools.pen ? TOOL_ICONS[activeSubTools.pen] : TOOL_ICONS.pen,
        label: activeSubTools.pen ? TOOL_LABELS[activeSubTools.pen] : TOOL_LABELS.pen,
        hasSubmenu: true
      },
      {
        id: 'shapes',
        icon: selectedShape ? SHAPE_ICONS[selectedShape as keyof typeof SHAPE_ICONS] : TOOL_ICONS.shapes,
        label: selectedShape ? `Forma: ${selectedShape}` : TOOL_LABELS.shapes,
        hasSubmenu: true
      },
      {
        id: 'text',
        icon: TOOL_ICONS.text,
        label: TOOL_LABELS.text,
        hasSubmenu: false
      }
    ];
  }, [activeSubTools.select, activeSubTools.pen, selectedShape]);

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
  }, [mainTools, toggleSubmenu]);

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
      const button = buttonRefs.current['text'];
      if (button) {
        const rect = button.getBoundingClientRect();
        const position = {
          x: rect.left + rect.width / 2,
          y: rect.top
        };
        setFontPanelPosition(position);
        setShowFontPanel(true);
        toggleSubmenu(null); // Fechar submenu
      }
    } else {
      selectSubTool(subToolId as any);
    }
  }, [selectSubTool, toggleSubmenu]);

  const handleSubmenuClose = useCallback(() => {
    logger.debug('Closing submenu');
    toggleSubmenu(null);
  }, [toggleSubmenu]);

  const handleShapeSelect = useCallback((shapeId: string) => {
    logger.debug('Shape selected', { shapeId });
    onShapeSelect(shapeId);
    setShowShapesMenu(false);
  }, [onShapeSelect]);

  const handleShapesMenuClose = useCallback(() => {
    logger.debug('Closing shapes menu');
    setShowShapesMenu(false);
    onShapeSelect(null);
  }, [onShapeSelect]);

  const handleFontPanelClose = useCallback(() => {
    logger.debug('Closing font panel');
    setShowFontPanel(false);
  }, []);

  return {
    mainTools,
    buttonRefs,
    showShapesMenu,
    shapesMenuPosition,
    showSubmenu,
    submenuPosition,
    showFontPanel,
    fontPanelPosition,
    activeSubTools,
    selectedShape,
    getCurrentMainTool,
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
