
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

// Estados de interface
export interface UIState {
  showLayersPanel: boolean;
  showAlignmentPanel: boolean;
  showArtboardsPanel: boolean;
  showTextPropertiesPanel: boolean;
  selectedShape: string | null;
  textCreated: boolean; // Flag para controlar criação de texto
}

// Estado de ferramentas
export interface ToolState {
  selectedTool: ToolType;
  selectedColor: string;
  zoom: number;
}
