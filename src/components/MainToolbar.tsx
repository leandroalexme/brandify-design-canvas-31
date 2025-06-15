
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
  const [alignmentPanelPosition, setAlignmentPanelPosition] = React.useState({ x: 200, y: 200 });

  const [showColorPanel, setShowColorPanel] = React.useState(false);
  const [colorPanelPosition, setColorPanelPosition] = React.useState({ x: 350, y: 200 });

  const [showGlyphPanel, setShowGlyphPanel] = React.useState(false);
  const [glyphPanelPosition, setGlyphPanelPosition] = React.useState({ x: 500, y: 200 });

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

  // Handler melhorado para ferramentas do submenu de texto
  const handleTextSubmenuToolSelect = React.useCallback((toolId: string) => {
    console.log('📝 [MAIN TOOLBAR] Text submenu tool selected:', toolId);
    
    // Calcular posições baseadas na posição do submenu
    const baseX = 250;
    const baseY = 120;
    
    if (toolId === 'typography') {
      console.log('📝 [MAIN TOOLBAR] Opening font config panel from typography tool');
      
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
      setAlignmentPanelPosition({ x: baseX, y: baseY });
      setShowAlignmentPanel(true);
    } else if (toolId === 'color') {
      console.log('🎨 [MAIN TOOLBAR] Opening color config panel');
      setColorPanelPosition({ x: baseX + 150, y: baseY });
      setShowColorPanel(true);
    } else if (toolId === 'glyph') {
      console.log('🔤 [MAIN TOOLBAR] Opening glyph panel');
      setGlyphPanelPosition({ x: baseX + 300, y: baseY });
      setShowGlyphPanel(true);
    }
  }, [handleSubToolSelect, buttonRefs]);

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

      {/* Submenu de propriedades de texto - melhorado */}
      <TextPropertiesSubmenu
        isOpen={showTextPanel}
        onClose={handleTextPanelClose}
        onToolSelect={handleTextSubmenuToolSelect}
        position={{ x: 50, y: 120 }}
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
            position={fontPanelPosition}
          />

          <AlignmentConfigPanel
            isOpen={showAlignmentPanel}
            onClose={handleAlignmentPanelClose}
            position={alignmentPanelPosition}
          />

          <ColorConfigPanel
            isOpen={showColorPanel}
            onClose={handleColorPanelClose}
            position={colorPanelPosition}
          />

          <GlyphPanel
            isOpen={showGlyphPanel}
            onClose={handleGlyphPanelClose}
            position={glyphPanelPosition}
          />
        </>
      )}
    </>
  );
};
