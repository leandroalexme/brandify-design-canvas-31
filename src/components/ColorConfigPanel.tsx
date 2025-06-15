
import React, { useRef, useEffect, useState } from 'react';
import { X, Plus } from 'lucide-react';

interface ColorConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
  position?: { x: number; y: number };
}

export const ColorConfigPanel = ({ 
  isOpen, 
  onClose, 
  position = { x: 120, y: 200 }
}: ColorConfigPanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [opacity, setOpacity] = useState(100);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);

  // Desenhar a roda de cores
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const outerRadius = 80;
    const innerRadius = 50;

    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar roda de cores
    for (let angle = 0; angle < 360; angle++) {
      const startAngle = (angle - 1) * Math.PI / 180;
      const endAngle = angle * Math.PI / 180;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
      ctx.closePath();
      
      const gradient = ctx.createRadialGradient(centerX, centerY, innerRadius, centerX, centerY, outerRadius);
      gradient.addColorStop(0, `hsl(${angle}, 0%, 50%)`);
      gradient.addColorStop(1, `hsl(${angle}, 100%, 50%)`);
      
      ctx.fillStyle = `hsl(${angle}, 100%, 50%)`;
      ctx.fill();
    }

    // Desenhar triângulo central para brilho e saturação
    ctx.beginPath();
    const triangleRadius = innerRadius - 5;
    
    // Calcular pontos do triângulo
    const point1X = centerX;
    const point1Y = centerY - triangleRadius;
    const point2X = centerX - triangleRadius * Math.cos(Math.PI / 6);
    const point2Y = centerY + triangleRadius * Math.sin(Math.PI / 6);
    const point3X = centerX + triangleRadius * Math.cos(Math.PI / 6);
    const point3Y = centerY + triangleRadius * Math.sin(Math.PI / 6);

    // Criar gradiente para o triângulo
    const triangleGradient = ctx.createLinearGradient(point1X, point1Y, centerX, point2Y);
    triangleGradient.addColorStop(0, 'white');
    triangleGradient.addColorStop(1, `hsl(${hue}, 100%, 50%)`);

    ctx.moveTo(point1X, point1Y);
    ctx.lineTo(point2X, point2Y);
    ctx.lineTo(point3X, point3Y);
    ctx.closePath();
    
    ctx.fillStyle = triangleGradient;
    ctx.fill();

    // Overlay de preto para controlar o brilho
    const blackOverlay = ctx.createLinearGradient(point2X, point2Y, point3X, point3Y);
    blackOverlay.addColorStop(0, 'rgba(0,0,0,0.8)');
    blackOverlay.addColorStop(1, 'rgba(0,0,0,0)');
    
    ctx.fillStyle = blackOverlay;
    ctx.fill();

  }, [hue]);

  // Lidar com cliques na roda de cores
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Se clicou na roda externa (seletor de matiz)
    if (distance >= 50 && distance <= 80) {
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      const normalizedAngle = (angle + 360) % 360;
      setHue(normalizedAngle);
      
      // Atualizar cor selecionada
      const newColor = `hsl(${normalizedAngle}, ${saturation}%, ${lightness}%)`;
      setSelectedColor(newColor);
    }
    
    // Se clicou no triângulo central (saturação e brilho)
    if (distance < 50) {
      // Lógica simplificada para o triângulo
      const newSaturation = Math.min(100, Math.max(0, (distance / 50) * 100));
      const newLightness = Math.min(100, Math.max(0, 50 + (dy / 50) * 50));
      
      setSaturation(newSaturation);
      setLightness(newLightness);
      
      const newColor = `hsl(${hue}, ${newSaturation}%, ${newLightness}%)`;
      setSelectedColor(newColor);
    }
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpacity(Number(e.target.value));
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={panelRef}
      className="fixed z-[500] animate-scale-in-60fps"
      style={{
        left: position.x,
        top: position.y
      }}
      data-color-panel
    >
      <div className="text-panel-container w-80">
        {/* Header */}
        <div className="text-panel-header">
          <div className="text-panel-indicator" />
          <button
            onClick={onClose}
            className="text-panel-close-button"
            title="Fechar"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Roda de cores */}
          <div className="flex justify-center">
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={160}
                height={160}
                className="cursor-crosshair"
                onClick={handleCanvasClick}
              />
              
              {/* Indicador de posição na roda */}
              <div 
                className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg pointer-events-none"
                style={{
                  left: `${80 + 65 * Math.cos(hue * Math.PI / 180)}px`,
                  top: `${80 + 65 * Math.sin(hue * Math.PI / 180)}px`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
              
              {/* Indicador de posição no triângulo */}
              <div 
                className="absolute w-3 h-3 border-2 border-white rounded-full shadow-lg pointer-events-none"
                style={{
                  left: `${80 + (saturation / 100) * 30 * Math.cos((hue + 90) * Math.PI / 180)}px`,
                  top: `${80 + (lightness - 50) / 50 * 30}px`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            </div>
          </div>

          {/* Slider de opacidade */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Opacidade</span>
              <span className="text-sm text-slate-300 font-mono">{opacity}%</span>
            </div>
            
            <div className="relative">
              <div 
                className="w-full h-6 rounded-full"
                style={{
                  background: `repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 8px 8px`
                }}
              />
              
              <div className="absolute inset-0 flex items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={opacity}
                  onChange={handleOpacityChange}
                  className="w-full h-6 bg-transparent appearance-none cursor-pointer slider-opacity"
                />
              </div>
              
              <div 
                className="absolute w-6 h-6 bg-white border-2 border-slate-400 rounded-full shadow-lg pointer-events-none"
                style={{
                  left: `${opacity}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
            </div>
          </div>

          {/* Cor atual e valores */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-8 rounded">
                <div 
                  className="absolute inset-0 rounded"
                  style={{
                    background: `repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 4px 4px`
                  }}
                />
                <div 
                  className="absolute inset-0 rounded"
                  style={{
                    backgroundColor: selectedColor,
                    opacity: opacity / 100
                  }}
                />
              </div>
              
              <div className="text-xs font-mono text-slate-300 space-y-1">
                <div>H: {Math.round(hue)}°</div>
                <div>S: {Math.round(saturation)}%</div>
                <div>L: {Math.round(lightness)}%</div>
              </div>
            </div>
            
            <button
              className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              title="Adicionar à paleta"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
