
import React, { useRef, useState } from 'react';
import { Square, Circle, Type, Pen, Trash2, Download, Palette } from 'lucide-react';
import { useSvgEditor } from '../hooks/useSvgEditor';

interface SvgEditorProps {
  enabled?: boolean;
  className?: string;
}

export const SvgEditor = ({ enabled = true, className = '' }: SvgEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedTool, setSelectedTool] = useState<'select' | 'rectangle' | 'circle' | 'text' | 'pen'>('select');
  const [selectedColor, setSelectedColor] = useState('#ff6b6b');
  
  const {
    selectedElement,
    isDrawing,
    addRectangle,
    addCircle,
    addText,
    startFreeDrawing,
    continueFreeDrawing,
    endFreeDrawing,
    deleteSelected,
    clearCanvas,
    changeElementColor,
    exportSvg
  } = useSvgEditor({ containerRef, enabled });

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    switch (selectedTool) {
      case 'rectangle':
        addRectangle(x - 50, y - 40);
        break;
      case 'circle':
        addCircle(x - 40, y - 40);
        break;
      case 'text':
        const text = prompt('Digite o texto:') || 'Texto';
        addText(text, x, y);
        break;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (selectedTool === 'pen') {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        startFreeDrawing(x, y);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (selectedTool === 'pen' && isDrawing) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        continueFreeDrawing(x, y);
      }
    }
  };

  const handleMouseUp = () => {
    if (selectedTool === 'pen') {
      endFreeDrawing();
    }
  };

  const handleExport = () => {
    const svgData = exportSvg();
    if (svgData) {
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'drawing.svg';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    changeElementColor(color);
  };

  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 bg-slate-800 rounded-lg">
        <button
          onClick={() => setSelectedTool('select')}
          className={`p-2 rounded-lg transition-colors ${
            selectedTool === 'select' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'
          }`}
          title="Selecionar"
        >
          ↖
        </button>
        
        <button
          onClick={() => setSelectedTool('rectangle')}
          className={`p-2 rounded-lg transition-colors ${
            selectedTool === 'rectangle' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'
          }`}
          title="Retângulo"
        >
          <Square className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => setSelectedTool('circle')}
          className={`p-2 rounded-lg transition-colors ${
            selectedTool === 'circle' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'
          }`}
          title="Círculo"
        >
          <Circle className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => setSelectedTool('text')}
          className={`p-2 rounded-lg transition-colors ${
            selectedTool === 'text' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'
          }`}
          title="Texto"
        >
          <Type className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => setSelectedTool('pen')}
          className={`p-2 rounded-lg transition-colors ${
            selectedTool === 'pen' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'
          }`}
          title="Desenho livre"
        >
          <Pen className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-slate-600 mx-2" />

        {/* Color Picker */}
        <div className="flex items-center gap-1">
          <Palette className="w-4 h-4 text-slate-300" />
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => handleColorChange(color)}
              className={`w-6 h-6 rounded-lg border-2 transition-all ${
                selectedColor === color ? 'border-white scale-110' : 'border-slate-600'
              }`}
              style={{ backgroundColor: color }}
              title={`Cor: ${color}`}
            />
          ))}
        </div>

        <div className="w-px h-6 bg-slate-600 mx-2" />

        <button
          onClick={deleteSelected}
          disabled={!selectedElement}
          className="p-2 rounded-lg text-red-400 hover:bg-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Excluir selecionado"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <button
          onClick={clearCanvas}
          className="p-2 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
          title="Limpar tudo"
        >
          🗑️
        </button>

        <button
          onClick={handleExport}
          className="p-2 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
          title="Exportar SVG"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* Canvas */}
      <div className="flex items-center justify-center">
        <div
          ref={containerRef}
          className="relative rounded-lg overflow-hidden shadow-lg cursor-crosshair"
          onClick={handleCanvasClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ 
            cursor: selectedTool === 'select' ? 'default' : 
                   selectedTool === 'pen' ? 'crosshair' : 'pointer'
          }}
        />
      </div>

      {/* Status */}
      {enabled && (
        <div className="text-xs text-slate-400 text-center">
          <div>Ferramenta: {selectedTool} | Cor: {selectedColor}</div>
          {selectedElement && <div>Elemento selecionado: ✓</div>}
          {isDrawing && <div>Desenhando... ✏️</div>}
        </div>
      )}
    </div>
  );
};
