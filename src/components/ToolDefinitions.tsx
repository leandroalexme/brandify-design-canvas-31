
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
  
  // Sempre recalcular os ícones para garantir que reflitam o estado atual
  const definitions = [
    { 
      id: 'select', 
      icon: getActiveIcon('select', selectedTool), 
      label: 'Selecionar', 
      hasSubmenu: true 
    },
    { 
      id: 'pen', 
      icon: getActiveIcon('pen', selectedTool), 
      label: 'Caneta', 
      hasSubmenu: true 
    },
    { 
      id: 'shapes', 
      icon: getActiveIcon('shapes', selectedTool), 
      label: 'Formas', 
      hasSubmenu: true 
    },
    { 
      id: 'text', 
      icon: getActiveIcon('text', selectedTool), 
      label: 'Texto', 
      hasSubmenu: false 
    },
  ];
  
  console.log('Tool definitions generated with icons:', definitions.map(d => ({ 
    id: d.id, 
    iconName: d.icon.name || d.icon.displayName 
  })));
  
  return definitions;
};
