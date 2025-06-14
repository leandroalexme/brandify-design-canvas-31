
import { Square, Type } from 'lucide-react';
import { getToolIcon } from '../utils/toolIcons';
import { ToolType } from './BrandifyStudio';

export interface ToolDefinition {
  id: string;
  icon: any;
  label: string;
  hasSubmenu: boolean;
}

export const getToolDefinitions = (selectedTool: ToolType): ToolDefinition[] => [
  { id: 'select', icon: getToolIcon('select', selectedTool), label: 'Selecionar', hasSubmenu: true },
  { id: 'pen', icon: getToolIcon('pen', selectedTool), label: 'Caneta', hasSubmenu: true },
  { id: 'shapes', icon: Square, label: 'Formas', hasSubmenu: true },
  { id: 'text', icon: Type, label: 'Texto', hasSubmenu: false },
];
