
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { Logo } from './Logo';

interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  onTitleClick?: () => void;
}

export function MobileHeader({ title, showBack, onBack, onTitleClick }: MobileHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <h1 
            className={`text-xl font-bold bg-caremate-gradient bg-clip-text text-transparent ${
              onTitleClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
            }`}
            onClick={onTitleClick}
          >
            {title}
          </h1>
        </div>
        <Logo />
      </div>
    </header>
  );
}
