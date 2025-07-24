import React, { useState } from 'react';
import { Button, ButtonProps } from './button';
import { cn } from '@/lib/utils';

interface CelebrationButtonProps extends ButtonProps {
  celebrationEmoji?: string;
  celebrationDuration?: number;
}

export function CelebrationButton({ 
  children, 
  className, 
  onClick,
  celebrationEmoji = '🎉',
  celebrationDuration = 1000,
  ...props 
}: CelebrationButtonProps) {
  const [isCelebrating, setIsCelebrating] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsCelebrating(true);
    
    // Create celebration effect
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Create floating emoji
    const celebration = document.createElement('div');
    celebration.textContent = celebrationEmoji;
    celebration.style.position = 'absolute';
    celebration.style.left = `${x}px`;
    celebration.style.top = `${y}px`;
    celebration.style.fontSize = '1.5rem';
    celebration.style.pointerEvents = 'none';
    celebration.style.zIndex = '1000';
    celebration.style.animation = 'celebrate 1s ease-out forwards';
    
    e.currentTarget.style.position = 'relative';
    e.currentTarget.appendChild(celebration);
    
    setTimeout(() => {
      if (celebration.parentNode) {
        celebration.parentNode.removeChild(celebration);
      }
      setIsCelebrating(false);
    }, celebrationDuration);
    
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Button
      className={cn(
        'rewarding-button bounce-click transition-all duration-300',
        isCelebrating && 'scale-105',
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  );
}