
import { useEffect, useRef } from 'react';
import { ToolType } from '../components/BrandifyStudio';
import { isSubTool, getMainToolForSubTool } from '../utils/activeIcons';

const AUTO_RETURN_DELAY = 8000; // 8 segundos de inatividade

export const useAutoReturn = (selectedTool: ToolType, onToolSelect: (tool: ToolType) => void) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const resetActivity = () => {
    lastActivityRef.current = Date.now();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const startAutoReturnTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (isSubTool(selectedTool)) {
        const mainTool = getMainToolForSubTool(selectedTool);
        console.log(`Auto-returning from ${selectedTool} to ${mainTool}`);
        onToolSelect(mainTool);
      }
    }, AUTO_RETURN_DELAY);
  };

  useEffect(() => {
    // Só ativar auto-retorno para sub-ferramentas
    if (isSubTool(selectedTool)) {
      startAutoReturnTimer();

      // Detectar atividade do usuário para resetar o timer
      const handleActivity = () => {
        resetActivity();
        startAutoReturnTimer();
      };

      // Eventos que indicam atividade do usuário
      const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
      
      events.forEach(event => {
        document.addEventListener(event, handleActivity, { passive: true });
      });

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        events.forEach(event => {
          document.removeEventListener(event, handleActivity);
        });
      };
    } else {
      // Limpar timer se não for sub-ferramenta
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [selectedTool, onToolSelect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
};
