
import React, { useState, useRef, useCallback } from 'react';
import { X, Grid3X3, MoreHorizontal, Square, RectangleHorizontal, RectangleVertical, SeparatorHorizontal, SeparatorVertical, RotateCcw, Circle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Slider } from '@/components/ui/slider';

interface AlignmentPanelProps {
  onClose: () => void;
}

export const AlignmentPanel = ({ onClose }: AlignmentPanelProps) => {
  const [gridResponsive, setGridResponsive] = useState(true);
  const [maxZoom, setMaxZoom] = useState('3600');
  const [gridWidth, setGridWidth] = useState('1226');
  const [stretchPercentage, setStretchPercentage] = useState('117');
  const [columnWidth, setColumnWidth] = useState([10]);
  const [leftMargin, setLeftMargin] = useState('25');
  const [gutter, setGutter] = useState('0');
  const [padding, setPadding] = useState('0');
  const [bottomMargin, setBottomMargin] = useState('0');
  const [rightMargin, setRightMargin] = useState('20');
  const [guideStyle, setGuideStyle] = useState<'outline' | 'filled' | 'dots'>('outline');
  const [guideColor, setGuideColor] = useState('#3b82f6');

  const dragRefs = {
    maxZoom: useRef<HTMLSpanElement>(null),
    gridWidth: useRef<HTMLSpanElement>(null),
    leftMargin: useRef<HTMLSpanElement>(null),
    gutter: useRef<HTMLSpanElement>(null),
    padding: useRef<HTMLSpanElement>(null),
    bottomMargin: useRef<HTMLSpanElement>(null),
    rightMargin: useRef<HTMLSpanElement>(null),
  };

  const useDragToChange = (
    value: string,
    setValue: (value: string) => void,
    step: number = 1,
    min: number = 0,
    max: number = 9999
  ) => {
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      const startY = e.clientY;
      const startValue = parseInt(value) || 0;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const deltaY = (startY - moveEvent.clientY) * step;
        const newValue = Math.max(min, Math.min(max, startValue + deltaY));
        setValue(newValue.toString());
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'default';
      };

      document.body.style.cursor = 'ns-resize';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }, [value, setValue, step, min, max]);

    return handleMouseDown;
  };

  const dragHandlers = {
    maxZoom: useDragToChange(maxZoom, setMaxZoom, 10),
    gridWidth: useDragToChange(gridWidth, setGridWidth, 5),
    leftMargin: useDragToChange(leftMargin, setLeftMargin),
    gutter: useDragToChange(gutter, setGutter),
    padding: useDragToChange(padding, setPadding),
    bottomMargin: useDragToChange(bottomMargin, setBottomMargin),
    rightMargin: useDragToChange(rightMargin, setRightMargin),
  };

  const resetToDefaults = () => {
    setGridResponsive(true);
    setMaxZoom('3600');
    setGridWidth('1226');
    setStretchPercentage('117');
    setColumnWidth([10]);
    setLeftMargin('25');
    setGutter('0');
    setPadding('0');
    setBottomMargin('0');
    setRightMargin('20');
    setGuideStyle('outline');
    setGuideColor('#3b82f6');
  };

  const GuideStylePreview = ({ style, isSelected, onClick }: { style: 'outline' | 'filled' | 'dots', isSelected: boolean, onClick: () => void }) => {
    const baseClasses = `p-2 rounded border transition-colors cursor-pointer ${
      isSelected
        ? 'border-blue-500 bg-blue-500/20 text-blue-400'
        : 'border-slate-600 text-slate-400 hover:text-slate-200 hover:border-slate-500'
    }`;

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button onClick={onClick} className={baseClasses} aria-label={`${style} style`}>
            {style === 'outline' && <Square className="w-4 h-4" />}
            {style === 'filled' && <div className="w-4 h-4 bg-current rounded-sm" />}
            {style === 'dots' && <Circle className="w-4 h-4" />}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{style === 'outline' ? 'Linhas' : style === 'filled' ? 'Preenchido' : 'Pontos'}</p>
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <TooltipProvider>
      <div className="fixed bottom-20 right-6 z-50 floating-module p-5 w-96 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-semibold text-slate-200">Guides Grid</h3>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={resetToDefaults}
                  className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-700/50"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Resetar configurações</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-700/50">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mais opções</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onClose}
                  className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-700/50"
                >
                  <X className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Fechar painel</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="space-y-6">
          {/* Configurações Gerais */}
          <div className="bg-slate-800/30 rounded-xl p-4 space-y-4">
            <h4 className="text-sm font-medium text-slate-300 mb-3">Configurações Gerais</h4>
            
            {/* Grid Responsivo */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-sm text-slate-300 cursor-help">Grid Responsivo</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Escala o grid automaticamente com o nível de zoom</p>
                  </TooltipContent>
                </Tooltip>
                <span className="text-xs text-slate-500">Adapta ao zoom da tela</span>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setGridResponsive(!gridResponsive)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 ${
                      gridResponsive ? 'bg-blue-500' : 'bg-slate-600'
                    }`}
                    aria-label={`Grid responsivo ${gridResponsive ? 'ativado' : 'desativado'}`}
                    role="switch"
                    aria-checked={gridResponsive}
                  >
                    <div
                      className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform duration-200 ${
                        gridResponsive ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Alternar grid responsivo</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Zoom Máximo */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      ref={dragRefs.maxZoom}
                      className="text-sm text-slate-300 cursor-ns-resize select-none hover:text-blue-400 transition-colors"
                      onMouseDown={dragHandlers.maxZoom}
                    >
                      Zoom Máximo
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Limite máximo de zoom em pixels (arraste para ajustar)</p>
                  </TooltipContent>
                </Tooltip>
                <span className="text-xs text-slate-500">Parar escala em</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={maxZoom}
                  onChange={(e) => setMaxZoom(e.target.value)}
                  className="w-16 px-1 py-1 text-sm bg-slate-700/50 border border-slate-600/50 rounded text-blue-400 text-right focus:outline-none focus:ring-1 focus:ring-blue-500"
                  aria-label="Valor do zoom máximo"
                />
                <span className="text-xs text-slate-500">px</span>
              </div>
            </div>
          </div>

          {/* Dimensões */}
          <div className="bg-slate-800/30 rounded-xl p-4 space-y-4">
            <h4 className="text-sm font-medium text-slate-300 mb-3">Dimensões</h4>
            
            {/* Largura do Grid */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      ref={dragRefs.gridWidth}
                      className="text-sm text-slate-300 cursor-ns-resize select-none hover:text-blue-400 transition-colors"
                      onMouseDown={dragHandlers.gridWidth}
                    >
                      Largura do Grid
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Largura total do grid (arraste para ajustar)</p>
                  </TooltipContent>
                </Tooltip>
                <span className="text-xs text-slate-500">Esticado {stretchPercentage}%</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={gridWidth}
                  onChange={(e) => setGridWidth(e.target.value)}
                  className="w-16 px-1 py-1 text-sm bg-slate-700/50 border border-slate-600/50 rounded text-blue-400 text-right focus:outline-none focus:ring-1 focus:ring-blue-500"
                  aria-label="Largura do grid"
                />
                <span className="text-xs text-slate-500">px</span>
              </div>
            </div>

            {/* Largura da Coluna com Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Largura da Coluna</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-blue-400">{columnWidth[0]}</span>
                  <span className="text-xs text-slate-500">colunas</span>
                </div>
              </div>
              <Slider
                value={columnWidth}
                onValueChange={setColumnWidth}
                max={20}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>1</span>
                <span>20</span>
              </div>
            </div>
          </div>

          {/* Espaçamento */}
          <div className="bg-slate-800/30 rounded-xl p-4 space-y-4">
            <h4 className="text-sm font-medium text-slate-300 mb-3">Espaçamento</h4>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Margem Esquerda */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <SeparatorVertical className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-400">Margem Esquerda</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    ref={dragRefs.leftMargin}
                    className="text-sm text-blue-400 cursor-ns-resize select-none hover:text-blue-300 transition-colors font-medium"
                    onMouseDown={dragHandlers.leftMargin}
                  >
                    {leftMargin}
                  </span>
                  <span className="text-xs text-slate-500">px</span>
                </div>
              </div>

              {/* Gutter */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <RectangleVertical className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-400">Gutter</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    ref={dragRefs.gutter}
                    className="text-sm text-blue-400 cursor-ns-resize select-none hover:text-blue-300 transition-colors font-medium"
                    onMouseDown={dragHandlers.gutter}
                  >
                    {gutter}
                  </span>
                  <span className="text-xs text-slate-500">px</span>
                </div>
              </div>

              {/* Padding */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Square className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-400">Padding Interno</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    ref={dragRefs.padding}
                    className="text-sm text-blue-400 cursor-ns-resize select-none hover:text-blue-300 transition-colors font-medium"
                    onMouseDown={dragHandlers.padding}
                  >
                    {padding}
                  </span>
                  <span className="text-xs text-slate-500">px</span>
                </div>
              </div>

              {/* Margem Direita */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <RectangleHorizontal className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-400">Margem Direita</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    ref={dragRefs.rightMargin}
                    className="text-sm text-blue-400 cursor-ns-resize select-none hover:text-blue-300 transition-colors font-medium"
                    onMouseDown={dragHandlers.rightMargin}
                  >
                    {rightMargin}
                  </span>
                  <span className="text-xs text-slate-500">px</span>
                </div>
              </div>
            </div>

            {/* Margem Inferior - Largura total */}
            <div className="pt-2 border-t border-slate-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SeparatorHorizontal className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-400">Margem Inferior</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    ref={dragRefs.bottomMargin}
                    className="text-sm text-blue-400 cursor-ns-resize select-none hover:text-blue-300 transition-colors font-medium"
                    onMouseDown={dragHandlers.bottomMargin}
                  >
                    {bottomMargin}
                  </span>
                  <span className="text-xs text-slate-500">px</span>
                </div>
              </div>
            </div>
          </div>

          {/* Aparência */}
          <div className="bg-slate-800/30 rounded-xl p-4 space-y-4">
            <h4 className="text-sm font-medium text-slate-300 mb-3">Aparência</h4>
            
            {/* Estilo das Guias */}
            <div className="space-y-3">
              <span className="text-sm text-slate-300">Estilo das Guias</span>
              <div className="flex items-center gap-2">
                <GuideStylePreview 
                  style="outline" 
                  isSelected={guideStyle === 'outline'} 
                  onClick={() => setGuideStyle('outline')}
                />
                <GuideStylePreview 
                  style="filled" 
                  isSelected={guideStyle === 'filled'} 
                  onClick={() => setGuideStyle('filled')}
                />
                <GuideStylePreview 
                  style="dots" 
                  isSelected={guideStyle === 'dots'} 
                  onClick={() => setGuideStyle('dots')}
                />
              </div>
            </div>
            
            {/* Cor das Guias */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Cor das Guias</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={guideColor}
                  onChange={(e) => setGuideColor(e.target.value)}
                  className="w-8 h-8 rounded-lg border border-slate-600 bg-transparent cursor-pointer"
                  aria-label="Cor das guias"
                />
                <div
                  className="w-4 h-4 rounded border border-slate-600"
                  style={{ backgroundColor: guideColor }}
                />
              </div>
            </div>

            {/* Preview das Guias */}
            <div className="pt-3 border-t border-slate-700/50">
              <span className="text-xs text-slate-400 mb-2 block">Preview</span>
              <div className="flex items-center justify-center p-3 bg-slate-900/50 rounded-lg">
                <div className="flex gap-1">
                  {guideStyle === 'outline' && [...Array(5)].map((_, i) => (
                    <div key={i} className="w-px h-8 border-l" style={{ borderColor: guideColor, opacity: 0.8 }} />
                  ))}
                  {guideStyle === 'filled' && [...Array(5)].map((_, i) => (
                    <div key={i} className="w-0.5 h-8" style={{ backgroundColor: guideColor }} />
                  ))}
                  {guideStyle === 'dots' && [...Array(5)].map((_, i) => (
                    <div key={i} className="flex flex-col gap-1 items-center w-1">
                      {[...Array(4)].map((_, j) => (
                        <div key={j} className="w-0.5 h-0.5 rounded-full" style={{ backgroundColor: guideColor }} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
