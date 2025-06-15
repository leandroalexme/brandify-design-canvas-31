
import React from 'react';
import { MainToolbarButtons } from './toolbar/MainToolbarButtons';
import { TextPanelsManager } from './toolbar/TextPanelsManager';
import { useEditor } from '../contexts/EditorContext';
import { useToolbarPosition } from '../hooks/useToolbarPosition';
import { ToolType, MainTool } from '../types/tools';
import { debug } from '../utils/debug';

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
  const { getToolbarCenter } = useToolbarPosition();
  
  // Estados para painéis melhorados com posicionamento otimizado
  const [showAlignmentPanel, setShowAlignmentPanel] = React.useState(false);
  const [showColorPanel, setShowColorPanel] = React.useState(false);
  const [showGlyphPanel, setShowGlyphPanel] = React.useState(false);
  const [showFontPanel, setShowFontPanel] = React.useState(false);

  // Simplified tool handling
  const handleToolClick = React.useCallback((toolId: MainTool) => {
    debug.log('Tool clicked in MainToolbar', { toolId }, 'toolbar');
    
    if (toolId === 'text') {
      toggleTextPanel();
    } else {
      onToolSelect(toolId);
    }
  }, [onToolSelect, toggleTextPanel]);

  // Enhanced handler for text submenu tools with intelligent positioning
  const handleTextSubmenuToolSelect = React.useCallback((toolId: string) => {
    debug.log('Text submenu tool selected', { toolId }, 'toolbar');
    
    // Close all panels first to avoid conflicts
    setShowAlignmentPanel(false);
    setShowColorPanel(false);
    setShowGlyphPanel(false);
    setShowFontPanel(false);
    
    // Small delay to ensure clean transitions
    setTimeout(() => {
      if (toolId === 'typography') {
        debug.log('Opening font config panel', undefined, 'toolbar');
        setShowFontPanel(true);
      } else if (toolId === 'alignment') {
        debug.log('Opening alignment config panel', undefined, 'toolbar');
        setShowAlignmentPanel(true);
      } else if (toolId === 'color') {
        debug.log('Opening color config panel', undefined, 'toolbar');
        setShowColorPanel(true);
      } else if (toolId === 'glyph') {
        debug.log('Opening glyph panel', undefined, 'toolbar');
        setShowGlyphPanel(true);
      }
    }, 100);
  }, []);

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
    debug.log('Closing text panel and all subpanels', undefined, 'toolbar');
    toggleTextPanel();
    
    // Fechar todos os subpainéis
    setShowAlignmentPanel(false);
    setShowColorPanel(false);
    setShowGlyphPanel(false);
    setShowFontPanel(false);
  }, [toggleTextPanel]);

  const handleFontPanelClose = React.useCallback(() => {
    setShowFontPanel(false);
  }, []);

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[400]" data-toolbar>
        <MainToolbarButtons
          selectedTool={selectedTool}
          showTextPanel={showTextPanel}
          selectedShape={selectedShape}
          onToolClick={handleToolClick}
        />
      </div>

      <TextPanelsManager
        showTextPanel={showTextPanel}
        showAlignmentPanel={showAlignmentPanel}
        showColorPanel={showColorPanel}
        showGlyphPanel={showGlyphPanel}
        showFontPanel={showFontPanel}
        position={getToolbarCenter()}
        onTextPanelClose={handleTextPanelClose}
        onAlignmentPanelClose={handleAlignmentPanelClose}
        onColorPanelClose={handleColorPanelClose}
        onGlyphPanelClose={handleGlyphPanelClose}
        onFontPanelClose={handleFontPanelClose}
        onTextSubmenuToolSelect={handleTextSubmenuToolSelect}
      />
    </>
  );
};
