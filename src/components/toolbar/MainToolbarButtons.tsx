
import React from 'react';
import { MainToolbarButton } from '../MainToolbarButton';
import { MAIN_TOOLS } from './MainToolbarConfig';
import { ToolType, MainTool } from '../../types/tools';

interface MainToolbarButtonsProps {
  selectedTool: ToolType;
  showTextPanel: boolean;
  selectedShape: string | null;
  onToolClick: (toolId: MainTool) => void;
}

export const MainToolbarButtons = ({
  selectedTool,
  showTextPanel,
  selectedShape,
  onToolClick
}: MainToolbarButtonsProps) => {
  return (
    <div className="floating-module rounded-2xl p-3 flex items-center space-x-2">
      {MAIN_TOOLS.map((tool) => {
        const isActive = tool.id === 'text' ? showTextPanel : selectedTool === tool.id;
        
        return (
          <MainToolbarButton
            key={tool.id}
            tool={tool}
            isActive={isActive}
            hasActiveSub={null}
            hasSelectedShape={tool.id === 'shapes' && !!selectedShape}
            buttonRef={() => {}}
            onClick={() => onToolClick(tool.id)}
            onRightClick={() => {}}
            onDoubleClick={() => {}}
          />
        );
      })}
    </div>
  );
};
