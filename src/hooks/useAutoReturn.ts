
import { useEffect } from 'react';
import { ToolType } from '../components/BrandifyStudio';

export const useAutoReturn = (selectedTool: ToolType, onToolSelect: (tool: ToolType) => void) => {
  useEffect(() => {
    const handleAutoReturn = () => {
      const subTools = ['node', 'move', 'comment', 'vector-brush', 'pencil'];
      
      if (subTools.includes(selectedTool)) {
        const handleOutsideActivity = () => {
          if (['node', 'move', 'comment'].includes(selectedTool)) {
            onToolSelect('select');
          } else if (['vector-brush', 'pencil'].includes(selectedTool)) {
            onToolSelect('pen');
          }
        };

        const inactivityTimer = setTimeout(handleOutsideActivity, 8000);
        return () => clearTimeout(inactivityTimer);
      }
    };

    return handleAutoReturn();
  }, [selectedTool, onToolSelect]);
};
