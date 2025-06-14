
import React, { useRef, useEffect, useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface SubmenuOption {
  id: string;
  icon: LucideIcon;
  label: string;
}

interface SimpleSubmenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (toolId: string) => void;
  position: { x: number; y: number };
  options: SubmenuOption[];
}

export const SimpleSubmenu = ({ isOpen, onClose, onSelect, position, options }: SimpleSubmenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [finalPosition, setFinalPosition] = useState(position);

  // Sistema de espaçamento padronizado
  const DESIGN_SYSTEM = {
    MENU_WIDTH: 72,
    BUTTON_HEIGHT: 48,
    BUTTON_GAP: 8,
    MENU_PADDING: 12,
    VIEWPORT_MARGIN: 16,
    TOOLBAR_SPACING: 80, // Espaçamento maior da toolbar
    ANIMATION_STAGGER_DELAY: 0.08,
  };

  const calculateOptimalPosition = () => {
    const menuWidth = DESIGN_SYSTEM.MENU_WIDTH;
    const menuHeight = options.length * (DESIGN_SYSTEM.BUTTON_HEIGHT + DESIGN_SYSTEM.BUTTON_GAP) 
                      - DESIGN_SYSTEM.BUTTON_GAP + (DESIGN_SYSTEM.MENU_PADDING * 2);
    const margin = DESIGN_SYSTEM.VIEWPORT_MARGIN;
    const toolbarSpacing = DESIGN_SYSTEM.TOOLBAR_SPACING;
    
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let optimalPosition = { ...position };

    // Posicionar acima da toolbar com espaçamento adequado
    optimalPosition.x = position.x - menuWidth / 2; // Centralizar no botão
    optimalPosition.y = position.y - menuHeight - toolbarSpacing; // Maior espaçamento

    // Garantir que não saia da viewport horizontalmente
    optimalPosition.x = Math.max(margin, Math.min(optimalPosition.x, viewport.width - menuWidth - margin));
    
    // Garantir que não saia da viewport verticalmente
    optimalPosition.y = Math.max(margin, optimalPosition.y);

    return optimalPosition;
  };

  useEffect(() => {
    if (isOpen) {
      const result = calculateOptimalPosition();
      setFinalPosition(result);
    }
  }, [isOpen, position]);

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

  return (
    <div 
      ref={menuRef}
      data-submenu
      className="submenu-container animate-slide-up"
      style={{
        left: finalPosition.x,
        top: finalPosition.y,
        width: `${DESIGN_SYSTEM.MENU_WIDTH}px`,
        padding: `${DESIGN_SYSTEM.MENU_PADDING}px`,
        gap: `${DESIGN_SYSTEM.BUTTON_GAP}px`
      }}
    >
      {options.map((option, index) => {
        const Icon = option.icon;
        return (
          <button
            key={option.id}
            className="submenu-option animate-stagger-fade"
            style={{ 
              height: `${DESIGN_SYSTEM.BUTTON_HEIGHT}px`,
              animationDelay: `${index * DESIGN_SYSTEM.ANIMATION_STAGGER_DELAY}s`,
              animationFillMode: 'both'
            }}
            onClick={() => onSelect(option.id)}
            title={option.label}
          >
            <Icon className="w-5 h-5" />
          </button>
        );
      })}
    </div>
  );
};
