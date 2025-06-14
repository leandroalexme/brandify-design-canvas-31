
import React from 'react';
import { Layout } from 'lucide-react';

export const ArtboardsButton = () => {
  return (
    <button 
      className="control-button fixed top-6 right-6 z-40"
      title="Pranchetas"
    >
      <Layout className="w-5 h-5" />
    </button>
  );
};
