
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
  console.log('🔧 [MAIN TOOLBAR BUTTONS] Rendering with:', {
    selectedTool,
    showTextPanel,
    selectedShape,
    mainToolsCount: mainTools?.length || 0,
    activeSubTools
  });

  // Ensure mainTools is always an array
  const safeMainTools = Array.isArray(mainTools) ? mainTools : [];
  
  if (safeMainTools.length === 0) {
    console.warn('🔧 [MAIN TOOLBAR BUTTONS] No main tools available');
    return null;
  }
  
  return (
    <div className="floating-module rounded-2xl p-3 flex items-center space-x-2">
      {safeMainTools.map((tool) => {
        const isActive = tool.id === 'text' ? showTextPanel : selectedTool === tool.id;
        
        console.log(`🔧 [MAIN TOOLBAR BUTTONS] Tool ${tool.id}:`, {
          isActive,
          hasActiveSub: activeSubTools[tool.id],
          hasSelectedShape: tool.id === 'shapes' && !!selectedShape
        });
        
        return (
          <MainToolbarButton
            key={tool.id}
            tool={tool}
            isActive={isActive}
            hasActiveSub={activeSubTools[tool.id]}
            hasSelectedShape={tool.id === 'shapes' && !!selectedShape}
            buttonRef={(el) => { 
              console.log(`🔧 [MAIN TOOLBAR BUTTONS] Setting ref for ${tool.id}:`, !!el);
              buttonRefs.current[tool.id] = el; 
            }}
            onClick={() => {
              console.log(`🔧 [MAIN TOOLBAR BUTTONS] Click on ${tool.id}`);
              onToolClick(tool.id);
            }}
            onRightClick={(e) => {
              console.log(`🔧 [MAIN TOOLBAR BUTTONS] Right click on ${tool.id}`);
              onToolRightClick(e, tool.id);
            }}
            onDoubleClick={() => {
              console.log(`🔧 [MAIN TOOLBAR BUTTONS] Double click on ${tool.id}`);
              onToolDoubleClick(tool.id);
            }}
          />
        );
      })}
    </div>
  );
};
