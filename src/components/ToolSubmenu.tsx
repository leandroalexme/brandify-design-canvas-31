
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

  // Intelligent positioning system that respects toolbar
  const calculateOptimalPosition = (): { position: { x: number; y: number }; direction: 'up' | 'down' | 'left' | 'right' } => {
    const menuWidth = 72;
    const menuHeight = tools.length * 52 + 16;
    const margin = 16;
    const toolbarHeight = 80;
    const toolbarZoneHeight = 120; // Protected zone around toolbar
    
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let optimalPosition = { ...position };
    let direction: 'up' | 'down' | 'left' | 'right' = 'up';

    // Calculate safe space above toolbar (protected zone)
    const safeSpaceAbove = viewport.height - toolbarZoneHeight - menuHeight - margin;
    
    // Try to position above the button (preferred and safe)
    if (position.y - menuHeight - margin >= margin && safeSpaceAbove >= 0) {
      optimalPosition.x = position.x - menuWidth / 2; // Center on button
      optimalPosition.y = Math.min(position.y - menuHeight - margin, safeSpaceAbove);
      direction = 'up';
    }
    // Try left of the button
    else if (position.x - menuWidth - margin >= 0) {
      optimalPosition.x = position.x - menuWidth - margin;
      optimalPosition.y = Math.max(margin, Math.min(position.y - menuHeight/2, safeSpaceAbove));
      direction = 'left';
    }
    // Try right of the button
    else if (position.x + menuWidth + margin <= viewport.width) {
      optimalPosition.x = position.x + margin;
      optimalPosition.y = Math.max(margin, Math.min(position.y - menuHeight/2, safeSpaceAbove));
      direction = 'right';
    }
    // Fallback: position safely above with horizontal centering
    else {
      optimalPosition.x = Math.max(margin, Math.min(position.x - menuWidth/2, viewport.width - menuWidth - margin));
      optimalPosition.y = Math.max(margin, safeSpaceAbove - 10);
      direction = 'up';
    }

    // Ensure the menu stays within horizontal bounds
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
        width: '72px'
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
              animationDelay: `${index * 0.05}s`,
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
