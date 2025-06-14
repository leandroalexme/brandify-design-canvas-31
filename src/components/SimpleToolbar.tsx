
import React, { useState, useRef, useEffect } from 'react';
import { MAIN_TOOLS, SUB_TOOLS, getToolIcon, getToolGroup } from '../utils/toolSystem';
import { ToolType } from './BrandifyStudio';

interface SimpleToolbarProps {
  selectedTool: ToolType;
  onToolSelect: (tool: ToolType) => void;
  onClickOutside: () => void;
}

export const SimpleToolbar = ({ selectedTool, onToolSelect, onClickOutside }: SimpleToolbarProps) => {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [submenuPosition, setSubmenuPosition] = useState({ x: 0, y: 0 });
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
        <div className="floating-module p-3 flex items-center space-x-2 animate-slide-up">
          {MAIN_TOOLS.map((tool) => {
            const Icon = getToolIcon(selectedTool);
            const isActive = getToolGroup(selectedTool) === tool.id;
            
            return (
              <button
                key={tool.id}
                data-tool={tool.id}
                className={`tool-button smooth-transition ${isActive ? 'active' : ''}`}
                onClick={() => handleToolClick(tool.id)}
                title={tool.label}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Submenu */}
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
          {SUB_TOOLS[activeSubmenu as keyof typeof SUB_TOOLS].map((subTool) => {
            const Icon = getToolIcon(subTool.id as ToolType);
            const isSelected = selectedTool === subTool.id;
            
            return (
              <button
                key={subTool.id}
                className={`action-button ${isSelected ? 'selected' : ''}`}
                style={{ height: '48px' }}
                onClick={() => handleSubToolClick(subTool.id)}
                title={subTool.label}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </div>
      )}
    </>
  );
};
