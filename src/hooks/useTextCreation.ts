
import { useCallback } from 'react';
import { ToolType } from '../types/tools';
import { DesignElement } from '../types/design';
import { isValidPosition, logger } from '../utils/validation';

interface UseTextCreationProps {
  toolState: {
    selectedTool: ToolType;
    selectedColor: string;
  };
  addElement: (element: Omit<DesignElement, 'id' | 'selected'>) => void;
  updateUIState: (updates: any) => void;
}

export const useTextCreation = ({ toolState, addElement, updateUIState }: UseTextCreationProps) => {
  const createTextElement = useCallback((x: number, y: number) => {
    try {
      if (toolState.selectedTool !== 'text') {
        logger.warn('Text creation attempted with wrong tool', toolState.selectedTool);
        return;
      }

      if (!isValidPosition({ x, y })) {
        logger.error('Invalid position for text element', { x, y });
        return;
      }
      
      const newTextElement: Omit<DesignElement, 'id' | 'selected'> = {
        type: 'text',
        x,
        y,
        content: 'Digite seu texto',
        color: toolState.selectedColor,
        fontSize: 24,
        fontFamily: 'Inter',
        fontWeight: 'normal'
      };
      
      addElement(newTextElement);
      updateUIState({ showTextPropertiesPanel: true, textCreated: true });
      logger.info('Text element created', { x, y });
    } catch (error) {
      logger.error('Error creating text element', error);
    }
  }, [toolState.selectedTool, toolState.selectedColor, addElement, updateUIState]);

  return { createTextElement };
};
