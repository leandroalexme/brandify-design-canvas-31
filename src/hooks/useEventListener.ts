
import { useEffect, useRef } from 'react';

export const useEventListener = <T extends keyof WindowEventMap>(
  eventType: T,
  handler: (event: WindowEventMap[T]) => void,
  element: EventTarget | null = window,
  options?: boolean | AddEventListenerOptions
) => {
  const savedHandler = useRef<(event: WindowEventMap[T]) => void>();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!element) return;

    const eventListener = (event: Event) => {
      if (savedHandler.current) {
        savedHandler.current(event as WindowEventMap[T]);
      }
    };

    element.addEventListener(eventType, eventListener, options);

    return () => {
      element.removeEventListener(eventType, eventListener, options);
    };
  }, [eventType, element, options]);
};
