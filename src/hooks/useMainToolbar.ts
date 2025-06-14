
import React, { useRef, useMemo, useCallback } from 'react';
import { useToolState } from './useToolState';
import { ToolType, MainTool } from '../types/tools';
import { TOOL_ICONS, TOOL_LABELS, SUB_TOOL_OPTIONS } from '../utils/toolConfig';
import { SHAPE_ICONS } from '../utils/shapeIcons';

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

  // Auto-retorno para shapes quando clica fora
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const isToolbarClick = target.closest('[data-toolbar]');
      const isSubmenuClick = target.closest('[data-submenu]');
      
      if (!isToolbarClick && !isSubmenuClick && showShapesMenu) {
        setShowShapesMenu(false);
        onShapeSelect(null);
      }
    };

    if (showShapesMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShapesMenu, onShapeSelect]);

  // Sincronizar com estado externo
  React.useEffect(() => {
    if (currentTool !== selectedTool) {
      onToolSelect(currentTool);
    }
  }, [currentTool, selectedTool, onToolSelect]);

  // Definição das ferramentas principais
  const mainTools: ToolDefinition[] = useMemo(() => [
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
  ], [activeSubTools, selectedShape]);

  // Handlers otimizados
  const handleToolClick = useCallback((toolId: MainTool) => {
    const tool = mainTools.find(t => t.id === toolId);
    if (!tool) return;

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
    const tool = mainTools.find(t => t.id === toolId);
    if (!tool?.hasSubmenu) return;

    const button = buttonRefs.current[toolId];
    if (button) {
      const rect = button.getBoundingClientRect();
      const position = {
        x: rect.left + rect.width / 2,
        y: rect.top
      };

      if (toolId === 'shapes') {
        setShapesMenuPosition(position);
        setShowShapesMenu(true);
      } else {
        toggleSubmenu(toolId, position);
      }
    }
  }, [mainTools, toggleSubmenu]);

  const handleToolDoubleClick = useCallback((toolId: MainTool) => {
    const activeSub = activeSubTools[toolId];
    if (activeSub) {
      returnToMainTool(toolId);
    }
    
    if (toolId === 'shapes') {
      onShapeSelect(null);
    }
  }, [activeSubTools, returnToMainTool, onShapeSelect]);

  const handleSubToolSelect = useCallback((subToolId: string) => {
    selectSubTool(subToolId as any);
  }, [selectSubTool]);

  const handleSubmenuClose = useCallback(() => {
    toggleSubmenu(null);
  }, [toggleSubmenu]);

  const handleShapeSelect = useCallback((shapeId: string) => {
    onShapeSelect(shapeId);
    console.log('Shape selected:', shapeId);
    setShowShapesMenu(false);
  }, [onShapeSelect]);

  const handleShapesMenuClose = useCallback(() => {
    setShowShapesMenu(false);
    onShapeSelect(null);
  }, [onShapeSelect]);

  return {
    mainTools,
    buttonRefs,
    showShapesMenu,
    shapesMenuPosition,
    showSubmenu,
    submenuPosition,
    activeSubTools,
    selectedShape,
    getCurrentMainTool,
    handleToolClick,
    handleToolRightClick,
    handleToolDoubleClick,
    handleSubToolSelect,
    handleSubmenuClose,
    handleShapeSelect,
    handleShapesMenuClose
  };
};
