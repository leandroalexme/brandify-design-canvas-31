
import { useEffect, useRef } from 'react';

export const useOptimizedEventListener = <T extends keyof WindowEventMap>(
  eventType: T,
  handler: (event: WindowEventMap[T]) => void,
  options?: {
    passive?: boolean;
    once?: boolean;
    capture?: boolean;
  }
) => {
  const handlerRef = useRef(handler);
  
  // Atualizar ref sem re-registrar o listener
  handlerRef.current = handler;

  useEffect(() => {
    const eventHandler = (event: WindowEventMap[T]) => {
      handlerRef.current(event);
    };

    window.addEventListener(eventType, eventHandler, options);
    
    return () => {
      window.removeEventListener(eventType, eventHandler, options);
    };
  }, [eventType, options?.passive, options?.once, options?.capture]);
};
