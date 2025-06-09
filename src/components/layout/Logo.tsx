
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

export function Logo() {
  const navigate = useNavigate();

  return (
    <div 
      className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
      onClick={() => navigate('/')}
      title="Zurück zur Startseite"
    >
      <Heart className="w-6 h-6 text-primary" />
      <span className="text-lg font-bold text-primary">CareMate</span>
    </div>
  );
}
