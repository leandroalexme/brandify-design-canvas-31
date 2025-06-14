
import { MousePointer, PenTool, Square, Type, Move, MessageCircle, Brush, Pencil } from 'lucide-react';
import { ToolType } from '../components/BrandifyStudio';

export const getActiveIcon = (baseToolId: string, selectedTool: ToolType) => {
  console.log('getActiveIcon called:', { baseToolId, selectedTool });
  
  switch (baseToolId) {
    case 'select':
      // Mostrar ícone da sub-ferramenta quando uma sub-ferramenta de seleção estiver ativa
      if (selectedTool === 'move') {
        console.log('Returning Move icon for select tool');
        return Move;
      }
      if (selectedTool === 'comment') {
        console.log('Returning MessageCircle icon for select tool');
        return MessageCircle;
      }
      if (selectedTool === 'node') {
        console.log('Returning MousePointer icon for node tool');
        return MousePointer;
      }
      // Padrão para ícone principal de seleção
      console.log('Returning default MousePointer icon for select tool');
      return MousePointer;
    
    case 'pen':
      // Mostrar ícone da sub-ferramenta quando uma sub-ferramenta de caneta estiver ativa
      if (selectedTool === 'vector-brush') {
        console.log('Returning Brush icon for pen tool');
        return Brush;
      }
      if (selectedTool === 'pencil') {
        console.log('Returning Pencil icon for pen tool');
        return Pencil;
      }
      // Padrão para ícone principal de caneta
      console.log('Returning default PenTool icon for pen tool');
      return PenTool;
    
    case 'shapes':
      console.log('Returning Square icon for shapes tool');
      return Square;
    
    case 'text':
      console.log('Returning Type icon for text tool');
      return Type;
    
    default:
      console.log('Returning default MousePointer icon for unknown tool');
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
  
  const result = subToolMap[selectedTool] || selectedTool;
  console.log('getToolGroupForSubTool:', { selectedTool, result });
  return result;
};

export const isSubTool = (tool: ToolType): boolean => {
  const subTools = ['node', 'move', 'comment', 'vector-brush', 'pencil'];
  const result = subTools.includes(tool);
  console.log('isSubTool:', { tool, result });
  return result;
};

export const getMainToolForSubTool = (subTool: ToolType): ToolType => {
  const subToolToMainTool: { [key: string]: ToolType } = {
    'node': 'select',
    'move': 'select',
    'comment': 'select',
    'vector-brush': 'pen',
    'pencil': 'pen',
  };
  
  const result = subToolToMainTool[subTool] || subTool;
  console.log('getMainToolForSubTool:', { subTool, result });
  return result;
};
