
import { Square, Type } from 'lucide-react';
import { getActiveIcon } from '../utils/activeIcons';
import { ToolType } from './BrandifyStudio';

export interface ToolDefinition {
  id: string;
  icon: any;
  label: string;
  hasSubmenu: boolean;
}

export const getToolDefinitions = (selectedTool: ToolType): ToolDefinition[] => {
  console.log('getToolDefinitions called with selectedTool:', selectedTool);
  
  const definitions = [
    { id: 'select', icon: getActiveIcon('select', selectedTool), label: 'Selecionar', hasSubmenu: true },
    { id: 'pen', icon: getActiveIcon('pen', selectedTool), label: 'Caneta', hasSubmenu: true },
    { id: 'shapes', icon: Square, label: 'Formas', hasSubmenu: true },
    { id: 'text', icon: Type, label: 'Texto', hasSubmenu: false },
  ];
  
  console.log('Tool definitions generated:', definitions);
  return definitions;
};
