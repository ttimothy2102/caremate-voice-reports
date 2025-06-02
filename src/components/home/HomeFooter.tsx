
import React from 'react';
import { useNavigate } from 'react-router-dom';

export function HomeFooter() {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div 
          className="flex items-center justify-center gap-3 mb-4 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate('/')}
        >
          <div className="w-6 h-6 bg-caremate-gradient rounded-full"></div>
          <span className="text-xl font-semibold">CareMate</span>
        </div>
        <p className="text-gray-400">
          © 2025 CareMate. Alle Rechte vorbehalten.
        </p>
      </div>
    </footer>
  );
}
