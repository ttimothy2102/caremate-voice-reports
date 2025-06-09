
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

export function Logo() {
  const navigate = useNavigate();

  return (
    <div 
      className="cursor-pointer hover:opacity-80 transition-opacity"
      onClick={() => navigate('/')}
      title="Zurück zur Startseite"
    >
      <Heart className="w-8 h-8 text-primary" />
    </div>
  );
}
