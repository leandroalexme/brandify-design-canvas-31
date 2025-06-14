
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
      className="fixed z-[450] bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-2xl p-2 flex flex-col gap-1 animate-fade-in"
      style={{
        left: position.x - 36,
        top: position.y - (options.length * 48 + 16)
      }}
    >
      {options.map((option) => {
        const Icon = option.icon;
        return (
          <button
            key={option.id}
            className="w-16 h-12 flex items-center justify-center rounded-lg bg-transparent hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all duration-200"
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
