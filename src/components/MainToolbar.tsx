
import React from 'react';
import { SimpleSubmenu } from './SimpleSubmenu';
import { ShapesMenu } from './ShapesMenu';
import { FontConfigPanel } from './FontConfigPanel';
import { TextPropertiesSubmenu } from './TextPropertiesSubmenu';
import { AlignmentConfigPanel } from './AlignmentConfigPanel';
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
  // Estado para o painel de alinhamento
  const [showAlignmentPanel, setShowAlignmentPanel] = React.useState(false);
  const [alignmentPanelPosition, setAlignmentPanelPosition] = React.useState({ x: 120, y: 200 });

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

  // Handler específico para o botão de texto - agora abre o submenu de propriedades
  const handleTextToolClick = React.useCallback(() => {
    console.log('📝 [MAIN TOOLBAR] Text tool clicked - Opening text properties submenu');
    onOpenTextPanel();
  }, [onOpenTextPanel]);

  // Handler personalizado que intercepta cliques no botão de texto
  const handleCustomToolClick = React.useCallback((toolId: string) => {
    console.log('🔧 [MAIN TOOLBAR] Custom tool click:', toolId);
    
    if (toolId === 'text') {
      handleTextToolClick();
    } else {
      handleToolClick(toolId as any);
    }
  }, [handleTextToolClick, handleToolClick]);

  // Handler para ferramentas do submenu de texto
  const handleTextSubmenuToolSelect = React.useCallback((toolId: string) => {
    console.log('📝 [MAIN TOOLBAR] Text submenu tool selected:', toolId);
    
    if (toolId === 'typography') {
      // Abrir o FontConfigPanel quando selecionar tipografia
      console.log('📝 [MAIN TOOLBAR] Opening font config panel from typography tool');
      
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      const position = { x: centerX, y: centerY };
      console.log('📝 [MAIN TOOLBAR] Font panel position:', position);
      
      // Usar os handlers existentes do hook
      const fontPanelButton = buttonRefs.current['text'];
      if (fontPanelButton) {
        const rect = fontPanelButton.getBoundingClientRect();
        const buttonPosition = {
          x: rect.left + rect.width / 2,
          y: rect.top
        };
        
        // Simular o comportamento do submenu existente para abrir o font panel
        handleSubToolSelect('fontConfig');
      }
    } else if (toolId === 'alignment') {
      // Abrir o painel de alinhamento
      console.log('📐 [MAIN TOOLBAR] Opening alignment config panel');
      
      const position = { x: 120, y: 200 };
      setAlignmentPanelPosition(position);
      setShowAlignmentPanel(true);
    } else {
      // Para outras ferramentas, apenas log por enquanto
      console.log('📝 [MAIN TOOLBAR] Text tool not implemented yet:', toolId);
    }
  }, [handleSubToolSelect, buttonRefs]);

  // Handler para fechar o painel de alinhamento
  const handleAlignmentPanelClose = React.useCallback(() => {
    console.log('📐 [MAIN TOOLBAR] Closing alignment panel');
    setShowAlignmentPanel(false);
  }, []);

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

      {/* Submenu para select e pen apenas */}
      {showSubmenu && showSubmenu !== 'text' && SUB_TOOL_OPTIONS[showSubmenu as keyof typeof SUB_TOOL_OPTIONS] && (
        <SimpleSubmenu
          isOpen={!!showSubmenu}
          onClose={handleSubmenuClose}
          onSelect={handleSubToolSelect}
          position={submenuPosition}
          options={SUB_TOOL_OPTIONS[showSubmenu as keyof typeof SUB_TOOL_OPTIONS]}
        />
      )}

      {/* Submenu de propriedades de texto */}
      <TextPropertiesSubmenu
        isOpen={showTextPanel}
        onClose={() => onOpenTextPanel()}
        onToolSelect={handleTextSubmenuToolSelect}
        position={{ x: 32, y: 120 }}
      />

      {/* Menu específico para shapes */}
      <ShapesMenu
        isOpen={showShapesMenu}
        onClose={handleShapesMenuClose}
        onShapeSelect={handleShapeSelect}
        position={shapesMenuPosition}
        selectedShape={selectedShape}
      />

      {/* Painel de configuração de fonte - vinculado à tipografia */}
      <FontConfigPanel
        isOpen={showFontPanel}
        onClose={handleFontPanelClose}
        position={fontPanelPosition}
      />

      {/* Novo painel de configuração de alinhamento */}
      <AlignmentConfigPanel
        isOpen={showAlignmentPanel}
        onClose={handleAlignmentPanelClose}
        position={alignmentPanelPosition}
      />
    </>
  );
};
