
import React from 'react';
import { X, AlignLeft, AlignCenter, AlignRight, AlignJustify, AlignStartVertical, AlignCenterVertical, AlignEndVertical } from 'lucide-react';

interface AlignmentPanelProps {
  onClose: () => void;
}

export const AlignmentPanel = ({ onClose }: AlignmentPanelProps) => {
  const alignmentTools = [
    { id: 'align-left', icon: AlignLeft, label: 'Alinhar à esquerda' },
    { id: 'align-center-h', icon: AlignCenter, label: 'Centralizar horizontal' },
    { id: 'align-right', icon: AlignRight, label: 'Alinhar à direita' },
    { id: 'align-justify', icon: AlignJustify, label: 'Justificar' },
    { id: 'align-top', icon: AlignStartVertical, label: 'Alinhar ao topo' },
    { id: 'align-center-v', icon: AlignCenterVertical, label: 'Centralizar vertical' },
    { id: 'align-bottom', icon: AlignEndVertical, label: 'Alinhar à base' },
  ];

  return (
    <div className="fixed bottom-20 right-6 z-50 floating-module p-4 w-56">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-200">Alinhamento</h3>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {alignmentTools.map((tool) => (
          <button
            key={tool.id}
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-slate-100 transition-all duration-200"
            title={tool.label}
          >
            <tool.icon className="w-5 h-5" />
          </button>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <h4 className="text-xs font-medium text-slate-400 mb-2">Grade</h4>
        <div className="flex items-center gap-2">
          <button className="flex-1 py-2 px-3 text-xs bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-slate-300 transition-colors">
            Mostrar Grade
          </button>
          <button className="flex-1 py-2 px-3 text-xs bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-slate-300 transition-colors">
            Snap to Grid
          </button>
        </div>
      </div>
    </div>
  );
};
