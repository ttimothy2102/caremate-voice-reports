
import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Logo() {
  const navigate = useNavigate();

  return (
    <div 
      className="w-8 h-8 bg-caremate-gradient rounded-full cursor-pointer hover:opacity-80 transition-opacity"
      onClick={() => navigate('/')}
      title="Zurück zur Startseite"
    />
  );
}
