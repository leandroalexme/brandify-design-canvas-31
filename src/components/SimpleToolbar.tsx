
import React, { useState, useRef, useEffect } from 'react';
import { 
  MAIN_TOOLS, 
  SUB_TOOLS, 
  getMainToolDisplayIcon, 
  getToolGroup,
  getToolShortcut 
} from '../utils/toolSystem';
import { ToolType } from './BrandifyStudio';

interface SimpleToolbarProps {
  selectedTool: ToolType;
  onToolSelect: (tool: ToolType) => void;
  onClickOutside: () => void;
}

export const SimpleToolbar = ({ selectedTool, onToolSelect, onClickOutside }: SimpleToolbarProps) => {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [submenuPosition, setSubmenuPosition] = useState({ x: 0, y: 0 });
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const submenuRef = useRef<HTMLDivElement>(null);

  // Fechar submenu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const isClickOnToolbar = toolbarRef.current?.contains(target);
      const isClickOnSubmenu = submenuRef.current?.contains(target);
      
      if (!isClickOnToolbar && !isClickOnSubmenu) {
        setActiveSubmenu(null);
        if (activeSubmenu) {
          onClickOutside();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeSubmenu, onClickOutside]);

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignorar se estiver digitando em um input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = event.key.toLowerCase();
      const hasModifier = event.ctrlKey || event.metaKey || event.altKey;

      // Mapear teclas para ferramentas
      const keyMap: Record<string, ToolType> = {
        'v': 'select',
        'p': 'pen',
        'r': 'rectangle',
        't': 'text',
        'h': 'hand',
        'z': hasModifier ? 'zoom-out' : 'zoom-in',
      };

      const tool = keyMap[key];
      if (tool) {
        event.preventDefault();
        onToolSelect(tool);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onToolSelect]);

  const handleToolClick = (toolId: string) => {
    const tool = toolId as ToolType;
    const mainTool = MAIN_TOOLS.find(t => t.id === toolId);
    
    if (mainTool?.hasSubmenu) {
      // Mostrar submenu
      const button = document.querySelector(`[data-tool="${toolId}"]`) as HTMLElement;
      if (button) {
        const rect = button.getBoundingClientRect();
        setSubmenuPosition({
          x: rect.left + rect.width / 2,
          y: rect.top
        });
        setActiveSubmenu(toolId);
      }
    } else {
      // Selecionar ferramenta diretamente
      onToolSelect(tool);
      setActiveSubmenu(null);
    }
  };

  const handleSubToolClick = (subTool: string) => {
    onToolSelect(subTool as ToolType);
    setActiveSubmenu(null);
  };

  return (
    <>
      {/* Toolbar Principal */}
      <div 
        ref={toolbarRef}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[500]" 
        data-toolbar
      >
        <div className="floating-module p-3 flex items-center space-x-2 animate-fade-in">
          {MAIN_TOOLS.map((tool) => {
            // Usar ícone dinâmico baseado na ferramenta selecionada
            const Icon = getMainToolDisplayIcon(tool.id, selectedTool);
            const isActive = getToolGroup(selectedTool) === tool.id;
            const shortcut = getToolShortcut(tool.id as ToolType);
            
            return (
              <div key={tool.id} className="relative">
                <button
                  data-tool={tool.id}
                  className={`tool-button smooth-transition hover-scale ${isActive ? 'active' : ''}`}
                  onClick={() => handleToolClick(tool.id)}
                  onMouseEnter={() => setHoveredTool(tool.id)}
                  onMouseLeave={() => setHoveredTool(null)}
                  title={`${tool.label}${shortcut ? ` (${shortcut})` : ''}`}
                >
                  <Icon className="w-5 h-5" />
                  {/* Indicador de sub-ferramenta ativa */}
                  {tool.hasSubmenu && isActive && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-slate-800 animate-scale-in" />
                  )}
                </button>
                
                {/* Tooltip com atalho */}
                {hoveredTool === tool.id && (
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded whitespace-nowrap animate-fade-in z-50">
                    {tool.label}
                    {shortcut && <span className="ml-1 opacity-75">({shortcut})</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Submenu Aprimorado */}
      {activeSubmenu && SUB_TOOLS[activeSubmenu as keyof typeof SUB_TOOLS] && (
        <div
          ref={submenuRef}
          className="fixed z-[450] floating-menu flex flex-col animate-slide-up"
          style={{
            left: submenuPosition.x - 36,
            top: submenuPosition.y - 20,
            transform: 'translateY(-100%)',
            width: '72px',
            padding: '12px',
            gap: '8px'
          }}
          data-submenu
        >
          {SUB_TOOLS[activeSubmenu as keyof typeof SUB_TOOLS].map((subTool, index) => {
            const Icon = getMainToolDisplayIcon(subTool.id, selectedTool);
            const isSelected = selectedTool === subTool.id;
            const shortcut = getToolShortcut(subTool.id as ToolType);
            
            return (
              <div key={subTool.id} className="relative">
                <button
                  className={`action-button hover-scale ${isSelected ? 'selected' : ''}`}
                  style={{ 
                    height: '48px',
                    animationDelay: `${index * 50}ms`
                  }}
                  onClick={() => handleSubToolClick(subTool.id)}
                  onMouseEnter={() => setHoveredTool(subTool.id)}
                  onMouseLeave={() => setHoveredTool(null)}
                  title={`${subTool.label}${shortcut ? ` (${shortcut})` : ''}`}
                >
                  <Icon className="w-5 h-5" />
                </button>
                
                {/* Tooltip do submenu */}
                {hoveredTool === subTool.id && (
                  <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded whitespace-nowrap animate-fade-in z-60">
                    {subTool.label}
                    {shortcut && <span className="ml-1 opacity-75">({shortcut})</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
