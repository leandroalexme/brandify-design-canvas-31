
import Konva from 'konva';
import { DesignElement } from '../types/design';

export type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'ellipse' | 'line' | 'polygon' | 'star';

export const createKonvaShape = (
  shapeType: ShapeType,
  x: number,
  y: number,
  color: string,
  size: number = 100
): Konva.Shape | null => {
  const commonProps = {
    x: x,
    y: y,
    fill: color,
    stroke: color,
    strokeWidth: 2,
    draggable: true,
  };

  switch (shapeType) {
    case 'rectangle':
      return new Konva.Rect({
        ...commonProps,
        x: x - size / 2,
        y: y - size / 2,
        width: size,
        height: size * 0.7,
      });

    case 'circle':
      return new Konva.Circle({
        ...commonProps,
        radius: size / 2,
      });

    case 'triangle':
      return new Konva.RegularPolygon({
        ...commonProps,
        sides: 3,
        radius: size / 2,
      });

    case 'ellipse':
      return new Konva.Ellipse({
        ...commonProps,
        radiusX: size / 2,
        radiusY: size / 3,
      });

    case 'line':
      return new Konva.Line({
        x: x - size / 2,
        y: y,
        points: [0, 0, size, 0],
        stroke: color,
        strokeWidth: 3,
        draggable: true,
      });

    case 'polygon':
      return new Konva.RegularPolygon({
        ...commonProps,
        sides: 5,
        radius: size / 2,
      });

    case 'star':
      return new Konva.Star({
        ...commonProps,
        numPoints: 5,
        innerRadius: size / 4,
        outerRadius: size / 2,
      });

    default:
      return null;
  }
};

export const createDesignElementFromKonvaShape = (
  konvaShape: Konva.Shape,
  shapeType: ShapeType,
  color: string
): Omit<DesignElement, 'id' | 'selected'> => {
  return {
    type: 'shape',
    x: konvaShape.x(),
    y: konvaShape.y(),
    width: konvaShape.width() || 100,
    height: konvaShape.height() || 100,
    color: color,
    rotation: konvaShape.rotation() || 0,
    visible: konvaShape.visible(),
    locked: false,
    opacity: konvaShape.opacity() || 1,
    zIndex: konvaShape.zIndex() || 0,
  };
};
