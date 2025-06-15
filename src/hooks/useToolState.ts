
import { useState, useCallback, useEffect, useMemo } from 'react';
import { ToolType, MainTool, SubTool } from '../types/tools';
import { SUB_TOOL_TO_MAIN } from '../utils/toolConfig';
import { logger } from '../utils/validation';

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

  // Memoizar função utilitária
  const isSubTool = useMemo(() => {
    return (tool: ToolType): tool is SubTool => {
      return tool in SUB_TOOL_TO_MAIN;
    };
  }, []);

  // Memoizar getCurrentMainTool
  const getCurrentMainTool = useCallback((): MainTool => {
    if (isSubTool(state.currentTool)) {
      return SUB_TOOL_TO_MAIN[state.currentTool];
    }
    return state.currentTool as MainTool;
  }, [state.currentTool, isSubTool]);

  // Selecionar ferramenta principal
  const selectMainTool = useCallback((tool: MainTool) => {
    logger.debug('Selecting main tool', { tool });
    
    setState(prev => {
      // Evitar re-render desnecessário se já é a ferramenta atual
      if (prev.currentTool === tool && !prev.activeSubTools[tool]) {
        logger.debug('Tool already selected, skipping update', { tool });
        return prev;
      }

      // Limpar TODAS as sub-ferramentas ativas quando selecionar uma nova ferramenta principal
      const newActiveSubTools: Record<MainTool, SubTool | null> = {
        select: null,
        pen: null,
        shapes: null,
        text: null
      };

      // Se há uma sub-ferramenta ativa para esta ferramenta específica, usar ela
      const activeSub = prev.activeSubTools[tool];
      
      return {
        ...prev,
        currentTool: activeSub || tool,
        activeSubTools: newActiveSubTools,
        showSubmenu: null
      };
    });
  }, []);

  // Selecionar sub-ferramenta
  const selectSubTool = useCallback((subTool: SubTool) => {
    logger.debug('Selecting sub-tool', { subTool });
    
    const mainTool = SUB_TOOL_TO_MAIN[subTool];
    setState(prev => {
      // Evitar re-render desnecessário
      if (prev.currentTool === subTool && prev.activeSubTools[mainTool] === subTool) {
        logger.debug('Sub-tool already selected, skipping update', { subTool });
        return prev;
      }

      // Limpar TODAS as outras sub-ferramentas ativas
      const newActiveSubTools: Record<MainTool, SubTool | null> = {
        select: null,
        pen: null,
        shapes: null,
        text: null
      };
      
      // Ativar apenas a sub-ferramenta selecionada
      newActiveSubTools[mainTool] = subTool;

      return {
        ...prev,
        currentTool: subTool,
        activeSubTools: newActiveSubTools,
        showSubmenu: null
      };
    });
  }, []);

  // Retornar para ferramenta principal
  const returnToMainTool = useCallback((mainTool: MainTool) => {
    logger.debug('Returning to main tool', { mainTool });
    
    setState(prev => {
      // Evitar re-render desnecessário
      if (prev.currentTool === mainTool && !prev.activeSubTools[mainTool]) {
        logger.debug('Already on main tool, skipping update', { mainTool });
        return prev;
      }

      // Limpar TODAS as sub-ferramentas ativas
      const newActiveSubTools: Record<MainTool, SubTool | null> = {
        select: null,
        pen: null,
        shapes: null,
        text: null
      };

      return {
        ...prev,
        currentTool: mainTool,
        activeSubTools: newActiveSubTools,
        showSubmenu: null
      };
    });
  }, []);

  // Mostrar/esconder submenu
  const toggleSubmenu = useCallback((toolId: string | null, position?: { x: number; y: number }) => {
    logger.debug('Toggling submenu', { toolId, position });
    
    setState(prev => ({
      ...prev,
      showSubmenu: toolId,
      submenuPosition: position || prev.submenuPosition
    }));
  }, []);

  // Auto-retorno quando clica fora - otimizado
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const isToolbarClick = target.closest('[data-toolbar]');
      const isSubmenuClick = target.closest('[data-submenu]');
      
      if (!isToolbarClick && !isSubmenuClick) {
        if (state.showSubmenu) {
          logger.debug('Clicking outside submenu, closing');
          setState(prev => ({ ...prev, showSubmenu: null }));
        }
        
        if (isSubTool(state.currentTool)) {
          const mainTool = SUB_TOOL_TO_MAIN[state.currentTool];
          logger.debug('Clicking outside, returning to main tool', { mainTool });
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
