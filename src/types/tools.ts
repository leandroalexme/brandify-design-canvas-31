
export type MainTool = 'select' | 'pen' | 'shapes' | 'text';
export type SubTool = 'node' | 'move' | 'comment' | 'brush' | 'pencil';
export type ToolType = MainTool | SubTool;

export interface ToolDefinition {
  id: string;
  icon: any;
  label: string;
  hasSubmenu: boolean;
  subTools?: SubTool[];
}
