
import { FabricObject, IText, Circle } from 'fabric';
import { DesignElement } from '../types/design';

export const createDesignElement = (
  fabricObj: FabricObject, 
  type: DesignElement['type'],
  fallbackColor: string
): Omit<DesignElement, 'id' | 'selected'> => {
  // Helper function to ensure color is always a string
  const getColorAsString = (fill: any): string => {
    if (typeof fill === 'string') {
      return fill;
    }
    // For non-string fills (gradients, patterns, etc.), return the fallback color
    return fallbackColor;
  };

  const commonProps = {
    x: fabricObj.left || 0,
    y: fabricObj.top || 0,
    color: getColorAsString(fabricObj.fill),
    rotation: fabricObj.angle || 0,
  };

  switch (type) {
    case 'shape':
      return {
        ...commonProps,
        type: 'shape',
        width: fabricObj.width || 100,
        height: fabricObj.height || 100,
      };

    case 'text':
      const textObj = fabricObj as IText;
      return {
        ...commonProps,
        type: 'text',
        content: textObj.text || 'Texto',
        fontSize: textObj.fontSize || 24,
        fontFamily: textObj.fontFamily || 'Inter',
        fontWeight: (textObj.fontWeight as string) || 'normal',
      };

    case 'drawing':
      const circleObj = fabricObj as Circle;
      return {
        ...commonProps,
        type: 'drawing',
        width: (circleObj.radius || 2) * 2,
        height: (circleObj.radius || 2) * 2,
      };

    default:
      return commonProps as any;
  }
};
