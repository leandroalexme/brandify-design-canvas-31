
import React from 'react';
import { MainToolbarButton } from '../MainToolbarButton';
import { ToolType, MainTool } from '../../types/tools';

interface MainToolConfig {
  id: MainTool;
  icon: any;
  label: string;
  hasSubmenu: boolean;
}

interface MainToolbarButtonsProps {
  selectedTool: ToolType;
  showTextPanel: boolean;
  selectedShape: string | null;
  mainTools: MainToolConfig[];
  buttonRefs: React.MutableRefObject<Record<string, HTMLButtonElement | null>>;
  activeSubTools: Record<MainTool, any>;
  onToolClick: (toolId: string) => void;
  onToolRightClick: (e: React.MouseEvent, toolId: MainTool) => void;
  onToolDoubleClick: (toolId: MainTool) => void;
}

export const MainToolbarButtons = ({
  selectedTool,
  showTextPanel,
  selectedShape,
  mainTools,
  buttonRefs,
  activeSubTools,
  onToolClick,
  onToolRightClick,
  onToolDoubleClick
}: MainToolbarButtonsProps) => {
  // Ensure mainTools is always an array
  const safeMainTools = Array.isArray(mainTools) ? mainTools : [];
  
  return (
    <div className="floating-module rounded-2xl p-3 flex items-center space-x-2">
      {safeMainTools.map((tool) => {
        const isActive = tool.id === 'text' ? showTextPanel : selectedTool === tool.id;
        
        return (
          <MainToolbarButton
            key={tool.id}
            tool={tool}
            isActive={isActive}
            hasActiveSub={activeSubTools[tool.id]}
            hasSelectedShape={tool.id === 'shapes' && !!selectedShape}
            buttonRef={(el) => { buttonRefs.current[tool.id] = el; }}
            onClick={() => onToolClick(tool.id)}
            onRightClick={(e) => onToolRightClick(e, tool.id)}
            onDoubleClick={() => onToolDoubleClick(tool.id)}
          />
        );
      })}
    </div>
  );
};
