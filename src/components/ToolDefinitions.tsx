
import { Square, Type } from 'lucide-react';
import { TOOL_ICONS } from '../utils/toolConfig';
import { ToolType } from '../types/tools';

export interface ToolDefinition {
  id: string;
  icon: any;
  label: string;
  hasSubmenu: boolean;
}

export const getToolDefinitions = (selectedTool: ToolType): ToolDefinition[] => {
  console.log('getToolDefinitions called with selectedTool:', selectedTool);
  
  const definitions = [
    { 
      id: 'select', 
      icon: TOOL_ICONS.select, 
      label: 'Selecionar', 
      hasSubmenu: true 
    },
    { 
      id: 'pen', 
      icon: TOOL_ICONS.pen, 
      label: 'Caneta', 
      hasSubmenu: true 
    },
    { 
      id: 'shapes', 
      icon: TOOL_ICONS.shapes, 
      label: 'Formas', 
      hasSubmenu: false 
    },
    { 
      id: 'text', 
      icon: TOOL_ICONS.text, 
      label: 'Texto', 
      hasSubmenu: false 
    },
  ];
  
  return definitions;
};
