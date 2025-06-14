import React, { useState, useRef } from 'react';
import { SimpleSubmenu } from './SimpleSubmenu';
import { useSimpleToolState } from '../hooks/useSimpleToolState';
import { ToolType, MainTool, SubTool } from '../types/tools';
import { TOOL_ICONS, TOOL_LABELS, SUB_TOOL_OPTIONS } from '../utils/toolConfig';

interface MainToolbarProps {
  selectedTool: ToolType;
  onToolSelect: (tool: ToolType) => void;
  selectedColor: string;
  onColorSelect: (color: string) => void;
  canvasRef: React.RefObject<HTMLDivElement>;
}

export const MainToolbar = ({ selectedTool, onToolSelect }: MainToolbarProps) => {
  const {
    currentTool,
    activeSubTools,
    selectMainTool,
    selectSubTool,
    returnToMainTool,
    getCurrentMainTool
  } = useSimpleToolState(selectedTool);

  const [showSubmenu, setShowSubmenu] = useState<string | null>(null);
  const [submenuPosition, setSubmenuPosition] = useState({ x: 0, y: 0 });
  
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Sincronizar com o estado externo quando currentTool muda
  React.useEffect(() => {
    if (currentTool !== selectedTool) {
      onToolSelect(currentTool);
    }
  }, [currentTool, selectedTool, onToolSelect]);

  // Ferramentas principais com ícones dinâmicos
  const mainTools = [
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
      hasSubmenu: false
    },
    {
      id: 'text',
      icon: TOOL_ICONS.text,
      label: TOOL_LABELS.text,
      hasSubmenu: false
    }
  ];

  const handleToolClick = (toolId: string) => {
    const tool = mainTools.find(t => t.id === toolId);
    if (!tool) return;

    // Fechar submenu se estiver aberto
    setShowSubmenu(null);

    if (tool.hasSubmenu) {
      selectMainTool(toolId as MainTool);
    } else {
      onToolSelect(toolId as ToolType);
    }
  };

  const handleToolRightClick = (e: React.MouseEvent, toolId: string) => {
    e.preventDefault();
    const tool = mainTools.find(t => t.id === toolId);
    if (!tool || !tool.hasSubmenu) return;

    const button = buttonRefs.current[toolId];
    if (button) {
      const rect = button.getBoundingClientRect();
      setSubmenuPosition({
        x: rect.left + rect.width / 2,
        y: rect.top
      });
      setShowSubmenu(toolId);
    }
  };

  const handleSubToolSelect = (subToolId: string) => {
    selectSubTool(subToolId as SubTool);
    setShowSubmenu(null);
  };

  const handleToolDoubleClick = (toolId: string) => {
    const activeSub = activeSubTools[toolId as keyof typeof activeSubTools];
    if (activeSub) {
      returnToMainTool(toolId as MainTool);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[400]" data-toolbar>
        <div className="floating-module rounded-2xl p-3 flex items-center space-x-2">
          {mainTools.map((tool) => {
            const Icon = tool.icon;
            const isActive = getCurrentMainTool() === tool.id;
            const hasActiveSub = activeSubTools[tool.id as keyof typeof activeSubTools];
            
            return (
              <button
                key={tool.id}
                ref={el => buttonRefs.current[tool.id] = el}
                className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 smooth-transform ${
                  isActive 
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25 transform hover:scale-105' 
                    : 'bg-transparent text-slate-300 hover:bg-slate-700/50 hover:text-white hover:scale-105'
                } active:scale-95`}
                onClick={() => handleToolClick(tool.id)}
                onContextMenu={(e) => handleToolRightClick(e, tool.id)}
                onDoubleClick={() => handleToolDoubleClick(tool.id)}
                title={`${tool.label}${tool.hasSubmenu ? ' (clique direito para submenu)' : ''}`}
              >
                <Icon className="w-5 h-5" />
                {hasActiveSub && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-slate-800 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {showSubmenu && SUB_TOOL_OPTIONS[showSubmenu as keyof typeof SUB_TOOL_OPTIONS] && (
        <SimpleSubmenu
          isOpen={!!showSubmenu}
          onClose={() => setShowSubmenu(null)}
          onSelect={handleSubToolSelect}
          position={submenuPosition}
          options={SUB_TOOL_OPTIONS[showSubmenu as keyof typeof SUB_TOOL_OPTIONS]}
        />
      )}
    </>
  );
};
