
import { MousePointer, PenTool, Square, Type, Move, MessageCircle, Brush, Pencil } from 'lucide-react';
import { ToolType } from '../components/BrandifyStudio';

export const getActiveIcon = (baseToolId: string, selectedTool: ToolType) => {
  switch (baseToolId) {
    case 'select':
      // Show sub-tool icon when a select sub-tool is active
      if (selectedTool === 'move') return Move;
      if (selectedTool === 'comment') return MessageCircle;
      if (selectedTool === 'node') return MousePointer;
      // Default to main select icon
      return MousePointer;
    
    case 'pen':
      // Show sub-tool icon when a pen sub-tool is active
      if (selectedTool === 'vector-brush') return Brush;
      if (selectedTool === 'pencil') return Pencil;
      // Default to main pen icon
      return PenTool;
    
    case 'shapes':
      return Square;
    
    case 'text':
      return Type;
    
    default:
      return MousePointer;
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
