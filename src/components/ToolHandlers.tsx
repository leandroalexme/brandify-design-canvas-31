import React from 'react';
import { createSubmenuHandlers } from '../utils/submenuHandlers';
import { ToolType } from '../types/tools';

export const useToolHandlers = (
  shapesButtonRef: React.RefObject<HTMLButtonElement>,
  selectButtonRef: React.RefObject<HTMLButtonElement>,
  penButtonRef: React.RefObject<HTMLButtonElement>,
  setShowShapesMenu: (show: boolean) => void,
  setShowSelectMenu: (show: boolean) => void,
  setShowPenMenu: (show: boolean) => void,
  setShapesMenuPosition: (pos: { x: number; y: number }) => void,
  setSelectMenuPosition: (pos: { x: number; y: number }) => void,
  setPenMenuPosition: (pos: { x: number; y: number }) => void,
  shapesTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>,
  selectTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>,
  penTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>,
  onToolSelect: (tool: ToolType) => void
) => {
  const shapesHandlers = createSubmenuHandlers(
    'shapes', shapesButtonRef, setShowShapesMenu, setShapesMenuPosition, shapesTimeoutRef, 'shapes', onToolSelect
  );
  
  const selectHandlers = createSubmenuHandlers(
    'select', selectButtonRef, setShowSelectMenu, setSelectMenuPosition, selectTimeoutRef, 'select', onToolSelect
  );
  
  const penHandlers = createSubmenuHandlers(
    'pen', penButtonRef, setShowPenMenu, setPenMenuPosition, penTimeoutRef, 'pen', onToolSelect
  );

  const getToolHandler = (toolId: string) => {
    switch (toolId) {
      case 'select':
        return {
          ref: selectButtonRef,
          onClick: selectHandlers.handleClick,
          onMouseDown: selectHandlers.handleMouseDown,
          onMouseUp: selectHandlers.handleMouseUp,
          onContextMenu: selectHandlers.handleContextMenu,
        };
      case 'pen':
        return {
          ref: penButtonRef,
          onClick: penHandlers.handleClick,
          onMouseDown: penHandlers.handleMouseDown,
          onMouseUp: penHandlers.handleMouseUp,
          onContextMenu: penHandlers.handleContextMenu,
        };
      case 'shapes':
        return {
          ref: shapesButtonRef,
          onClick: shapesHandlers.handleClick,
          onMouseDown: shapesHandlers.handleMouseDown,
          onMouseUp: shapesHandlers.handleMouseUp,
          onContextMenu: shapesHandlers.handleContextMenu,
        };
      default:
        return {
          onClick: () => onToolSelect(toolId as ToolType),
        };
    }
  };

  return { getToolHandler };
};
