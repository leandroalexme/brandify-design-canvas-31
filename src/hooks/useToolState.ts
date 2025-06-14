
import { useState, useCallback, useEffect } from 'react';
import { ToolType, MainTool, SubTool } from '../types/tools';
import { SUB_TOOL_TO_MAIN, SUB_TOOLS } from '../utils/toolConfig';

export interface ToolState {
  currentTool: ToolType;
  activeSubTools: Record<MainTool, SubTool | null>;
  showSubmenu: string | null;
  submenuPosition: { x: number; y: number };
}

export const useToolState = (initialTool: ToolType = 'select') => {
  const [state, setState] = useState<ToolState>({
    currentTool: initialTool,
    activeSubTools: {
      select: null,
      pen: null,
      shapes: null,
      text: null
    },
    showSubmenu: null,
    submenuPosition: { x: 0, y: 0 }
  });

  // Função utilitária para verificar se é sub-ferramenta
  const isSubTool = useCallback((tool: ToolType): tool is SubTool => {
    return tool in SUB_TOOL_TO_MAIN;
  }, []);

  // Obter ferramenta principal atual
  const getCurrentMainTool = useCallback((): MainTool => {
    if (isSubTool(state.currentTool)) {
      return SUB_TOOL_TO_MAIN[state.currentTool];
    }
    return state.currentTool as MainTool;
  }, [state.currentTool, isSubTool]);

  // Selecionar ferramenta principal
  const selectMainTool = useCallback((tool: MainTool) => {
    setState(prev => {
      // Limpar sub-ferramentas de outras ferramentas principais
      const newActiveSubTools = { ...prev.activeSubTools };
      const currentMainTool = getCurrentMainTool();
      
      if (currentMainTool !== tool) {
        newActiveSubTools[currentMainTool] = null;
      }

      // Se há uma sub-ferramenta ativa para esta ferramenta, usar ela
      const activeSub = newActiveSubTools[tool];
      
      return {
        ...prev,
        currentTool: activeSub || tool,
        activeSubTools: newActiveSubTools,
        showSubmenu: null
      };
    });
  }, [getCurrentMainTool]);

  // Selecionar sub-ferramenta
  const selectSubTool = useCallback((subTool: SubTool) => {
    const mainTool = SUB_TOOL_TO_MAIN[subTool];
    setState(prev => ({
      ...prev,
      currentTool: subTool,
      activeSubTools: {
        ...prev.activeSubTools,
        [mainTool]: subTool
      },
      showSubmenu: null
    }));
  }, []);

  // Retornar para ferramenta principal
  const returnToMainTool = useCallback((mainTool: MainTool) => {
    setState(prev => ({
      ...prev,
      currentTool: mainTool,
      activeSubTools: {
        ...prev.activeSubTools,
        [mainTool]: null
      },
      showSubmenu: null
    }));
  }, []);

  // Mostrar/esconder submenu
  const toggleSubmenu = useCallback((toolId: string | null, position?: { x: number; y: number }) => {
    setState(prev => ({
      ...prev,
      showSubmenu: toolId,
      submenuPosition: position || prev.submenuPosition
    }));
  }, []);

  // Auto-retorno quando clica fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const isToolbarClick = target.closest('[data-toolbar]');
      const isSubmenuClick = target.closest('[data-submenu]');
      
      if (!isToolbarClick && !isSubmenuClick) {
        if (state.showSubmenu) {
          setState(prev => ({ ...prev, showSubmenu: null }));
        }
        
        if (isSubTool(state.currentTool)) {
          const mainTool = SUB_TOOL_TO_MAIN[state.currentTool];
          returnToMainTool(mainTool);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [state.currentTool, state.showSubmenu, isSubTool, returnToMainTool]);

  return {
    ...state,
    selectMainTool,
    selectSubTool,
    returnToMainTool,
    toggleSubmenu,
    isSubTool,
    getCurrentMainTool
  };
};
