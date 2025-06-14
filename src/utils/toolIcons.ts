
import { ToolType } from '../components/BrandifyStudio';
import { getActiveIcon, getToolGroupForSubTool } from './activeIcons';

// Export the main function from activeIcons for backward compatibility
export const getToolIcon = getActiveIcon;

export const getActiveToolGroup = (toolId: string, selectedTool: ToolType): boolean => {
  const toolGroup = getToolGroupForSubTool(selectedTool);
  return toolGroup === toolId || selectedTool === toolId;
};
