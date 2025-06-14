
import { useEffect, useRef } from 'react';
import { ToolType } from '../components/BrandifyStudio';
import { isSubTool, getMainToolForSubTool } from '../utils/activeIcons';

export const useToolAutoReturn = (
  selectedTool: ToolType,
  onToolSelect: (tool: ToolType) => void,
  canvasRef?: React.RefObject<HTMLDivElement>
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Reset activity timestamp on user interaction
  const resetActivity = () => {
    lastActivityRef.current = Date.now();
    console.log('Activity reset for tool:', selectedTool);
  };

  // Handle click outside detection - DETECÇÃO MELHORADA
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSubTool(selectedTool)) {
        const target = event.target as Element;
        const isClickOnToolbar = target.closest('[data-toolbar]');
        const isClickOnCanvas = canvasRef?.current?.contains(target);
        const isClickOnSubmenu = target.closest('[data-submenu]');
        
        console.log('Click outside detected:', {
          selectedTool,
          isClickOnToolbar: !!isClickOnToolbar,
          isClickOnCanvas: !!isClickOnCanvas,
          isClickOnSubmenu: !!isClickOnSubmenu
        });
        
        // Se o clique foi fora do canvas, toolbar e submenus, voltar para ferramenta principal
        if (!isClickOnToolbar && !isClickOnCanvas && !isClickOnSubmenu) {
          const mainTool = getMainToolForSubTool(selectedTool);
          console.log('Returning to main tool due to outside click:', mainTool);
          onToolSelect(mainTool);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedTool, onToolSelect, canvasRef]);

  // Handle auto return after inactivity - TIMEOUT MELHORADO
  useEffect(() => {
    if (isSubTool(selectedTool)) {
      console.log('Setting auto-return timeout for sub-tool:', selectedTool);
      
      // Limpar timeout existente
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Definir novo timeout para auto-retorno
      timeoutRef.current = setTimeout(() => {
        const mainTool = getMainToolForSubTool(selectedTool);
        console.log('Auto-returning to main tool after timeout:', mainTool);
        onToolSelect(mainTool);
      }, 8000);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    } else {
      // Limpar timeout se não for sub-ferramenta
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [selectedTool, onToolSelect]);

  // Add event listeners for user activity - ATIVIDADE DETECTADA
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll'];
    
    events.forEach(event => {
      document.addEventListener(event, resetActivity);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetActivity);
      });
    };
  }, []);

  return { resetActivity };
};
