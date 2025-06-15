
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
  console.log('🔧 [MAIN TOOLBAR] Rendering with props:', {
    selectedTool,
    selectedShape,
    showTextPanel
  });

  const { 
    toggleTextPanel,
    updateUIState,
    uiState 
  } = useEditor();
  
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
    console.log('🔧 [MAIN TOOLBAR] Text submenu tool selected:', toolId);
    
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
      } else if (toolId === 'typography') {
        // Open font panel when typography is selected
        handleFontPanelClose(); // Close first if open
        setTimeout(() => {
          // This will be handled by the existing font panel logic
        }, 100);
      }
    }, 100);
  }, [handleFontPanelClose]);

  // Enhanced tool click handler that manages all UI states
  const enhancedToolClick = React.useCallback((toolId: string) => {
    console.log('🔧 [MAIN TOOLBAR] Enhanced tool click:', toolId);
    
    if (toolId === 'text') {
      // Toggle text panel through context
      console.log('🔧 [MAIN TOOLBAR] Toggling text panel via context');
      toggleTextPanel();
    } else {
      // Handle other tools normally
      console.log('🔧 [MAIN TOOLBAR] Handling tool click via useMainToolbar:', toolId);
      handleToolClick(toolId as any);
      
      // Call the parent handler to update the state
      onToolSelect(toolId as ToolType);
    }
  }, [handleToolClick, toggleTextPanel, onToolSelect]);

  // Enhanced right click handler
  const enhancedRightClick = React.useCallback((e: React.MouseEvent, toolId: any) => {
    console.log('🔧 [MAIN TOOLBAR] Enhanced right click:', toolId);
    handleToolRightClick(e, toolId);
  }, [handleToolRightClick]);

  // Enhanced double click handler
  const enhancedDoubleClick = React.useCallback((toolId: any) => {
    console.log('🔧 [MAIN TOOLBAR] Enhanced double click:', toolId);
    handleToolDoubleClick(toolId);
  }, [handleToolDoubleClick]);

  // Get current submenu tools
  const currentMainTool = getCurrentMainTool();
  const submenuTools = SUB_TOOL_OPTIONS[currentMainTool] || [];

  console.log('🔧 [MAIN TOOLBAR] Current state:', {
    currentMainTool,
    showSubmenu,
    showShapesMenu,
    showTextPanel: uiState.showTextPropertiesPanel,
    mainToolsCount: mainTools.length
  });

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[400]" data-toolbar>
        <MainToolbarButtons
          selectedTool={selectedTool}
          showTextPanel={uiState.showTextPropertiesPanel}
          selectedShape={selectedShape}
          mainTools={mainTools}
          buttonRefs={buttonRefs}
          activeSubTools={activeSubTools}
          onToolClick={enhancedToolClick}
          onToolRightClick={enhancedRightClick}
          onToolDoubleClick={enhancedDoubleClick}
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
        showTextPanel={uiState.showTextPropertiesPanel}
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
