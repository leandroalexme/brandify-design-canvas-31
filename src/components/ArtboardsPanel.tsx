
import React, { useState } from 'react';
import { X, Plus, Copy, Trash2, Smartphone, Monitor, Tablet, Square, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';

interface ArtboardPreset {
  id: string;
  name: string;
  width: number;
  height: number;
  icon: React.ComponentType<any>;
}

interface ArtboardsPanelProps {
  onClose: () => void;
}

const presets: ArtboardPreset[] = [
  {
    id: 'instagram-stories',
    name: 'Stories Instagram',
    width: 1080,
    height: 1920,
    icon: Smartphone
  },
  {
    id: 'instagram-post',
    name: 'Post Instagram',
    width: 1080,
    height: 1080,
    icon: Square
  },
  {
    id: 'facebook-cover',
    name: 'Capa Facebook',
    width: 1640,
    height: 859,
    icon: Monitor
  },
  {
    id: 'linkedin-post',
    name: 'Post LinkedIn',
    width: 1200,
    height: 627,
    icon: Tablet
  }
];

export const ArtboardsPanel = ({ onClose }: ArtboardsPanelProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');
  
  const artboards = [
    { id: '1', name: 'Design sem título', width: 800, height: 600, selected: true },
  ];

  const filteredArtboards = artboards.filter(artboard =>
    artboard.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handlePresetSelect = (preset: ArtboardPreset) => {
    console.log('Preset selecionado:', preset);
    // Implementar lógica para criar nova prancheta com o preset selecionado
  };

  const handleCreateCustom = () => {
    if (customWidth && customHeight) {
      console.log('Criar prancheta personalizada:', { width: customWidth, height: customHeight });
      // Implementar lógica para criar prancheta personalizada
      setCustomWidth('');
      setCustomHeight('');
    }
  };

  return (
    <div className="fixed top-20 right-6 z-50 floating-module p-4 w-72">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-200">Pranchetas</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-6 w-6 text-slate-400 hover:text-slate-200"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Nova Prancheta */}
      <Button className="w-full mb-4 bg-blue-500 hover:bg-blue-600 text-white">
        <Plus className="w-4 h-4 mr-2" />
        Nova Prancheta
      </Button>

      {/* Presets */}
      <div className="mb-4">
        <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
          Presets
        </h4>
        <div className="space-y-1">
          {presets.map((preset) => {
            const IconComponent = preset.icon;
            return (
              <Button
                key={preset.id}
                variant="ghost"
                onClick={() => handlePresetSelect(preset)}
                className="w-full justify-between p-3 h-auto text-left hover:bg-slate-700/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 flex items-center justify-center text-slate-400">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-200">{preset.name}</span>
                </div>
                <span className="text-xs text-slate-400">{preset.width}×{preset.height}</span>
              </Button>
            );
          })}
        </div>
      </div>

      <Separator className="mb-4 bg-slate-700/60" />

      {/* Dimensões Personalizadas */}
      <div className="mb-4">
        <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
          Dimensões Personalizadas
        </h4>
        <div className="flex gap-2 mb-2">
          <Input
            type="number"
            placeholder="Largura"
            value={customWidth}
            onChange={(e) => setCustomWidth(e.target.value)}
            className="bg-slate-700/50 border-slate-600/60 text-slate-200 placeholder-slate-400"
          />
          <Input
            type="number"
            placeholder="Altura"
            value={customHeight}
            onChange={(e) => setCustomHeight(e.target.value)}
            className="bg-slate-700/50 border-slate-600/60 text-slate-200 placeholder-slate-400"
          />
        </div>
        <Button
          onClick={handleCreateCustom}
          disabled={!customWidth || !customHeight}
          variant="outline"
          className="w-full border-slate-600/60 text-slate-200 hover:bg-slate-700/50"
        >
          Criar Prancheta
        </Button>
      </div>

      <Separator className="mb-4 bg-slate-700/60" />

      {/* Buscar Pranchetas Existentes */}
      <div className="mb-4">
        <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
          Pranchetas Existentes
        </h4>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Buscar pranchetas..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10 bg-slate-700/50 border-slate-600/60 text-slate-200 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Lista de Pranchetas */}
      <ScrollArea className="h-48">
        <div className="space-y-2">
          {filteredArtboards.map((artboard) => (
            <div
              key={artboard.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                artboard.selected 
                  ? 'bg-blue-500/20 border border-blue-500/50' 
                  : 'hover:bg-slate-700/50 border border-transparent'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-slate-200 truncate">{artboard.name}</h4>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-slate-400 hover:text-slate-200"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-2 mb-2">
                <div 
                  className="w-full bg-white rounded border border-slate-600"
                  style={{ aspectRatio: `${artboard.width}/${artboard.height}`, height: '40px' }}
                />
              </div>
              
              <p className="text-xs text-slate-400">
                {artboard.width} × {artboard.height}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
