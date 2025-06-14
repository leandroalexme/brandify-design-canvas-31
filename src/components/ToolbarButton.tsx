
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ToolbarButtonProps {
  id: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  onMouseUp?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  buttonRef?: React.RefObject<HTMLButtonElement>;
}

export const ToolbarButton = ({
  icon: Icon,
  label,
  isActive,
  onClick,
  onMouseDown,
  onMouseUp,
  onContextMenu,
  buttonRef
}: ToolbarButtonProps) => {
  return (
    <button
      ref={buttonRef}
      className={`tool-button smooth-transition ${isActive ? 'active' : ''}`}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onContextMenu={onContextMenu}
      title={label}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
};
