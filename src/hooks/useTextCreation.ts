
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
      console.log('📝 createTextElement called with:', { x, y, toolState });
      
      if (toolState.selectedTool !== 'text') {
        console.warn('⚠️ Text creation attempted with wrong tool:', toolState.selectedTool);
        return;
      }

      if (!isValidPosition({ x, y })) {
        console.error('❌ Invalid position for text element:', { x, y });
        return;
      }
      
      // Garantir que a cor seja visível (não igual ao fundo branco)
      const textColor = toolState.selectedColor === '#ffffff' ? '#000000' : toolState.selectedColor;
      
      const newTextElement: Omit<DesignElement, 'id' | 'selected'> = {
        type: 'text',
        x,
        y,
        content: 'Digite seu texto',
        color: textColor,
        fontSize: 24,
        fontFamily: 'Inter',
        fontWeight: 'normal'
      };
      
      console.log('✅ Adding text element:', newTextElement);
      addElement(newTextElement);
      
      console.log('🎯 Text element created successfully');
      logger.info('Text element created successfully', { x, y, color: textColor });
      
    } catch (error) {
      console.error('❌ Error creating text element:', error);
      logger.error('Error creating text element', error);
    }
  }, [toolState.selectedTool, toolState.selectedColor, addElement]);

  return { createTextElement };
};
