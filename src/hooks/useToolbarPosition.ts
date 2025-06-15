
import React from 'react';

export const useToolbarPosition = () => {
  const getToolbarCenter = React.useCallback(() => {
    return {
      x: window.innerWidth / 2,
      y: window.innerHeight - 120
    };
  }, []);

  return { getToolbarCenter };
};
