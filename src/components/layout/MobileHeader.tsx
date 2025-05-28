
import React from 'react';
import { ArrowLeft, Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export function MobileHeader({ title, showBack = false, onBack, rightAction }: MobileHeaderProps) {
  return (
    <header className="bg-caremate-gradient text-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showBack && (
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-2"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      {rightAction || (
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 p-2"
        >
          <Bell className="w-5 h-5" />
        </Button>
      )}
    </header>
  );
}
