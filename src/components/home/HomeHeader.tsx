
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

export function HomeHeader() {
  const navigate = useNavigate();

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-caremate-gradient rounded-full"></div>
          <h1 
            className="text-2xl font-bold bg-caremate-gradient bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          >
            CareMate
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate('/auth')}>
            Anmelden
          </Button>
          <Button 
            onClick={() => navigate('/auth')} 
            className="liquid-gradient-button text-white border-0 relative overflow-hidden transition-all duration-300 hover:shadow-lg"
          >
            Registrieren
          </Button>
        </div>
      </div>
    </header>
  );
}
