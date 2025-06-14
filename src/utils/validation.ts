import { ToolType, MainTool, SubTool } from '../types/tools';
import { DesignElement } from '../types/design';

// Validação de tipos de ferramenta
export const isMainTool = (tool: string): tool is MainTool => {
  return ['select', 'pen', 'shapes', 'text'].includes(tool);
};

export const isSubTool = (tool: string): tool is SubTool => {
  return ['node', 'move', 'comment', 'brush', 'pencil'].includes(tool);
};

export const isValidTool = (tool: string): tool is ToolType => {
  return isMainTool(tool) || isSubTool(tool);
};

// Validação de elementos de design
export const isValidDesignElement = (element: any): element is DesignElement => {
  return (
    element &&
    typeof element.id === 'string' &&
    typeof element.type === 'string' &&
    ['text', 'shape', 'drawing'].includes(element.type) &&
    typeof element.x === 'number' &&
    typeof element.y === 'number' &&
    typeof element.color === 'string' &&
    typeof element.selected === 'boolean'
  );
};

// Validação de posição
export const isValidPosition = (position: any): position is { x: number; y: number } => {
  return (
    position &&
    typeof position.x === 'number' &&
    typeof position.y === 'number' &&
    !isNaN(position.x) &&
    !isNaN(position.y)
  );
};

// Logger para debugging
export const logger = {
  error: (message: string, data?: any) => {
    console.error(`[Brandify Studio Error]: ${message}`, data);
  },
  warn: (message: string, data?: any) => {
    console.warn(`[Brandify Studio Warning]: ${message}`, data);
  },
  info: (message: string, data?: any) => {
    console.log(`[Brandify Studio Info]: ${message}`, data);
  },
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[Brandify Studio Debug]: ${message}`, data);
    }
  }
};
