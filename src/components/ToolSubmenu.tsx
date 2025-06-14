
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

  // ESPAÇAMENTO IGUAL AO ShapesMenu - Copiado exatamente do ShapesMenu.tsx
  const calculateOptimalPosition = (): { position: { x: number; y: number }; direction: 'up' | 'down' | 'left' | 'right' } => {
    const menuWidth = 72;
    const menuHeight = tools.length * 52 + 16; // MESMO CÁLCULO do ShapesMenu
    const margin = 16;
    const toolbarZoneHeight = 120; // MESMA proteção da toolbar
    
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let optimalPosition = { ...position };
    let direction: 'up' | 'down' | 'left' | 'right' = 'up';

    // MESMO cálculo de espaço seguro do ShapesMenu
    const safeSpaceAbove = viewport.height - toolbarZoneHeight - menuHeight - margin;
    
    // MESMA lógica de posicionamento do ShapesMenu
    if (position.y - menuHeight - margin >= margin && safeSpaceAbove >= 0) {
      optimalPosition.x = position.x - menuWidth / 2;
      optimalPosition.y = Math.min(position.y - menuHeight - margin, safeSpaceAbove);
      direction = 'up';
    }
    else if (position.x - menuWidth - margin >= 0) {
      optimalPosition.x = position.x - menuWidth - margin;
      optimalPosition.y = Math.max(margin, Math.min(position.y - menuHeight/2, safeSpaceAbove));
      direction = 'left';
    }
    else if (position.x + menuWidth + margin <= viewport.width) {
      optimalPosition.x = position.x + margin;
      optimalPosition.y = Math.max(margin, Math.min(position.y - menuHeight/2, safeSpaceAbove));
      direction = 'right';
    }
    else {
      optimalPosition.x = Math.max(margin, Math.min(position.x - menuWidth/2, viewport.width - menuWidth - margin));
      optimalPosition.y = Math.max(margin, safeSpaceAbove - 10);
      direction = 'up';
    }

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
      className={`fixed z-[450] floating-menu p-3 flex flex-col gap-2 ${getAnimationClass()}`}
      style={{
        left: finalPosition.x,
        top: finalPosition.y,
        width: '72px' // MESMA largura do ShapesMenu
      }}
    >
      {tools.map((tool, index) => {
        const Icon = tool.icon;
        const isSelected = selectedTool === tool.id;
        
        return (
          <button
            key={tool.id}
            className={`action-button animate-stagger-fade ${isSelected ? 'selected animate-pulse-select' : ''}`}
            style={{ 
              animationDelay: `${index * 0.05}s`, // MESMA animação
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
