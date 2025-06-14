
import React, { useEffect, useMemo } from 'react';
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
  canvasRef: React.RefObject<HTMLDivElement>;
}

export const MainToolbar = ({ selectedTool, onToolSelect, canvasRef }: MainToolbarProps) => {
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

  // Usar o hook de auto-retorno com referência correta do canvas
  useToolAutoReturn(selectedTool, onToolSelect, canvasRef);

  // Forçar re-renderização dos ícones quando selectedTool muda
  const tools = useMemo(() => {
    console.log('Regenerating tool definitions for selectedTool:', selectedTool);
    return getToolDefinitions(selectedTool);
  }, [selectedTool]);

  // Sincronizar estado local com estado global
  useEffect(() => {
    console.log('MainToolbar: selectedTool changed to:', selectedTool);
    
    // Sincronizar estado local dos submenus com o selectedTool global
    if (selectedTool === 'node' || selectedTool === 'move' || selectedTool === 'comment') {
      setSelectedSelectTool(selectedTool);
    } else if (selectedTool === 'vector-brush' || selectedTool === 'pencil') {
      setSelectedPenTool(selectedTool);
    }
    
    // Fechar menus quando uma sub-ferramenta for selecionada
    if (['node', 'move', 'comment', 'vector-brush', 'pencil'].includes(selectedTool)) {
      closeAllMenus();
    }
  }, [selectedTool, setSelectedSelectTool, setSelectedPenTool, closeAllMenus]);

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

  // Handlers para seleções de submenu
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
                key={`${tool.id}-${selectedTool}`} // Força re-render quando selectedTool muda
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
