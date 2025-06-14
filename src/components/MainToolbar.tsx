
import React from 'react';
import { SimpleSubmenu } from './SimpleSubmenu';
import { ShapesMenu } from './ShapesMenu';
import { MainToolbarButton } from './MainToolbarButton';
import { useMainToolbar } from '../hooks/useMainToolbar';
import { ToolType } from '../types/tools';
import { SUB_TOOL_OPTIONS } from '../utils/toolConfig';

interface MainToolbarProps {
  selectedTool: ToolType;
  onToolSelect: (tool: ToolType) => void;
  selectedColor: string;
  onColorSelect: (color: string) => void;
  selectedShape: string | null;
  onShapeSelect: (shape: string | null) => void;
}

export const MainToolbar = ({ 
  selectedTool, 
  onToolSelect, 
  selectedShape, 
  onShapeSelect 
}: MainToolbarProps) => {
  const {
    mainTools,
    buttonRefs,
    showShapesMenu,
    shapesMenuPosition,
    showSubmenu,
    submenuPosition,
    activeSubTools,
    getCurrentMainTool,
    handleToolClick,
    handleToolRightClick,
    handleToolDoubleClick,
    handleSubToolSelect,
    handleSubmenuClose,
    handleShapeSelect,
    handleShapesMenuClose
  } = useMainToolbar(selectedTool, onToolSelect, selectedShape, onShapeSelect);

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[400]" data-toolbar>
        <div className="floating-module rounded-2xl p-3 flex items-center space-x-2">
          {mainTools.map((tool) => {
            const isActive = getCurrentMainTool() === tool.id;
            const hasActiveSub = activeSubTools[tool.id];
            const hasSelectedShape = tool.id === 'shapes' && !!selectedShape;
            
            return (
              <MainToolbarButton
                key={tool.id}
                tool={tool}
                isActive={isActive}
                hasActiveSub={hasActiveSub}
                hasSelectedShape={hasSelectedShape}
                buttonRef={el => buttonRefs.current[tool.id] = el}
                onClick={() => handleToolClick(tool.id)}
                onRightClick={(e) => handleToolRightClick(e, tool.id)}
                onDoubleClick={() => handleToolDoubleClick(tool.id)}
              />
            );
          })}
        </div>
      </div>

      {/* Submenu para select e pen */}
      {showSubmenu && SUB_TOOL_OPTIONS[showSubmenu as keyof typeof SUB_TOOL_OPTIONS] && (
        <SimpleSubmenu
          isOpen={!!showSubmenu}
          onClose={handleSubmenuClose}
          onSelect={handleSubToolSelect}
          position={submenuPosition}
          options={SUB_TOOL_OPTIONS[showSubmenu as keyof typeof SUB_TOOL_OPTIONS]}
        />
      )}

      {/* Menu específico para shapes */}
      <ShapesMenu
        isOpen={showShapesMenu}
        onClose={handleShapesMenuClose}
        onShapeSelect={handleShapeSelect}
        position={shapesMenuPosition}
        selectedShape={selectedShape}
      />
    </>
  );
};
