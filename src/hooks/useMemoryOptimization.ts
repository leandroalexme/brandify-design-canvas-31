
import { useEffect, useRef } from 'react';

export const useMemoryOptimization = () => {
  const observerRef = useRef<IntersectionObserver>();
  const elementsRef = useRef<Set<Element>>(new Set());

  useEffect(() => {
    // Intersection Observer para otimizar renderização de elementos fora da viewport
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            element.style.display = '';
          } else {
            // Ocultar elementos que estão muito longe da viewport
            const rect = element.getBoundingClientRect();
            const threshold = window.innerHeight * 2; // 2x viewport height
            
            if (Math.abs(rect.top) > threshold) {
              element.style.display = 'none';
            }
          }
        });
      },
      {
        rootMargin: '100px',
        threshold: 0
      }
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const observeElement = (element: Element) => {
    if (observerRef.current && !elementsRef.current.has(element)) {
      observerRef.current.observe(element);
      elementsRef.current.add(element);
    }
  };

  const unobserveElement = (element: Element) => {
    if (observerRef.current && elementsRef.current.has(element)) {
      observerRef.current.unobserve(element);
      elementsRef.current.delete(element);
    }
  };

  return { observeElement, unobserveElement };
};
