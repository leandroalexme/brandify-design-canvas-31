
import React from 'react';
import { Layers } from 'lucide-react';

export const LayersButton = () => {
  return (
    <button 
      className="control-button fixed bottom-6 left-6 z-40"
      title="Camadas"
    >
      <Layers className="w-5 h-5" />
    </button>
  );
};
