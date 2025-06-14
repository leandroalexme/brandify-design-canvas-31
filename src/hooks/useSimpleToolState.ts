
import { useState, useCallback } from 'react';
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

  // Selecionar ferramenta principal
  const selectMainTool = useCallback((tool: MainTool) => {
    const activeSub = activeSubTools[tool];
    setCurrentTool(activeSub || tool);
  }, [activeSubTools]);

  // Selecionar sub-ferramenta
  const selectSubTool = useCallback((subTool: SubTool) => {
    const mainTool = SUB_TOOL_TO_MAIN[subTool];
    setActiveSubTools(prev => ({
      ...prev,
      [mainTool]: subTool
    }));
    setCurrentTool(subTool);
  }, []);

  // Voltar para ferramenta principal (remove sub-ferramenta ativa)
  const returnToMainTool = useCallback((mainTool: MainTool) => {
    setActiveSubTools(prev => ({
      ...prev,
      [mainTool]: null
    }));
    setCurrentTool(mainTool);
  }, []);

  // Verificar se é sub-ferramenta
  const isSubTool = (tool: ToolType): tool is SubTool => {
    return tool in SUB_TOOL_TO_MAIN;
  };

  // Obter ferramenta principal atual
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
