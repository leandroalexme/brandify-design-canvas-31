
import React, { useState } from 'react';
import { DesignElement } from './BrandifyStudio';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, X } from 'lucide-react';

interface FloatingPropertiesPanelProps {
  selectedElement: DesignElement | null;
  onUpdateElement: (id: string, updates: Partial<DesignElement>) => void;
  onDeleteElement: (id: string) => void;
  onClose: () => void;
}

export const FloatingPropertiesPanel = ({ 
  selectedElement, 
  onUpdateElement, 
  onDeleteElement,
  onClose
}: FloatingPropertiesPanelProps) => {
  const [position, setPosition] = useState({ x: window.innerWidth - 350, y: 120 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  if (!selectedElement) return null;

  const fonts = [
    'Roboto', 'Inter', 'Poppins', 'Montserrat', 'Open Sans',
    'Lato', 'Nunito', 'Source Sans Pro', 'Raleway', 'Ubuntu'
  ];

  const fontWeights = [
    { value: 'normal', label: 'Regular' },
    { value: 'bold', label: 'Bold' },
    { value: '300', label: 'Light' },
    { value: '600', label: 'Semi Bold' },
    { value: '800', label: 'Extra Bold' },
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.drag-handle')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  return (
    <div
      className="fixed z-50 floating-module w-80 max-h-96 overflow-y-auto animate-fade-in"
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <div className="drag-handle flex items-center justify-between p-4 border-b border-slate-700/50 cursor-move">
        <h2 className="text-lg font-semibold text-slate-200">Properties</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl"
            onClick={() => onDeleteElement(selectedElement.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-slate-300 hover:bg-slate-700 rounded-xl"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {selectedElement.type === 'text' && (
          <>
            <div className="space-y-2">
              <Label className="text-slate-300">Content</Label>
              <textarea
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-xl text-slate-200 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                value={selectedElement.content || ''}
                onChange={(e) => onUpdateElement(selectedElement.id, { content: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Font Family</Label>
              <Select
                value={selectedElement.fontFamily}
                onValueChange={(value) => onUpdateElement(selectedElement.id, { fontFamily: value })}
              >
                <SelectTrigger className="rounded-xl bg-slate-700 border-slate-600 text-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fonts.map((font) => (
                    <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-slate-300">Size</Label>
                <Input
                  type="number"
                  min="8"
                  max="200"
                  value={selectedElement.fontSize}
                  onChange={(e) => onUpdateElement(selectedElement.id, { fontSize: parseInt(e.target.value) })}
                  className="rounded-xl bg-slate-700 border-slate-600 text-slate-200"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Weight</Label>
                <Select
                  value={selectedElement.fontWeight}
                  onValueChange={(value) => onUpdateElement(selectedElement.id, { fontWeight: value })}
                >
                  <SelectTrigger className="rounded-xl bg-slate-700 border-slate-600 text-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontWeights.map((weight) => (
                      <SelectItem key={weight.value} value={weight.value}>
                        {weight.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label className="text-slate-300">Color</Label>
          <div className="flex items-center space-x-3">
            <div
              className="w-12 h-12 rounded-xl border-4 border-slate-600 shadow-lg"
              style={{ backgroundColor: selectedElement.color }}
            />
            <Input
              value={selectedElement.color}
              onChange={(e) => onUpdateElement(selectedElement.id, { color: e.target.value })}
              className="rounded-xl bg-slate-700 border-slate-600 text-slate-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-slate-300">X Position</Label>
            <Input
              type="number"
              value={Math.round(selectedElement.x)}
              onChange={(e) => onUpdateElement(selectedElement.id, { x: parseInt(e.target.value) })}
              className="rounded-xl bg-slate-700 border-slate-600 text-slate-200"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-slate-300">Y Position</Label>
            <Input
              type="number"
              value={Math.round(selectedElement.y)}
              onChange={(e) => onUpdateElement(selectedElement.id, { y: parseInt(e.target.value) })}
              className="rounded-xl bg-slate-700 border-slate-600 text-slate-200"
            />
          </div>
        </div>

        {selectedElement.type === 'shape' && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-slate-300">Width</Label>
              <Input
                type="number"
                min="10"
                value={selectedElement.width}
                onChange={(e) => onUpdateElement(selectedElement.id, { width: parseInt(e.target.value) })}
                className="rounded-xl bg-slate-700 border-slate-600 text-slate-200"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-300">Height</Label>
              <Input
                type="number"
                min="10"
                value={selectedElement.height}
                onChange={(e) => onUpdateElement(selectedElement.id, { height: parseInt(e.target.value) })}
                className="rounded-xl bg-slate-700 border-slate-600 text-slate-200"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-slate-300">Rotation</Label>
          <Input
            type="number"
            min="-180"
            max="180"
            value={selectedElement.rotation || 0}
            onChange={(e) => onUpdateElement(selectedElement.id, { rotation: parseInt(e.target.value) })}
            className="rounded-xl bg-slate-700 border-slate-600 text-slate-200"
          />
        </div>
      </div>
    </div>
  );
};
