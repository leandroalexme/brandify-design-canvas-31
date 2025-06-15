
import React, { useRef, useEffect } from 'react';

interface ColorWheelProps {
  hue: number;
  saturation: number;
  lightness: number;
  onColorChange: (hue: number, saturation: number, lightness: number) => void;
}

export const ColorWheel = ({ 
  hue, 
  saturation, 
  lightness, 
  onColorChange 
}: ColorWheelProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw the color wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const outerRadius = 80;
    const innerRadius = 50;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw color wheel
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

    // Draw central triangle for brightness and saturation
    ctx.beginPath();
    const triangleRadius = innerRadius - 5;
    
    // Calculate triangle points
    const point1X = centerX;
    const point1Y = centerY - triangleRadius;
    const point2X = centerX - triangleRadius * Math.cos(Math.PI / 6);
    const point2Y = centerY + triangleRadius * Math.sin(Math.PI / 6);
    const point3X = centerX + triangleRadius * Math.cos(Math.PI / 6);
    const point3Y = centerY + triangleRadius * Math.sin(Math.PI / 6);

    // Create gradient for triangle
    const triangleGradient = ctx.createLinearGradient(point1X, point1Y, centerX, point2Y);
    triangleGradient.addColorStop(0, 'white');
    triangleGradient.addColorStop(1, `hsl(${hue}, 100%, 50%)`);

    ctx.moveTo(point1X, point1Y);
    ctx.lineTo(point2X, point2Y);
    ctx.lineTo(point3X, point3Y);
    ctx.closePath();
    
    ctx.fillStyle = triangleGradient;
    ctx.fill();

    // Black overlay for brightness control
    const blackOverlay = ctx.createLinearGradient(point2X, point2Y, point3X, point3Y);
    blackOverlay.addColorStop(0, 'rgba(0,0,0,0.8)');
    blackOverlay.addColorStop(1, 'rgba(0,0,0,0)');
    
    ctx.fillStyle = blackOverlay;
    ctx.fill();

  }, [hue]);

  // Handle canvas clicks
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
    
    // If clicked on outer wheel (hue selector)
    if (distance >= 50 && distance <= 80) {
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      const normalizedAngle = (angle + 360) % 360;
      onColorChange(normalizedAngle, saturation, lightness);
    }
    
    // If clicked on central triangle (saturation and brightness)
    if (distance < 50) {
      // Simplified logic for triangle
      const newSaturation = Math.min(100, Math.max(0, (distance / 50) * 100));
      const newLightness = Math.min(100, Math.max(0, 50 + (dy / 50) * 50));
      
      onColorChange(hue, newSaturation, newLightness);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={160}
          height={160}
          className="cursor-crosshair"
          onClick={handleCanvasClick}
        />
        
        {/* Position indicator on wheel */}
        <div 
          className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg pointer-events-none"
          style={{
            left: `${80 + 65 * Math.cos(hue * Math.PI / 180)}px`,
            top: `${80 + 65 * Math.sin(hue * Math.PI / 180)}px`,
            transform: 'translate(-50%, -50%)'
          }}
        />
        
        {/* Position indicator on triangle */}
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
  );
};
