import React from 'react';
import { SimpleSubmenu } from './SimpleSubmenu';
import { ShapesMenu } from './ShapesMenu';
import { FontConfigPanel } from './FontConfigPanel';
import { TextPropertiesSubmenu } from './TextPropertiesSubmenu';
import { AlignmentConfigPanel } from './AlignmentConfigPanel';
import { ColorConfigPanel } from './ColorConfigPanel';
import { GlyphPanel } from './GlyphPanel';
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
  // Estados para painéis melhorados com posicionamento otimizado
  const [showAlignmentPanel, setShowAlignmentPanel] = React.useState(false);
  const [showColorPanel, setShowColorPanel] = React.useState(false);
  const [showGlyphPanel, setShowGlyphPanel] = React.useState(false);

  // Calculate base position from toolbar center
  const getToolbarCenter = React.useCallback(() => {
    return {
      x: window.innerWidth / 2,
      y: window.innerHeight - 120 // Toolbar is at bottom-6 (24px) + toolbar height
    };
  }, []);

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

  const handleTextToolClick = React.useCallback(() => {
    console.log('📝 [MAIN TOOLBAR] Text tool clicked - Opening text properties submenu');
    onOpenTextPanel();
  }, [onOpenTextPanel]);

  const handleCustomToolClick = React.useCallback((toolId: string) => {
    console.log('🔧 [MAIN TOOLBAR] Custom tool click:', toolId);
    
    if (toolId === 'text') {
      handleTextToolClick();
    } else {
      handleToolClick(toolId as any);
    }
  }, [handleTextToolClick, handleToolClick]);

  // Enhanced handler for text submenu tools with intelligent positioning
  const handleTextSubmenuToolSelect = React.useCallback((toolId: string) => {
    console.log('📝 [MAIN TOOLBAR] Text submenu tool selected:', toolId);
    
    const toolbarCenter = getToolbarCenter();
    
    // Close all panels first to avoid conflicts
    setShowAlignmentPanel(false);
    setShowColorPanel(false);
    setShowGlyphPanel(false);
    
    // Small delay to ensure clean transitions
    setTimeout(() => {
      if (toolId === 'typography') {
        console.log('📝 [MAIN TOOLBAR] Opening font config panel');
        const fontPanelButton = buttonRefs.current['text'];
        if (fontPanelButton) {
          const rect = fontPanelButton.getBoundingClientRect();
          const buttonPosition = {
            x: rect.left + rect.width / 2,
            y: rect.top
          };
          
          handleSubToolSelect('fontConfig');
        }
      } else if (toolId === 'alignment') {
        console.log('📐 [MAIN TOOLBAR] Opening alignment config panel');
        setShowAlignmentPanel(true);
      } else if (toolId === 'color') {
        console.log('🎨 [MAIN TOOLBAR] Opening color config panel');  
        setShowColorPanel(true);
      } else if (toolId === 'glyph') {
        console.log('🔤 [MAIN TOOLBAR] Opening glyph panel');
        setShowGlyphPanel(true);
      }
    }, 100);
  }, [handleSubToolSelect, buttonRefs, getToolbarCenter]);

  // Handlers para fechar painéis
  const handleAlignmentPanelClose = React.useCallback(() => {
    setShowAlignmentPanel(false);
  }, []);

  const handleColorPanelClose = React.useCallback(() => {
    setShowColorPanel(false);
  }, []);

  const handleGlyphPanelClose = React.useCallback(() => {
    setShowGlyphPanel(false);
  }, []);

  const handleTextPanelClose = React.useCallback(() => {
    console.log('📝 [MAIN TOOLBAR] Closing text panel and all subpanels');
    onOpenTextPanel();
    
    // Fechar todos os subpainéis
    setShowAlignmentPanel(false);
    setShowColorPanel(false);
    setShowGlyphPanel(false);
  }, [onOpenTextPanel]);

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[400]" data-toolbar>
        <div className="floating-module rounded-2xl p-3 flex items-center space-x-2">
          {mainTools.map((tool) => {
            const isActive = tool.id === 'text' ? 
              showTextPanel : 
              (!showTextPanel && getCurrentMainTool() === tool.id);
            
            const hasActiveSub = !showTextPanel && activeSubTools[tool.id] ? activeSubTools[tool.id] : null;
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

      {/* Submenu para select e pen - otimizado */}
      {!showTextPanel && showSubmenu && showSubmenu !== 'text' && SUB_TOOL_OPTIONS[showSubmenu as keyof typeof SUB_TOOL_OPTIONS] && (
        <SimpleSubmenu
          isOpen={!!showSubmenu}
          onClose={handleSubmenuClose}
          onSelect={handleSubToolSelect}
          position={submenuPosition}
          options={SUB_TOOL_OPTIONS[showSubmenu as keyof typeof SUB_TOOL_OPTIONS]}
        />
      )}

      {/* Text Properties Submenu - with improved positioning */}
      <TextPropertiesSubmenu
        isOpen={showTextPanel}
        onClose={handleTextPanelClose}
        onToolSelect={handleTextSubmenuToolSelect}
        position={getToolbarCenter()}
      />

      {/* Menu de formas */}
      {!showTextPanel && (
        <ShapesMenu
          isOpen={showShapesMenu}
          onClose={handleShapesMenuClose}
          onShapeSelect={handleShapeSelect}
          position={shapesMenuPosition}
          selectedShape={selectedShape}
        />
      )}

      {/* Painéis melhorados - só aparecem quando texto está ativo */}
      {showTextPanel && (
        <>
          <FontConfigPanel
            isOpen={showFontPanel}
            onClose={handleFontPanelClose}
            position={getToolbarCenter()}
          />

          <AlignmentConfigPanel
            isOpen={showAlignmentPanel}
            onClose={handleAlignmentPanelClose}
            position={getToolbarCenter()}
          />

          <ColorConfigPanel
            isOpen={showColorPanel}
            onClose={handleColorPanelClose}
            position={getToolbarCenter()}
          />

          <GlyphPanel
            isOpen={showGlyphPanel}
            onClose={handleGlyphPanelClose}
            position={getToolbarCenter()}
          />
        </>
      )}
    </>
  );
};
