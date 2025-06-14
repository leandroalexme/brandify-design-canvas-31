
import React, { useEffect, useRef } from 'react';
import { ShapesMenu } from './ShapesMenu';
import { SelectSubmenu } from './SelectSubmenu';
import { PenSubmenu } from './PenSubmenu';
import { ToolbarButton } from './ToolbarButton';
import { useSubmenuState } from '../hooks/useSubmenuState';
import { useToolAutoReturn } from '../hooks/useToolAutoReturn';
import { useToolHandlers } from './ToolHandlers';
import { getToolDefinitions } from './ToolDefinitions';
import { getActiveToolGroup } from '../utils/toolIcons';
import { ToolType } from './BrandifyStudio';

interface MainToolbarProps {
  selectedTool: ToolType;
  onToolSelect: (tool: ToolType) => void;
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export const MainToolbar = ({ selectedTool, onToolSelect }: MainToolbarProps) => {
  const canvasRef = useRef<HTMLElement>(null);
  
  const {
    showShapesMenu, setShowShapesMenu,
    showSelectMenu, setShowSelectMenu,
    showPenMenu, setShowPenMenu,
    shapesMenuPosition, setShapesMenuPosition,
    selectMenuPosition, setSelectMenuPosition,
    penMenuPosition, setPenMenuPosition,
    selectedShape, setSelectedShape,
    selectedSelectTool, setSelectedSelectTool,
    selectedPenTool, setSelectedPenTool,
    shapesButtonRef,
    selectButtonRef,
    penButtonRef,
    shapesTimeoutRef,
    selectTimeoutRef,
    penTimeoutRef,
    closeAllMenus,
  } = useSubmenuState();

  // Use the auto-return hook
  useToolAutoReturn(selectedTool, onToolSelect, canvasRef);

  // Get tool definitions
  const tools = getToolDefinitions(selectedTool);

  // Get tool handlers
  const { getToolHandler } = useToolHandlers(
    shapesButtonRef, selectButtonRef, penButtonRef,
    setShowShapesMenu, setShowSelectMenu, setShowPenMenu,
    setShapesMenuPosition, setSelectMenuPosition, setPenMenuPosition,
    shapesTimeoutRef, selectTimeoutRef, penTimeoutRef,
    onToolSelect
  );

  // Handle clicks outside to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isClickInAnyButton = [shapesButtonRef, selectButtonRef, penButtonRef].some(
        ref => ref.current && ref.current.contains(event.target as Node)
      );
      
      if (!isClickInAnyButton) {
        closeAllMenus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeAllMenus]);

  // Handlers for submenu selections
  const handleShapeSelect = (shape: string) => {
    console.log('Shape selected:', shape);
    setSelectedShape(shape);
    onToolSelect('shapes');
    closeAllMenus();
  };

  const handleSelectToolSelect = (tool: string) => {
    console.log('Select tool selected:', tool);
    setSelectedSelectTool(tool);
    onToolSelect(tool as ToolType);
    closeAllMenus();
  };

  const handlePenToolSelect = (tool: string) => {
    console.log('Pen tool selected:', tool);
    setSelectedPenTool(tool);
    onToolSelect(tool as ToolType);
    closeAllMenus();
  };

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[500]" data-toolbar>
        <div className="floating-module p-3 flex items-center space-x-2 animate-slide-up">
          {tools.map((tool) => {
            const handlers = getToolHandler(tool.id);
            const isActive = getActiveToolGroup(tool.id, selectedTool);
            
            return (
              <ToolbarButton
                key={tool.id}
                id={tool.id}
                icon={tool.icon}
                label={tool.label}
                isActive={isActive}
                buttonRef={handlers.ref}
                onClick={handlers.onClick}
                onMouseDown={handlers.onMouseDown}
                onMouseUp={handlers.onMouseUp}
                onContextMenu={handlers.onContextMenu}
              />
            );
          })}
        </div>
      </div>

      {/* Submenus */}
      <ShapesMenu
        isOpen={showShapesMenu}
        onClose={() => setShowShapesMenu(false)}
        onShapeSelect={handleShapeSelect}
        position={shapesMenuPosition}
        selectedShape={selectedShape}
      />

      <SelectSubmenu
        isOpen={showSelectMenu}
        onClose={() => setShowSelectMenu(false)}
        onToolSelect={handleSelectToolSelect}
        position={selectMenuPosition}
        selectedTool={selectedSelectTool}
      />

      <PenSubmenu
        isOpen={showPenMenu}
        onClose={() => setShowPenMenu(false)}
        onToolSelect={handlePenToolSelect}
        position={penMenuPosition}
        selectedTool={selectedPenTool}
      />
    </>
  );
};
