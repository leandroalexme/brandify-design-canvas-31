
import React from 'react';
import { MainToolbarButtons } from './toolbar/MainToolbarButtons';
import { TextPanelsManager } from './toolbar/TextPanelsManager';
import { ShapesMenu } from './ShapesMenu';
import { ToolSubmenu } from './ToolSubmenu';
import { useEditor } from '../contexts/EditorContext';
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
  const { toggleTextPanel } = useEditor();
  
  // Use the main toolbar hook to get all submenu functionality
  const {
    mainTools,
    buttonRefs,
    showShapesMenu,
    shapesMenuPosition,
    showSubmenu,
    submenuPosition,
    showFontPanel,
    fontPanelPosition,
    activeSubTools,
    getCurrentMainTool,
    handleToolClick,
    handleToolRightClick,
    handleToolDoubleClick,
    handleSubToolSelect,
    handleSubmenuClose,
    handleShapeSelect,
    handleShapesMenuClose,
    handleFontPanelClose
  } = useMainToolbar(selectedTool, onToolSelect, selectedShape, onShapeSelect);

  // Estados para painéis de texto
  const [showAlignmentPanel, setShowAlignmentPanel] = React.useState(false);
  const [showColorPanel, setShowColorPanel] = React.useState(false);
  const [showGlyphPanel, setShowGlyphPanel] = React.useState(false);

  // Handler for text submenu tools
  const handleTextSubmenuToolSelect = React.useCallback((toolId: string) => {
    setShowAlignmentPanel(false);
    setShowColorPanel(false);
    setShowGlyphPanel(false);
    
    setTimeout(() => {
      if (toolId === 'alignment') {
        setShowAlignmentPanel(true);
      } else if (toolId === 'color') {
        setShowColorPanel(true);
      } else if (toolId === 'glyph') {
        setShowGlyphPanel(true);
      }
    }, 100);
  }, []);

  // Get current submenu tools
  const currentMainTool = getCurrentMainTool();
  const submenuTools = SUB_TOOL_OPTIONS[currentMainTool] || [];

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[400]" data-toolbar>
        <MainToolbarButtons
          selectedTool={selectedTool}
          showTextPanel={showTextPanel}
          selectedShape={selectedShape}
          mainTools={mainTools}
          buttonRefs={buttonRefs}
          activeSubTools={activeSubTools}
          onToolClick={handleToolClick}
          onToolRightClick={handleToolRightClick}
          onToolDoubleClick={handleToolDoubleClick}
        />
      </div>

      {/* Shapes Menu */}
      <ShapesMenu
        isOpen={showShapesMenu}
        onClose={handleShapesMenuClose}
        onShapeSelect={handleShapeSelect}
        position={shapesMenuPosition}
        selectedShape={selectedShape}
      />

      {/* Tool Submenu */}
      <ToolSubmenu
        isOpen={showSubmenu !== null}
        onClose={handleSubmenuClose}
        onToolSelect={handleSubToolSelect}
        position={submenuPosition}
        selectedTool={activeSubTools[currentMainTool]}
        tools={submenuTools}
        title={currentMainTool}
      />

      {/* Text Panels Manager */}
      <TextPanelsManager
        showTextPanel={showTextPanel}
        showAlignmentPanel={showAlignmentPanel}
        showColorPanel={showColorPanel}
        showGlyphPanel={showGlyphPanel}
        showFontPanel={showFontPanel}
        position={{ x: window.innerWidth / 2, y: window.innerHeight - 120 }}
        onTextPanelClose={toggleTextPanel}
        onAlignmentPanelClose={() => setShowAlignmentPanel(false)}
        onColorPanelClose={() => setShowColorPanel(false)}
        onGlyphPanelClose={() => setShowGlyphPanel(false)}
        onFontPanelClose={handleFontPanelClose}
        onTextSubmenuToolSelect={handleTextSubmenuToolSelect}
      />
    </>
  );
};
