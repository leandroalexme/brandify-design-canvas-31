
import { MousePointer, PenTool, Square, Type, Move, MessageCircle, Brush, Pencil } from 'lucide-react';
import { ToolType } from '../components/BrandifyStudio';

export const getToolIcon = (baseToolId: string, selectedTool: ToolType) => {
  switch (baseToolId) {
    case 'select':
      if (selectedTool === 'move') return Move;
      if (selectedTool === 'comment') return MessageCircle;
      if (selectedTool === 'node') return MousePointer;
      return MousePointer;
    case 'pen':
      if (selectedTool === 'vector-brush') return Brush;
      if (selectedTool === 'pencil') return Pencil;
      return PenTool;
    case 'shapes':
      return Square;
    case 'text':
      return Type;
    default:
      return MousePointer;
  }
};

export const getActiveToolGroup = (toolId: string, selectedTool: ToolType): boolean => {
  const subToolMap: { [key: string]: string } = {
    'node': 'select',
    'move': 'select', 
    'comment': 'select',
    'vector-brush': 'pen',
    'pencil': 'pen',
  };
  
  return subToolMap[selectedTool] === toolId || selectedTool === toolId;
};
