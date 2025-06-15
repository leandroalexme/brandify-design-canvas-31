
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
  onOpenTextPanel: () => void;
  showTextPanel: boolean;
}

export const MainToolbar = ({ 
  selectedTool, 
  onToolSelect, 
  selectedShape, 
  onShapeSelect,
  onOpenTextPanel,
  showTextPanel
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

  // Handler específico para o botão de texto com toggle
  const handleTextToolClick = React.useCallback(() => {
    console.log('📝 [MAIN TOOLBAR] Text tool clicked - Toggle mode');
    console.log('📝 [MAIN TOOLBAR] Current panel state:', showTextPanel);
    onOpenTextPanel();
  }, [onOpenTextPanel, showTextPanel]);

  // Handler personalizado que intercepta cliques no botão de texto
  const handleCustomToolClick = React.useCallback((toolId: string) => {
    console.log('🔧 [MAIN TOOLBAR] Custom tool click:', toolId);
    
    if (toolId === 'text') {
      handleTextToolClick();
    } else {
      handleToolClick(toolId as any);
    }
  }, [handleTextToolClick, handleToolClick]);

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[400]" data-toolbar>
        <div className="floating-module rounded-2xl p-3 flex items-center space-x-2">
          {mainTools.map((tool) => {
            const isActive = tool.id === 'text' ? showTextPanel : getCurrentMainTool() === tool.id;
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
                onClick={() => handleCustomToolClick(tool.id)}
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
