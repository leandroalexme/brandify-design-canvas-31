
import { useEffect, useRef } from 'react';
import { ToolType } from '../components/BrandifyStudio';
import { isSubTool, getMainToolForSubTool } from '../utils/activeIcons';

export const useToolAutoReturn = (
  selectedTool: ToolType,
  onToolSelect: (tool: ToolType) => void,
  canvasRef?: React.RefObject<HTMLElement>
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Reset activity timestamp on user interaction
  const resetActivity = () => {
    lastActivityRef.current = Date.now();
  };

  // Handle click outside detection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If current tool is a sub-tool and user clicks outside canvas/toolbar area
      if (isSubTool(selectedTool)) {
        const target = event.target as Element;
        const isClickOnToolbar = target.closest('[data-toolbar]');
        const isClickOnCanvas = canvasRef?.current?.contains(target);
        const isClickOnSubmenu = target.closest('[data-submenu]');
        
        // If click is outside canvas, toolbar, and submenus, return to main tool
        if (!isClickOnToolbar && !isClickOnCanvas && !isClickOnSubmenu) {
          const mainTool = getMainToolForSubTool(selectedTool);
          onToolSelect(mainTool);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedTool, onToolSelect, canvasRef]);

  // Handle auto return after inactivity
  useEffect(() => {
    if (isSubTool(selectedTool)) {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout for auto return
      timeoutRef.current = setTimeout(() => {
        const mainTool = getMainToolForSubTool(selectedTool);
        onToolSelect(mainTool);
      }, 8000);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [selectedTool, onToolSelect]);

  // Add event listeners for user activity
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
