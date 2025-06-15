
import React from 'react';
import { MainTool, SubTool } from '../types/tools';

interface MainToolbarButtonProps {
  tool: {
    id: MainTool;
    icon: any;
    label: string;
    hasSubmenu: boolean;
  };
  isActive: boolean;
  hasActiveSub: SubTool | null;
  hasSelectedShape: boolean;
  buttonRef: (el: HTMLButtonElement | null) => void;
  onClick: () => void;
  onRightClick: (e: React.MouseEvent) => void;
  onDoubleClick: () => void;
}

export const MainToolbarButton = ({
  tool,
  isActive,
  hasActiveSub,
  hasSelectedShape,
  buttonRef,
  onClick,
  onRightClick,
  onDoubleClick
}: MainToolbarButtonProps) => {
  const Icon = tool.icon;
  
  console.log(`🔧 [MAIN TOOLBAR BUTTON] Rendering ${tool.id}:`, {
    isActive,
    hasActiveSub,
    hasSelectedShape,
    hasSubmenu: tool.hasSubmenu
  });
  
  // Show indicator for tools with active sub-tool or selected shape
  const shouldShowIndicator = tool.id !== 'text' && (hasActiveSub || hasSelectedShape);
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`🔧 [MAIN TOOLBAR BUTTON] Click on ${tool.id}`);
    onClick();
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`🔧 [MAIN TOOLBAR BUTTON] Right click on ${tool.id}`);
    onRightClick(e);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`🔧 [MAIN TOOLBAR BUTTON] Double click on ${tool.id}`);
    onDoubleClick();
  };
  
  return (
    <button
      ref={buttonRef}
      className={`tool-button ${isActive ? 'active' : ''}`}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onDoubleClick={handleDoubleClick}
      title={`${tool.label}${tool.hasSubmenu ? ' (clique direito para submenu)' : ''}`}
    >
      <Icon className="w-5 h-5" />
      {shouldShowIndicator && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-slate-800" />
      )}
    </button>
  );
};
