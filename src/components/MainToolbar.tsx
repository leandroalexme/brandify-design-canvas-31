
import React, { useRef, useMemo, useCallback } from 'react';
import { SimpleSubmenu } from './SimpleSubmenu';
import { ShapesMenu } from './ShapesMenu';
import { useToolState } from '../hooks/useToolState';
import { ToolType, MainTool } from '../types/tools';
import { TOOL_ICONS, TOOL_LABELS, SUB_TOOL_OPTIONS } from '../utils/toolConfig';

interface MainToolbarProps {
  selectedTool: ToolType;
  onToolSelect: (tool: ToolType) => void;
  selectedColor: string;
  onColorSelect: (color: string) => void;
  canvasRef: React.RefObject<HTMLDivElement>;
}

interface ToolDefinition {
  id: MainTool;
  icon: any;
  label: string;
  hasSubmenu: boolean;
}

export const MainToolbar = ({ selectedTool, onToolSelect }: MainToolbarProps) => {
  const {
    currentTool,
    activeSubTools,
    showSubmenu,
    submenuPosition,
    selectMainTool,
    selectSubTool,
    returnToMainTool,
    toggleSubmenu,
    getCurrentMainTool
  } = useToolState(selectedTool);

  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Estados locais para menus específicos
  const [showShapesMenu, setShowShapesMenu] = React.useState(false);
  const [shapesMenuPosition, setShapesMenuPosition] = React.useState({ x: 0, y: 0 });

  // Sincronizar com estado externo
  React.useEffect(() => {
    if (currentTool !== selectedTool) {
      onToolSelect(currentTool);
    }
  }, [currentTool, selectedTool, onToolSelect]);

  // Definição das ferramentas principais
  const mainTools: ToolDefinition[] = useMemo(() => [
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
      icon: TOOL_ICONS.shapes,
      label: TOOL_LABELS.shapes,
      hasSubmenu: true // Shapes também tem submenu
    },
    {
      id: 'text',
      icon: TOOL_ICONS.text,
      label: TOOL_LABELS.text,
      hasSubmenu: false
    }
  ], [activeSubTools]);

  // Handlers otimizados
  const handleToolClick = useCallback((toolId: MainTool) => {
    const tool = mainTools.find(t => t.id === toolId);
    if (!tool) return;

    if (toolId === 'shapes') {
      // Para shapes, mostrar menu específico
      selectMainTool(toolId);
    } else if (tool.hasSubmenu) {
      selectMainTool(toolId);
    } else {
      onToolSelect(toolId);
    }
  }, [mainTools, selectMainTool, onToolSelect]);

  const handleToolRightClick = useCallback((e: React.MouseEvent, toolId: MainTool) => {
    e.preventDefault();
    const tool = mainTools.find(t => t.id === toolId);
    if (!tool?.hasSubmenu) return;

    const button = buttonRefs.current[toolId];
    if (button) {
      const rect = button.getBoundingClientRect();
      const position = {
        x: rect.left + rect.width / 2,
        y: rect.top
      };

      if (toolId === 'shapes') {
        setShapesMenuPosition(position);
        setShowShapesMenu(true);
      } else {
        toggleSubmenu(toolId, position);
      }
    }
  }, [mainTools, toggleSubmenu]);

  const handleToolDoubleClick = useCallback((toolId: MainTool) => {
    const activeSub = activeSubTools[toolId];
    if (activeSub) {
      returnToMainTool(toolId);
    }
  }, [activeSubTools, returnToMainTool]);

  const handleSubToolSelect = useCallback((subToolId: string) => {
    selectSubTool(subToolId as any);
  }, [selectSubTool]);

  const handleSubmenuClose = useCallback(() => {
    toggleSubmenu(null);
  }, [toggleSubmenu]);

  const handleShapeSelect = useCallback((shapeId: string) => {
    // Lógica para seleção de forma
    console.log('Shape selected:', shapeId);
    setShowShapesMenu(false);
  }, []);

  const handleShapesMenuClose = useCallback(() => {
    setShowShapesMenu(false);
  }, []);

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[400]" data-toolbar>
        <div className="floating-module rounded-2xl p-3 flex items-center space-x-2">
          {mainTools.map((tool) => {
            const Icon = tool.icon;
            const isActive = getCurrentMainTool() === tool.id;
            const hasActiveSub = activeSubTools[tool.id];
            
            return (
              <button
                key={tool.id}
                ref={el => buttonRefs.current[tool.id] = el}
                className={`tool-button ${isActive ? 'active' : ''}`}
                onClick={() => handleToolClick(tool.id)}
                onContextMenu={(e) => handleToolRightClick(e, tool.id)}
                onDoubleClick={() => handleToolDoubleClick(tool.id)}
                title={`${tool.label}${tool.hasSubmenu ? ' (clique direito para submenu)' : ''}`}
              >
                <Icon className="w-5 h-5" />
                {hasActiveSub && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-slate-800" />
                )}
              </button>
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
      />
    </>
  );
};
