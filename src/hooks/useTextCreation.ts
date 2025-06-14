
import { useCallback } from 'react';
import { ToolType } from '../types/tools';
import { DesignElement } from '../types/design';

interface UseTextCreationProps {
  selectedTool: ToolType;
  selectedColor: string;
  addElement: (element: Omit<DesignElement, 'id' | 'selected'>) => void;
}

export const useTextCreation = ({ selectedTool, selectedColor, addElement }: UseTextCreationProps) => {
  const createTextElement = useCallback((x: number, y: number) => {
    console.log('🚀 [TEXT CREATION] Starting text creation at:', { x, y });
    console.log('🚀 [TEXT CREATION] Current tool:', selectedTool);
    console.log('🚀 [TEXT CREATION] Selected color:', selectedColor);
    
    // Validação básica
    if (selectedTool !== 'text') {
      console.warn('⚠️ [TEXT CREATION] Wrong tool selected:', selectedTool);
      return;
    }

    if (typeof x !== 'number' || typeof y !== 'number' || x < 0 || y < 0) {
      console.error('❌ [TEXT CREATION] Invalid coordinates:', { x, y });
      return;
    }

    // Garantir que a cor seja válida e visível
    const textColor = selectedColor && selectedColor !== '#ffffff' ? selectedColor : '#000000';
    
    const newTextElement: Omit<DesignElement, 'id' | 'selected'> = {
      type: 'text',
      x: Math.round(x),
      y: Math.round(y),
      content: 'Digite seu texto aqui',
      color: textColor,
      fontSize: 24,
      fontFamily: 'Inter',
      fontWeight: 'normal'
    };
    
    console.log('✅ [TEXT CREATION] Creating element:', newTextElement);
    
    try {
      addElement(newTextElement);
      console.log('🎉 [TEXT CREATION] Text element created successfully!');
    } catch (error) {
      console.error('❌ [TEXT CREATION] Error adding element:', error);
    }
  }, [selectedTool, selectedColor, addElement]);

  return { createTextElement };
};
