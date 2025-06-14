
import React from 'react';
import { DesignElement } from './BrandifyStudio';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Bold, Italic, Underline } from 'lucide-react';

interface PropertiesPanelProps {
  selectedElement: DesignElement | null;
  onUpdateElement: (id: string, updates: Partial<DesignElement>) => void;
  onDeleteElement: (id: string) => void;
}

export const PropertiesPanel = ({ 
  selectedElement, 
  onUpdateElement, 
  onDeleteElement 
}: PropertiesPanelProps) => {
  if (!selectedElement) {
    return (
      <div className="w-80 bg-white/90 backdrop-blur-md border-l border-slate-200/50 p-6">
        <div className="text-center text-slate-500 mt-20">
          <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">🎨</span>
          </div>
          <h3 className="font-medium mb-2">No element selected</h3>
          <p className="text-sm">Select an element to edit its properties</p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="w-80 bg-white/90 backdrop-blur-md border-l border-slate-200/50 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Properties</h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => onDeleteElement(selectedElement.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-6">
        {selectedElement.type === 'text' && (
          <>
            <div className="space-y-2">
              <Label>Content</Label>
              <textarea
                className="w-full p-3 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                value={selectedElement.content || ''}
                onChange={(e) => onUpdateElement(selectedElement.id, { content: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Font Family</Label>
              <Select
                value={selectedElement.fontFamily}
                onValueChange={(value) => onUpdateElement(selectedElement.id, { fontFamily: value })}
              >
                <SelectTrigger className="rounded-xl">
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
                <Label>Size</Label>
                <Input
                  type="number"
                  min="8"
                  max="200"
                  value={selectedElement.fontSize}
                  onChange={(e) => onUpdateElement(selectedElement.id, { fontSize: parseInt(e.target.value) })}
                  className="rounded-xl"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Weight</Label>
                <Select
                  value={selectedElement.fontWeight}
                  onValueChange={(value) => onUpdateElement(selectedElement.id, { fontWeight: value })}
                >
                  <SelectTrigger className="rounded-xl">
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

            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="rounded-xl">
                <Bold className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="rounded-xl">
                <Italic className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="rounded-xl">
                <Underline className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label>Color</Label>
          <div className="flex items-center space-x-3">
            <div
              className="w-12 h-12 rounded-xl border-4 border-white shadow-lg"
              style={{ backgroundColor: selectedElement.color }}
            />
            <Input
              value={selectedElement.color}
              onChange={(e) => onUpdateElement(selectedElement.id, { color: e.target.value })}
              className="rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>X Position</Label>
            <Input
              type="number"
              value={Math.round(selectedElement.x)}
              onChange={(e) => onUpdateElement(selectedElement.id, { x: parseInt(e.target.value) })}
              className="rounded-xl"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Y Position</Label>
            <Input
              type="number"
              value={Math.round(selectedElement.y)}
              onChange={(e) => onUpdateElement(selectedElement.id, { y: parseInt(e.target.value) })}
              className="rounded-xl"
            />
          </div>
        </div>

        {selectedElement.type === 'shape' && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Width</Label>
              <Input
                type="number"
                min="10"
                value={selectedElement.width}
                onChange={(e) => onUpdateElement(selectedElement.id, { width: parseInt(e.target.value) })}
                className="rounded-xl"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Height</Label>
              <Input
                type="number"
                min="10"
                value={selectedElement.height}
                onChange={(e) => onUpdateElement(selectedElement.id, { height: parseInt(e.target.value) })}
                className="rounded-xl"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>Rotation</Label>
          <Input
            type="number"
            min="-180"
            max="180"
            value={selectedElement.rotation || 0}
            onChange={(e) => onUpdateElement(selectedElement.id, { rotation: parseInt(e.target.value) })}
            className="rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};
