
import React, { useRef, useCallback, useState } from 'react';
import { MainToolbarButtons } from './toolbar/MainToolbarButtons';
import { TextPanelsManager } from './toolbar/TextPanelsManager';
import { ShapesMenu } from './ShapesMenu';
import { ToolSubmenu } from './ToolSubmenu';
import { useEditor } from '../contexts/EditorContext';
import { ToolType, MainTool } from '../types/tools';
import { SUB_TOOL_OPTIONS } from '../utils/toolConfig';
import { TOOL_ICONS, TOOL_LABELS } from '../utils/toolConfig';
import { SHAPE_ICONS } from '../utils/shapeIcons';

interface MainToolbarProps {
  selectedTool: ToolType;
  onToolSelect: (tool: ToolType) => void;
  selectedColor: string;
  onColorSelect: (color: string) => void;
  selectedShape: string | null;
  onShapeSelect: (shape: string | null) => void;
  showTextPanel: boolean;
}

export const MainToolbar = ({ 
  selectedTool, 
  onToolSelect, 
  selectedShape, 
  onShapeSelect,
  showTextPanel
}: MainToolbarProps) => {
  console.log('🔧 [MAIN TOOLBAR] Rendering with props:', {
    selectedTool,
    selectedShape,
    showTextPanel
  });

  const { toggleTextPanel, updateUIState } = useEditor();
  
  // Estados locais para submenus
  const [showShapesMenu, setShowShapesMenu] = useState(false);
  const [shapesMenuPosition, setShapesMenuPosition] = useState({ x: 0, y: 0 });
  const [showSubmenu, setShowSubmenu] = useState<MainTool | null>(null);
  const [submenuPosition, setSubmenuPosition] = useState({ x: 0, y: 0 });
  const [activeSubTools, setActiveSubTools] = useState<Record<MainTool, any>>({
    select: null,
    pen: null,
    shapes: null,
    text: null
  });

  // Estados para painéis de texto
  const [showAlignmentPanel, setShowAlignmentPanel] = useState(false);
  const [showColorPanel, setShowColorPanel] = useState(false);
  const [showGlyphPanel, setShowGlyphPanel] = useState(false);
  const [showFontPanel, setShowFontPanel] = useState(false);
  const [fontPanelPosition, setFontPanelPosition] = useState({ x: 0, y: 0 });

  // Refs para botões
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Definição das ferramentas principais
  const mainTools = [
    {
      id: 'select' as MainTool,
      icon: activeSubTools.select ? TOOL_ICONS[activeSubTools.select] : TOOL_ICONS.select,
      label: activeSubTools.select ? TOOL_LABELS[activeSubTools.select] : TOOL_LABELS.select,
      hasSubmenu: true
    },
    {
      id: 'pen' as MainTool,
      icon: activeSubTools.pen ? TOOL_ICONS[activeSubTools.pen] : TOOL_ICONS.pen,
      label: activeSubTools.pen ? TOOL_LABELS[activeSubTools.pen] : TOOL_LABELS.pen,
      hasSubmenu: true
    },
    {
      id: 'shapes' as MainTool,
      icon: selectedShape ? SHAPE_ICONS[selectedShape as keyof typeof SHAPE_ICONS] : TOOL_ICONS.shapes,
      label: selectedShape ? `Forma: ${selectedShape}` : TOOL_LABELS.shapes,
      hasSubmenu: true
    },
    {
      id: 'text' as MainTool,
      icon: TOOL_ICONS.text,
      label: TOOL_LABELS.text,
      hasSubmenu: false
    }
  ];

  // Handler principal para clicks dos botões
  const handleToolClick = useCallback((toolId: string) => {
    console.log('🔧 [MAIN TOOLBAR] Tool click:', toolId);
    
    if (toolId === 'text') {
      toggleTextPanel();
    } else {
      onToolSelect(toolId as ToolType);
    }
  }, [onToolSelect, toggleTextPanel]);

  // Handler para right-click (abrir submenus)
  const handleToolRightClick = useCallback((e: React.MouseEvent, toolId: MainTool) => {
    e.preventDefault();
    console.log('🔧 [MAIN TOOLBAR] Right click:', toolId);
    
    const button = buttonRefs.current[toolId];
    if (!button) {
      console.warn('🔧 [MAIN TOOLBAR] Button ref not found for:', toolId);
      return;
    }

    const rect = button.getBoundingClientRect();
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.top
    };

    if (toolId === 'shapes') {
      console.log('🔧 [MAIN TOOLBAR] Opening shapes menu at:', position);
      setShapesMenuPosition(position);
      setShowShapesMenu(true);
    } else if (SUB_TOOL_OPTIONS[toolId]) {
      console.log('🔧 [MAIN TOOLBAR] Opening submenu for:', toolId, 'at:', position);
      setSubmenuPosition(position);
      setShowSubmenu(toolId);
    }
  }, []);

  // Handler para double-click (voltar à ferramenta principal)
  const handleToolDoubleClick = useCallback((toolId: MainTool) => {
    console.log('🔧 [MAIN TOOLBAR] Double click:', toolId);
    
    if (activeSubTools[toolId]) {
      setActiveSubTools(prev => ({ ...prev, [toolId]: null }));
      onToolSelect(toolId);
    }
    
    if (toolId === 'shapes') {
      onShapeSelect(null);
    }
  }, [activeSubTools, onToolSelect, onShapeSelect]);

  // Handler para seleção de sub-ferramenta
  const handleSubToolSelect = useCallback((subToolId: string) => {
    console.log('🔧 [MAIN TOOLBAR] Sub-tool selected:', subToolId);
    
    if (showSubmenu) {
      setActiveSubTools(prev => ({ ...prev, [showSubmenu]: subToolId }));
      onToolSelect(subToolId as ToolType);
      setShowSubmenu(null);
    }
  }, [showSubmenu, onToolSelect]);

  // Handler para seleção de forma
  const handleShapeSelect = useCallback((shapeId: string) => {
    console.log('🔧 [MAIN TOOLBAR] Shape selected:', shapeId);
    onShapeSelect(shapeId);
    setShowShapesMenu(false);
  }, [onShapeSelect]);

  // Handler para fechar submenus
  const handleSubmenuClose = useCallback(() => {
    console.log('🔧 [MAIN TOOLBAR] Closing submenu');
    setShowSubmenu(null);
  }, []);

  const handleShapesMenuClose = useCallback(() => {
    console.log('🔧 [MAIN TOOLBAR] Closing shapes menu');
    setShowShapesMenu(false);
  }, []);

  const handleFontPanelClose = useCallback(() => {
    console.log('🔧 [MAIN TOOLBAR] Closing font panel');
    setShowFontPanel(false);
  }, []);

  // Handler para ferramentas do submenu de texto
  const handleTextSubmenuToolSelect = useCallback((toolId: string) => {
    console.log('🔧 [MAIN TOOLBAR] Text submenu tool selected:', toolId);
    
    // Fechar todos os painéis primeiro
    setShowAlignmentPanel(false);
    setShowColorPanel(false);
    setShowGlyphPanel(false);
    setShowFontPanel(false);
    
    // Abrir o painel correspondente
    setTimeout(() => {
      if (toolId === 'alignment') {
        setShowAlignmentPanel(true);
      } else if (toolId === 'color') {
        setShowColorPanel(true);
      } else if (toolId === 'glyph') {
        setShowGlyphPanel(true);
      } else if (toolId === 'typography') {
        setShowFontPanel(true);
        setFontPanelPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
      }
    }, 100);
  }, []);

  // Get current submenu tools
  const submenuTools = showSubmenu ? SUB_TOOL_OPTIONS[showSubmenu] || [] : [];

  console.log('🔧 [MAIN TOOLBAR] Current state:', {
    showSubmenu,
    showShapesMenu,
    showTextPanel,
    mainToolsCount: mainTools.length
  });

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
        selectedTool={activeSubTools[showSubmenu || 'select']}
        tools={submenuTools}
        title={showSubmenu || 'select'}
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
