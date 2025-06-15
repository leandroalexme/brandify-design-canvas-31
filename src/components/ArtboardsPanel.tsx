import React, { useState } from 'react';
import { Plus, Copy, Trash2, Smartphone, Monitor, Tablet, Square, Search } from 'lucide-react';
import { PanelContainer } from './ui/PanelContainer';
import { UnifiedDropdown } from './ui/UnifiedDropdown';

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
  const [showSearch, setShowSearch] = useState(false);
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
  };

  const handleCreateCustom = () => {
    if (customWidth && customHeight) {
      console.log('Criar prancheta personalizada:', { width: customWidth, height: customHeight });
      setCustomWidth('');
      setCustomHeight('');
    }
  };

  return (
    <PanelContainer
      isOpen={true}
      onClose={onClose}
      title="Pranchetas"
      position={{ x: window.innerWidth - 416, y: 120 }}
      width={400}
      height={600}
      dataAttribute="data-artboards-panel"
      isDraggable={true}
    >
      <div className="panel-content-unified">
        {/* Search Section */}
        <div className="panel-section-unified">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar pranchetas..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="input-search-unified"
              />
            </div>
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`button-icon-unified ${showSearch ? 'selected' : ''}`}
              title="Toggle search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="panel-scrollable-unified flex-1">
          {/* Presets Section */}
          <div className="panel-section-unified">
            <h4 className="panel-section-title-unified">Presets</h4>
            <div className="space-y-2">
              {presets.map((preset, index) => {
                const IconComponent = preset.icon;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    className="w-full p-3 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/40 hover:border-slate-500/60 rounded-xl transition-all duration-150 hover:scale-[1.02] animate-stagger-fade"
                    style={{ 
                      animationDelay: `${index * 0.05}s`,
                      animationFillMode: 'both'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-slate-600/50 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-4 h-4 text-slate-300" />
                        </div>
                        <span className="text-sm font-medium text-slate-200">{preset.name}</span>
                      </div>
                      <span className="text-xs text-slate-400">{preset.width}×{preset.height}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Dimensions Section */}
          <div className="panel-section-unified">
            <h4 className="panel-section-title-unified">Dimensões Personalizadas</h4>
            <div className="space-y-3">
              <div className="grid-unified-2">
                <input
                  type="number"
                  placeholder="Largura"
                  value={customWidth}
                  onChange={(e) => setCustomWidth(e.target.value)}
                  className="input-unified"
                />
                <input
                  type="number"
                  placeholder="Altura"
                  value={customHeight}
                  onChange={(e) => setCustomHeight(e.target.value)}
                  className="input-unified"
                />
              </div>
              {customWidth && customHeight && (
                <button
                  onClick={handleCreateCustom}
                  className="button-primary-unified w-full animate-fade-in-60fps"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar ({customWidth}×{customHeight})
                </button>
              )}
            </div>
          </div>

          {/* Existing Artboards Section */}
          <div className="panel-section-unified">
            <h4 className="panel-section-title-unified">Pranchetas Existentes</h4>
            <div className="space-y-3">
              {filteredArtboards.map((artboard, index) => (
                <div
                  key={artboard.id}
                  className={`p-3 rounded-xl border transition-all duration-150 hover:scale-[1.01] animate-stagger-fade ${
                    artboard.selected 
                      ? 'bg-blue-500/20 border-blue-500/50' 
                      : 'bg-slate-700/30 border-slate-600/40 hover:bg-slate-700/50 hover:border-slate-500/60'
                  }`}
                  style={{ 
                    animationDelay: `${(index + presets.length) * 0.05}s`,
                    animationFillMode: 'both'
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-sm font-medium text-slate-200 truncate">{artboard.name}</h5>
                    <div className="flex items-center space-x-1">
                      <button className="button-icon-unified w-6 h-6" title="Duplicar">
                        <Copy className="w-3 h-3" />
                      </button>
                      <button className="button-icon-unified w-6 h-6 hover:!bg-red-500/20 hover:!border-red-500/40 hover:!text-red-400" title="Excluir">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-slate-800/50 rounded-lg p-2 mb-2">
                    <div 
                      className="w-full bg-slate-200 rounded border border-slate-600/40"
                      style={{ aspectRatio: `${artboard.width}/${artboard.height}`, height: '40px' }}
                    />
                  </div>
                  
                  <p className="text-xs text-slate-400 text-center">
                    {artboard.width} × {artboard.height}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="panel-section-unified border-t border-slate-700/60">
          <button className="button-primary-unified w-full">
            <Plus className="w-4 h-4 mr-2" />
            Nova Prancheta
          </button>
        </div>
      </div>
    </PanelContainer>
  );
};
