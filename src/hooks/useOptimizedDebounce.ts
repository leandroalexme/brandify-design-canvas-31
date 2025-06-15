
import { useCallback, useRef, useEffect } from 'react';

interface UseOptimizedDebounceOptions {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

export const useOptimizedDebounce = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
  options: UseOptimizedDebounceOptions = {}
): T => {
  const { leading = false, trailing = true, maxWait } = options;
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCallTimeRef = useRef<number>(0);
  const lastInvokeTimeRef = useRef<number>(0);
  const argsRef = useRef<Parameters<T>>();
  const callbackRef = useRef(callback);

  // Manter callback atualizado sem quebrar memoização
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const invokeCallback = useCallback(() => {
    const time = Date.now();
    lastInvokeTimeRef.current = time;
    
    if (argsRef.current) {
      callbackRef.current(...argsRef.current);
    }
  }, []);

  const leadingEdge = useCallback((time: number) => {
    lastInvokeTimeRef.current = time;
    if (leading) {
      invokeCallback();
    }
  }, [leading, invokeCallback]);

  const timerExpired = useCallback(() => {
    const time = Date.now();
    const timeSinceLastCall = time - lastCallTimeRef.current;
    
    if (timeSinceLastCall < delay && timeSinceLastCall >= 0) {
      timeoutRef.current = setTimeout(timerExpired, delay - timeSinceLastCall);
    } else {
      timeoutRef.current = null;
      if (trailing) {
        invokeCallback();
      }
    }
  }, [delay, trailing, invokeCallback]);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      const time = Date.now();
      const isInvoking = lastCallTimeRef.current === 0;
      
      lastCallTimeRef.current = time;
      argsRef.current = args;

      if (isInvoking) {
        leadingEdge(time);
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(timerExpired, delay);

      // Implementar maxWait se especificado
      if (maxWait && !maxTimeoutRef.current) {
        maxTimeoutRef.current = setTimeout(() => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          maxTimeoutRef.current = null;
          invokeCallback();
        }, maxWait);
      }
    },
    [delay, leadingEdge, timerExpired, maxWait, invokeCallback]
  ) as T;

  // Função para cancelar debounce
  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (maxTimeoutRef.current) {
      clearTimeout(maxTimeoutRef.current);
      maxTimeoutRef.current = null;
    }
    lastCallTimeRef.current = 0;
    lastInvokeTimeRef.current = 0;
  }, []);

  // Função para flush (executar imediatamente)
  const flush = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      invokeCallback();
    }
  }, [invokeCallback]);

  // Cleanup no unmount
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  // Expor métodos utilitários
  (debouncedCallback as any).cancel = cancel;
  (debouncedCallback as any).flush = flush;

  return debouncedCallback;
};
