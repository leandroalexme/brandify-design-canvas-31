
import { useState, useCallback, useEffect } from 'react';
import { ToolType, MainTool, SubTool } from '../types/tools';
import { SUB_TOOL_TO_MAIN } from '../utils/toolConfig';

export const useSimpleToolState = (initialTool: ToolType = 'select') => {
  const [currentTool, setCurrentTool] = useState<ToolType>(initialTool);
  const [activeSubTools, setActiveSubTools] = useState<Record<MainTool, SubTool | null>>({
    select: null,
    pen: null,
    shapes: null,
    text: null
  });

  // Auto-retorno apenas por clique fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const isToolbarClick = target.closest('[data-toolbar]');
      const isSubmenuClick = target.closest('[data-submenu]');
      
      if (!isToolbarClick && !isSubmenuClick && isSubTool(currentTool)) {
        const mainTool = SUB_TOOL_TO_MAIN[currentTool];
        returnToMainTool(mainTool);
      }
    };

    if (isSubTool(currentTool)) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [currentTool]);

  const selectMainTool = useCallback((tool: MainTool) => {
    // Se já há uma sub-ferramenta ativa para esta ferramenta, seleciona ela
    const activeSub = activeSubTools[tool];
    setCurrentTool(activeSub || tool);
  }, [activeSubTools]);

  const selectSubTool = useCallback((subTool: SubTool) => {
    const mainTool = SUB_TOOL_TO_MAIN[subTool];
    setActiveSubTools(prev => ({
      ...prev,
      [mainTool]: subTool
    }));
    setCurrentTool(subTool);
  }, []);

  const returnToMainTool = useCallback((mainTool: MainTool) => {
    setActiveSubTools(prev => ({
      ...prev,
      [mainTool]: null
    }));
    setCurrentTool(mainTool);
  }, []);

  const isSubTool = (tool: ToolType): tool is SubTool => {
    return tool in SUB_TOOL_TO_MAIN;
  };

  const getCurrentMainTool = (): MainTool => {
    if (isSubTool(currentTool)) {
      return SUB_TOOL_TO_MAIN[currentTool];
    }
    return currentTool as MainTool;
  };

  return {
    currentTool,
    activeSubTools,
    selectMainTool,
    selectSubTool,
    returnToMainTool,
    isSubTool,
    getCurrentMainTool
  };
};
