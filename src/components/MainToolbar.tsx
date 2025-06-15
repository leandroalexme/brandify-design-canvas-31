
import React from 'react';
import { SimpleSubmenu } from './SimpleSubmenu';
import { ShapesMenu } from './ShapesMenu';
import { FontConfigPanel } from './FontConfigPanel';
import { TextPropertiesSubmenu } from './TextPropertiesSubmenu';
import { AlignmentConfigPanel } from './AlignmentConfigPanel';
import { ColorConfigPanel } from './ColorConfigPanel';
import { GlyphPanel } from './GlyphPanel';
import { MainToolbarButton } from './MainToolbarButton';
import { useEditor } from '../contexts/EditorContext';
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
  
  // Estados para painéis melhorados com posicionamento otimizado
  const [showAlignmentPanel, setShowAlignmentPanel] = React.useState(false);
  const [showColorPanel, setShowColorPanel] = React.useState(false);
  const [showGlyphPanel, setShowGlyphPanel] = React.useState(false);
  const [showFontPanel, setShowFontPanel] = React.useState(false);

  // Calculate base position from toolbar center
  const getToolbarCenter = React.useCallback(() => {
    return {
      x: window.innerWidth / 2,
      y: window.innerHeight - 120 // Toolbar is at bottom-6 (24px) + toolbar height
    };
  }, []);

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

  // Properly typed main tools array
  const mainTools: Array<{
    id: MainTool;
    icon: any;
    label: string;
    hasSubmenu: boolean;
  }> = [
    {
      id: 'select',
      icon: require('lucide-react').MousePointer,
      label: 'Select',
      hasSubmenu: false
    },
    {
      id: 'pen',
      icon: require('lucide-react').Pen,
      label: 'Pen',
      hasSubmenu: false
    },
    {
      id: 'shapes',
      icon: require('lucide-react').Circle,
      label: 'Shapes',
      hasSubmenu: false
    },
    {
      id: 'text',
      icon: require('lucide-react').Type,
      label: 'Text',
      hasSubmenu: false
    }
  ];

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[400]" data-toolbar>
        <div className="floating-module rounded-2xl p-3 flex items-center space-x-2">
          {mainTools.map((tool) => {
            const isActive = tool.id === 'text' ? showTextPanel : selectedTool === tool.id;
            
            return (
              <MainToolbarButton
                key={tool.id}
                tool={tool}
                isActive={isActive}
                hasActiveSub={null}
                hasSelectedShape={tool.id === 'shapes' && !!selectedShape}
                buttonRef={() => {}}
                onClick={() => handleToolClick(tool.id)}
                onRightClick={() => {}}
                onDoubleClick={() => {}}
              />
            );
          })}
        </div>
      </div>

      {/* Text Properties Submenu - with improved positioning */}
      <TextPropertiesSubmenu
        isOpen={showTextPanel}
        onClose={handleTextPanelClose}
        onToolSelect={handleTextSubmenuToolSelect}
        position={getToolbarCenter()}
      />

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
