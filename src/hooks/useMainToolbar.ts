
import React from 'react';
import { useToolState } from './useToolState';
import { ToolType, MainTool } from '../types/tools';
import { useMainToolbarState } from './useMainToolbarState';
import { useMainToolbarHandlers } from './useMainToolbarHandlers';
import { useMainToolbarEffects } from './useMainToolbarEffects';

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

  const {
    buttonRefs,
    showShapesMenu,
    setShowShapesMenu,
    shapesMenuPosition,
    setShapesMenuPosition,
    showFontPanel,
    setShowFontPanel,
    fontPanelPosition,
    setFontPanelPosition,
    mainTools
  } = useMainToolbarState(selectedShape, activeSubTools);

  const {
    handleToolClick,
    handleToolRightClick,
    handleToolDoubleClick,
    handleSubToolSelect,
    handleSubmenuClose,
    handleShapeSelect,
    handleShapesMenuClose,
    handleFontPanelClose
  } = useMainToolbarHandlers(
    mainTools,
    buttonRefs,
    activeSubTools,
    selectMainTool,
    selectSubTool,
    returnToMainTool,
    toggleSubmenu,
    onToolSelect,
    onShapeSelect,
    setShapesMenuPosition,
    setShowShapesMenu,
    setFontPanelPosition,
    setShowFontPanel
  );

  useMainToolbarEffects(
    currentTool,
    selectedTool,
    onToolSelect,
    showShapesMenu,
    showFontPanel,
    onShapeSelect
  );

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
