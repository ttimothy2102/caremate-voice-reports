
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CareMateLogoSvg } from "@/components/ui/CareMateLogoSvg";

export function Logo() {
  const navigate = useNavigate();

  return (
    <div 
      className="cursor-pointer hover:opacity-80 transition-opacity"
      onClick={() => navigate('/')}
      title="Zurück zur Startseite"
    >
      <CareMateLogoSvg width={90} height={24} />
    </div>
  );
}
