
import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  slowRenders: number;
}

export const usePerformanceMonitor = (componentName: string, threshold: number = 16) => {
  const metricsRef = useRef<PerformanceMetrics>({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    slowRenders: 0
  });

  const renderStartRef = useRef<number>(0);

  // Marcar início do render
  const markRenderStart = useCallback(() => {
    renderStartRef.current = performance.now();
  }, []);

  // Marcar fim do render e calcular métricas
  const markRenderEnd = useCallback(() => {
    const renderTime = performance.now() - renderStartRef.current;
    const metrics = metricsRef.current;
    
    metrics.renderCount++;
    metrics.lastRenderTime = renderTime;
    metrics.averageRenderTime = 
      (metrics.averageRenderTime * (metrics.renderCount - 1) + renderTime) / metrics.renderCount;
    
    if (renderTime > threshold) {
      metrics.slowRenders++;
      console.warn(`🐌 [PERFORMANCE] Slow render detected in ${componentName}:`, {
        renderTime: `${renderTime.toFixed(2)}ms`,
        threshold: `${threshold}ms`,
        totalSlowRenders: metrics.slowRenders
      });
    }

    if (process.env.NODE_ENV === 'development' && metrics.renderCount % 10 === 0) {
      console.log(`📊 [PERFORMANCE] ${componentName} metrics:`, {
        totalRenders: metrics.renderCount,
        averageTime: `${metrics.averageRenderTime.toFixed(2)}ms`,
        slowRenders: metrics.slowRenders,
        slowRenderPercentage: `${((metrics.slowRenders / metrics.renderCount) * 100).toFixed(1)}%`
      });
    }
  }, [componentName, threshold]);

  // Auto-marcar início e fim em cada render
  useEffect(() => {
    markRenderStart();
    return markRenderEnd;
  });

  // Função para obter métricas atuais
  const getMetrics = useCallback(() => {
    return { ...metricsRef.current };
  }, []);

  // Função para reset de métricas
  const resetMetrics = useCallback(() => {
    metricsRef.current = {
      renderCount: 0,
      lastRenderTime: 0,
      averageRenderTime: 0,
      slowRenders: 0
    };
  }, []);

  return {
    markRenderStart,
    markRenderEnd,
    getMetrics,
    resetMetrics
  };
};
