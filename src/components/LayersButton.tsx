
import React from 'react';
import { Layers } from 'lucide-react';

interface LayersButtonProps {
  onClick: () => void;
}

export const LayersButton = ({ onClick }: LayersButtonProps) => {
  return (
    <button 
      className="control-button fixed bottom-6 left-6 z-40"
      title="Camadas"
      onClick={onClick}
    >
      <Layers className="w-5 h-5" />
    </button>
  );
};
