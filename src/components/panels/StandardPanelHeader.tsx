
import React from 'react';
import { X, LucideIcon } from 'lucide-react';

interface StandardPanelHeaderProps {
  title: string;
  icon: LucideIcon;
  iconColor?: string;
  onClose: () => void;
  isDraggable?: boolean;
  onDragStart?: (e: React.MouseEvent) => void;
}

export const StandardPanelHeader = ({ 
  title, 
  icon: Icon, 
  iconColor = 'text-blue-400',
  onClose,
  isDraggable = false,
  onDragStart
}: StandardPanelHeaderProps) => {
  return (
    <div 
      className={`panel-header ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
      onMouseDown={isDraggable ? onDragStart : undefined}
    >
      <div className="flex items-center gap-3">
        <div className="w-2 h-6 bg-orange-400 rounded-full" />
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <span className="panel-title-text">{title}</span>
      </div>
      <button
        onClick={onClose}
        className="panel-close-button"
        title="Fechar"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
