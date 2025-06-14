
import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animationType?: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'fadeIn';
}

export function AnimatedSection({ 
  children, 
  className, 
  delay = 0,
  animationType = 'fadeInUp'
}: AnimatedSectionProps) {
  const { elementRef, isVisible } = useScrollAnimation();

  const animationClasses = {
    fadeInUp: isVisible 
      ? 'opacity-100 translate-y-0' 
      : 'opacity-0 translate-y-8',
    fadeInLeft: isVisible 
      ? 'opacity-100 translate-x-0' 
      : 'opacity-0 -translate-x-8',
    fadeInRight: isVisible 
      ? 'opacity-100 translate-x-0' 
      : 'opacity-0 translate-x-8',
    scaleIn: isVisible 
      ? 'opacity-100 scale-100' 
      : 'opacity-0 scale-95',
    fadeIn: isVisible 
      ? 'opacity-100' 
      : 'opacity-0'
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        'transition-all duration-700 ease-out',
        animationClasses[animationType],
        className
      )}
      style={{ 
        transitionDelay: `${delay}ms` 
      }}
    >
      {children}
    </div>
  );
}
