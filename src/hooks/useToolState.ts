
import { useState, useEffect, useCallback } from 'react';
import { ToolType } from '../components/BrandifyStudio';
import { getMainToolForSubTool, isSubTool } from '../utils/toolSystem';

export const useToolState = (initialTool: ToolType = 'select') => {
  const [selectedTool, setSelectedTool] = useState<ToolType>(initialTool);
  const [autoReturnTimeout, setAutoReturnTimeout] = useState<NodeJS.Timeout | null>(null);

  const selectTool = useCallback((tool: ToolType) => {
    console.log('Tool selected:', tool);
    setSelectedTool(tool);
    
    // Limpar timeout anterior
    if (autoReturnTimeout) {
      clearTimeout(autoReturnTimeout);
      setAutoReturnTimeout(null);
    }

    // Se for sub-ferramenta, configurar auto-retorno
    if (isSubTool(tool)) {
      const timeout = setTimeout(() => {
        const mainTool = getMainToolForSubTool(tool);
        console.log('Auto-returning to main tool:', mainTool);
        setSelectedTool(mainTool);
      }, 5000);
      setAutoReturnTimeout(timeout);
    }
  }, [autoReturnTimeout]);

  const returnToMainTool = useCallback(() => {
    if (isSubTool(selectedTool)) {
      const mainTool = getMainToolForSubTool(selectedTool);
      console.log('Returning to main tool:', mainTool);
      setSelectedTool(mainTool);
    }
  }, [selectedTool]);

  // Limpar timeout ao desmontar
  useEffect(() => {
    return () => {
      if (autoReturnTimeout) {
        clearTimeout(autoReturnTimeout);
      }
    };
  }, [autoReturnTimeout]);

  return {
    selectedTool,
    selectTool,
    returnToMainTool,
  };
};
