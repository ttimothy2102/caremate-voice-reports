
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

export function Logo() {
  const navigate = useNavigate();

  return (
    <Heart 
      className="w-8 h-8 text-primary cursor-pointer hover:opacity-80 transition-opacity"
      onClick={() => navigate('/')}
      title="Zurück zur Startseite"
    />
  );
}
