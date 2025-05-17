
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimationProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export function MoveIn({ 
  children, 
  className, 
  delay = 0, 
  duration = 300 
}: AnimationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        'transition-all duration-300 ease-out transform',
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10',
        className
      )}
      style={{ 
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms` 
      }}
    >
      {children}
    </div>
  );
}

export function FadeIn({ 
  children, 
  className, 
  delay = 0, 
  duration = 300 
}: AnimationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        'transition-opacity ease-in',
        isVisible ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{ 
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms` 
      }}
    >
      {children}
    </div>
  );
}

export function ScaleIn({ 
  children, 
  className, 
  delay = 0, 
  duration = 300 
}: AnimationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        'transition-all duration-300 ease-out transform',
        isVisible 
          ? 'opacity-100 scale-100' 
          : 'opacity-0 scale-95',
        className
      )}
      style={{ 
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms` 
      }}
    >
      {children}
    </div>
  );
}
