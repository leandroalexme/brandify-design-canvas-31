
import { FabricObject, Circle, Rect, Triangle, Ellipse, Line, Polygon } from 'fabric';
import { DesignElement } from '../types/design';

export type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'ellipse' | 'line' | 'polygon' | 'star';

export const createEnhancedShape = (
  shapeType: ShapeType,
  x: number,
  y: number,
  color: string,
  size: number = 100
): FabricObject | null => {
  const commonProps = {
    left: x - size / 2,
    top: y - size / 2,
    fill: color,
    stroke: color,
    strokeWidth: 2,
  };

  switch (shapeType) {
    case 'rectangle':
      return new Rect({
        ...commonProps,
        width: size,
        height: size * 0.7,
      });

    case 'circle':
      return new Circle({
        ...commonProps,
        radius: size / 2,
      });

    case 'triangle':
      return new Triangle({
        ...commonProps,
        width: size,
        height: size,
      });

    case 'ellipse':
      return new Ellipse({
        ...commonProps,
        rx: size / 2,
        ry: size / 3,
      });

    case 'line':
      return new Line([0, 0, size, 0], {
        left: x - size / 2,
        top: y,
        stroke: color,
        strokeWidth: 3,
        fill: '',
      });

    case 'polygon':
      const points = [
        { x: 0, y: -size / 2 },
        { x: size / 2, y: 0 },
        { x: size / 4, y: size / 2 },
        { x: -size / 4, y: size / 2 },
        { x: -size / 2, y: 0 },
      ];
      return new Polygon(points, {
        left: x - size / 2,
        top: y - size / 2,
        fill: color,
        stroke: color,
        strokeWidth: 2,
      });

    case 'star':
      const starPoints = [];
      const spikes = 5;
      const outerRadius = size / 2;
      const innerRadius = outerRadius * 0.4;
      
      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / spikes;
        starPoints.push({
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
        });
      }
      
      return new Polygon(starPoints, {
        left: x - size / 2,
        top: y - size / 2,
        fill: color,
        stroke: color,
        strokeWidth: 2,
      });

    default:
      return null;
  }
};

export const createDesignElementFromShape = (
  fabricObj: FabricObject,
  shapeType: ShapeType,
  color: string
): Omit<DesignElement, 'id' | 'selected'> => {
  return {
    type: 'shape',
    x: fabricObj.left || 0,
    y: fabricObj.top || 0,
    width: fabricObj.width || 100,
    height: fabricObj.height || 100,
    color: color,
    rotation: fabricObj.angle || 0,
    visible: true,
    locked: false,
    opacity: fabricObj.opacity || 1,
    zIndex: 0,
  };
};
