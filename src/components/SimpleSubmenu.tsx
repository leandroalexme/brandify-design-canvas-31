
import React, { useRef, useEffect } from 'react';
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
        left: position.x - 36,
        top: position.y - (options.length * 48 + 32) // Maior espaçamento da toolbar
      }}
    >
      {options.map((option, index) => {
        const Icon = option.icon;
        return (
          <button
            key={option.id}
            className={`submenu-option animate-fade-in animate-stagger-${index + 1}`}
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
