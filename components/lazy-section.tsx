'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';

interface LazySectionProps {
  children: ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
}

export default function LazySection({
  children,
  rootMargin = '50px',
  threshold = 0.1,
  className = ''
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
          // 한 번 로드되면 observer 해제
          if (elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [rootMargin, threshold, hasLoaded]);

  return (
    <div ref={elementRef} className={className}>
      {isVisible ? children : null}
    </div>
  );
} 