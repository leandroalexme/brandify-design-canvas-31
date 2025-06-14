
import { Mouse, Pen, Square, Text, Move, MessageCircle, Brush, Pencil } from 'lucide-react';
import { ToolType } from '../components/BrandifyStudio';

export const getActiveIcon = (baseToolId: string, selectedTool: ToolType) => {
  switch (baseToolId) {
    case 'select':
      // Show sub-tool icon when a select sub-tool is active
      if (selectedTool === 'move') return Move;
      if (selectedTool === 'comment') return MessageCircle;
      if (selectedTool === 'node') return Mouse;
      // Default to main select icon
      return Mouse;
    
    case 'pen':
      // Show sub-tool icon when a pen sub-tool is active
      if (selectedTool === 'vector-brush') return Brush;
      if (selectedTool === 'pencil') return Pencil;
      // Default to main pen icon
      return Pen;
    
    case 'shapes':
      return Square;
    
    case 'text':
      return Text;
    
    default:
      return Mouse;
  }
};

export const getToolGroupForSubTool = (selectedTool: ToolType): string => {
  const subToolMap: { [key: string]: string } = {
    'node': 'select',
    'move': 'select', 
    'comment': 'select',
    'vector-brush': 'pen',
    'pencil': 'pen',
  };
  
  return subToolMap[selectedTool] || selectedTool;
};

// Definir ferramentas principais e sub-ferramentas
export const MAIN_TOOLS: ToolType[] = ['select', 'pen', 'shapes', 'text'];
export const SUB_TOOLS: ToolType[] = ['node', 'move', 'comment', 'vector-brush', 'pencil'];

export const getMainToolForSubTool = (subTool: ToolType): ToolType => {
  const mainToolMap: { [key: string]: ToolType } = {
    'node': 'select',
    'move': 'select',
    'comment': 'select',
    'vector-brush': 'pen',
    'pencil': 'pen',
  };
  
  return mainToolMap[subTool] || 'select';
};

export const isSubTool = (tool: ToolType): boolean => {
  return SUB_TOOLS.includes(tool);
};

export const isMainTool = (tool: ToolType): boolean => {
  return MAIN_TOOLS.includes(tool);
};
