
import React, { useState } from 'react';
import { X, Plus, Copy, Trash2, ChevronDown } from 'lucide-react';
import { ArtboardSearch } from './ArtboardSearch';
import { ArtboardPresets } from './ArtboardPresets';

interface ArtboardsPanelProps {
  onClose: () => void;
}

export const ArtboardsPanel = ({ onClose }: ArtboardsPanelProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [showPresets, setShowPresets] = useState(true);
  
  const artboards = [
    { id: '1', name: 'Design sem título', width: 800, height: 600, selected: true },
  ];

  const handlePresetSelect = (preset: any) => {
    console.log('Preset selecionado:', preset);
    // Aqui você implementaria a lógica para criar uma nova prancheta com o preset selecionado
  };

  return (
    <div className="fixed top-20 right-6 z-50 floating-module p-4 w-72">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-200">Pranchetas</h3>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Botão para nova prancheta */}
      <button className="w-full mb-4 py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
        <Plus className="w-4 h-4" />
        Nova Prancheta
      </button>

      {/* Campo de busca */}
      <ArtboardSearch 
        value={searchValue}
        onChange={setSearchValue}
        placeholder="Tamanho personalizado"
      />

      {/* Seção de presets */}
      <div className="mb-4">
        <button
          onClick={() => setShowPresets(!showPresets)}
          className="w-full flex items-center justify-between py-2 text-sm font-medium text-slate-300 hover:text-slate-200 transition-colors"
        >
          <span>Presets</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showPresets ? 'rotate-180' : ''}`} />
        </button>
        
        {showPresets && (
          <div className="mt-2">
            <ArtboardPresets onPresetSelect={handlePresetSelect} />
          </div>
        )}
      </div>

      {/* Lista de pranchetas existentes */}
      <div className="space-y-3">
        <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
          Pranchetas Existentes
        </div>
        {artboards.map((artboard) => (
          <div
            key={artboard.id}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              artboard.selected 
                ? 'bg-blue-500/20 border border-blue-500/50' 
                : 'hover:bg-slate-700/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-slate-200">{artboard.name}</h4>
              <div className="flex items-center gap-1">
                <button className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-200">
                  <Copy className="w-3 h-3" />
                </button>
                <button className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-red-400">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-2">
              <div 
                className="w-full bg-white rounded border-2 border-blue-500"
                style={{ aspectRatio: `${artboard.width}/${artboard.height}`, height: '60px' }}
              />
            </div>
            
            <p className="text-xs text-slate-400 mt-2">
              {artboard.width} × {artboard.height}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
