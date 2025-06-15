
import React, { useRef, useMemo } from 'react';
import { ToolType, MainTool } from '../types/tools';
import { TOOL_ICONS, TOOL_LABELS } from '../utils/toolConfig';
import { SHAPE_ICONS } from '../utils/shapeIcons';
import { debug } from '../utils/debug';

interface ToolDefinition {
  id: MainTool;
  icon: any;
  label: string;
  hasSubmenu: boolean;
}

export const useMainToolbarState = (
  selectedShape: string | null,
  activeSubTools: Record<MainTool, any>
) => {
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Estados locais para shapes menu
  const [showShapesMenu, setShowShapesMenu] = React.useState(false);
  const [shapesMenuPosition, setShapesMenuPosition] = React.useState({ x: 0, y: 0 });

  // Estados para o painel de configuração de fonte
  const [showFontPanel, setShowFontPanel] = React.useState(false);
  const [fontPanelPosition, setFontPanelPosition] = React.useState({ x: 0, y: 0 });

  // Definição das ferramentas principais - memoizado para performance
  const mainTools: ToolDefinition[] = useMemo(() => {
    debug.log('Recalculating main tools', { activeSubTools, selectedShape }, 'toolbar');
    
    return [
      {
        id: 'select',
        icon: activeSubTools.select ? TOOL_ICONS[activeSubTools.select] : TOOL_ICONS.select,
        label: activeSubTools.select ? TOOL_LABELS[activeSubTools.select] : TOOL_LABELS.select,
        hasSubmenu: true
      },
      {
        id: 'pen',
        icon: activeSubTools.pen ? TOOL_ICONS[activeSubTools.pen] : TOOL_ICONS.pen,
        label: activeSubTools.pen ? TOOL_LABELS[activeSubTools.pen] : TOOL_LABELS.pen,
        hasSubmenu: true
      },
      {
        id: 'shapes',
        icon: selectedShape ? SHAPE_ICONS[selectedShape as keyof typeof SHAPE_ICONS] : TOOL_ICONS.shapes,
        label: selectedShape ? `Forma: ${selectedShape}` : TOOL_LABELS.shapes,
        hasSubmenu: true
      },
      {
        id: 'text',
        icon: TOOL_ICONS.text,
        label: TOOL_LABELS.text,
        hasSubmenu: false // Mudado para false pois agora usa TextPropertiesSubmenu
      }
    ];
  }, [activeSubTools.select, activeSubTools.pen, selectedShape]);

  return {
    buttonRefs,
    showShapesMenu,
    setShowShapesMenu,
    shapesMenuPosition,
    setShapesMenuPosition,
    showFontPanel,
    setShowFontPanel,
    fontPanelPosition,
    setFontPanelPosition,
    mainTools
  };
};
