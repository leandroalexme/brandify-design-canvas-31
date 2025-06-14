
import React, { useRef, useEffect, useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface ToolOption {
  id: string;
  icon: LucideIcon;
  label: string;
}

interface ToolSubmenuProps {
  isOpen: boolean;
  onClose: () => void;
  onToolSelect: (toolId: string) => void;
  position: { x: number; y: number };
  selectedTool?: string;
  tools: ToolOption[];
  title?: string;
}

export const ToolSubmenu = ({ 
  isOpen, 
  onClose, 
  onToolSelect, 
  position, 
  selectedTool, 
  tools,
  title 
}: ToolSubmenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [finalPosition, setFinalPosition] = useState(position);
  const [animationDirection, setAnimationDirection] = useState<'up' | 'down' | 'left' | 'right'>('up');

  // SISTEMA DE ESPAÇAMENTO PADRONIZADO - Design System Global
  const DESIGN_SYSTEM = {
    MENU_WIDTH: 72,
    BUTTON_HEIGHT: 48,
    BUTTON_GAP: 8,
    MENU_PADDING: 12,
    VIEWPORT_MARGIN: 16,
    TOOLBAR_SPACING: 50, // Reduzido para 50px
    ANIMATION_STAGGER_DELAY: 0.05,
  };

  const calculateOptimalPosition = (): { position: { x: number; y: number }; direction: 'up' | 'down' | 'left' | 'right' } => {
    const menuWidth = DESIGN_SYSTEM.MENU_WIDTH;
    const menuHeight = tools.length * (DESIGN_SYSTEM.BUTTON_HEIGHT + DESIGN_SYSTEM.BUTTON_GAP) 
                      - DESIGN_SYSTEM.BUTTON_GAP + (DESIGN_SYSTEM.MENU_PADDING * 2);
    const margin = DESIGN_SYSTEM.VIEWPORT_MARGIN;
    const toolbarSpacing = DESIGN_SYSTEM.TOOLBAR_SPACING;
    
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let optimalPosition = { ...position };
    let direction: 'up' | 'down' | 'left' | 'right' = 'up';

    // Calcular espaço seguro acima da toolbar (zona protegida)
    const safeSpaceAbove = viewport.height - (toolbarSpacing + 60) - menuHeight - margin;
    
    // Prioridade: posicionar acima do botão (preferido e seguro)
    if (position.y - menuHeight - margin >= margin && safeSpaceAbove >= 0) {
      optimalPosition.x = position.x - menuWidth / 2; // Centralizar no botão
      optimalPosition.y = Math.min(position.y - menuHeight - toolbarSpacing, safeSpaceAbove);
      direction = 'up';
    }
    // Tentar à esquerda do botão
    else if (position.x - menuWidth - margin >= 0) {
      optimalPosition.x = position.x - menuWidth - margin;
      optimalPosition.y = Math.max(margin, Math.min(position.y - menuHeight/2, safeSpaceAbove));
      direction = 'left';
    }
    // Tentar à direita do botão
    else if (position.x + menuWidth + margin <= viewport.width) {
      optimalPosition.x = position.x + margin;
      optimalPosition.y = Math.max(margin, Math.min(position.y - menuHeight/2, safeSpaceAbove));
      direction = 'right';
    }
    // Fallback: posicionar seguramente acima com centralização horizontal
    else {
      optimalPosition.x = Math.max(margin, Math.min(position.x - menuWidth/2, viewport.width - menuWidth - margin));
      optimalPosition.y = Math.max(margin, safeSpaceAbove - 10);
      direction = 'up';
    }

    // Garantir que o menu permaneça dentro dos limites horizontais
    optimalPosition.x = Math.max(margin, Math.min(optimalPosition.x, viewport.width - menuWidth - margin));
    
    return { position: optimalPosition, direction };
  };

  useEffect(() => {
    if (isOpen) {
      const result = calculateOptimalPosition();
      setFinalPosition(result.position);
      setAnimationDirection(result.direction);
    }
  }, [isOpen, position]);

  const handleToolClick = (toolId: string) => {
    onToolSelect(toolId);
    onClose();
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getAnimationClass = () => {
    switch (animationDirection) {
      case 'up': return 'animate-slide-up';
      case 'down': return 'animate-slide-down';
      case 'left': return 'animate-slide-left';
      case 'right': return 'animate-slide-right';
      default: return 'animate-slide-up';
    }
  };

  return (
    <div 
      ref={menuRef}
      className={`submenu-container ${getAnimationClass()}`}
      style={{
        left: finalPosition.x,
        top: finalPosition.y,
        width: `${DESIGN_SYSTEM.MENU_WIDTH}px`,
        padding: `${DESIGN_SYSTEM.MENU_PADDING}px`,
        gap: `${DESIGN_SYSTEM.BUTTON_GAP}px`
      }}
      data-submenu
    >
      {tools.map((tool, index) => {
        const Icon = tool.icon;
        const isSelected = selectedTool === tool.id;
        
        return (
          <button
            key={tool.id}
            className={`submenu-option animate-stagger-fade ${isSelected ? 'selected animate-pulse-select' : ''}`}
            style={{ 
              height: `${DESIGN_SYSTEM.BUTTON_HEIGHT}px`,
              animationDelay: `${index * DESIGN_SYSTEM.ANIMATION_STAGGER_DELAY}s`,
              animationFillMode: 'both'
            }}
            onClick={() => handleToolClick(tool.id)}
            title={tool.label}
          >
            <Icon className="w-5 h-5" />
          </button>
        );
      })}
    </div>
  );
};
