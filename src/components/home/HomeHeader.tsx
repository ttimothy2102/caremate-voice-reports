
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

export function HomeHeader() {
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Heart className="w-8 h-8 text-primary" />
          <h1 
            className="text-2xl font-bold text-primary cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          >
            CareMate
          </h1>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => scrollToSection('features')}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Features
          </button>
          <button 
            onClick={() => scrollToSection('dashboard-preview')}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Preview
          </button>
          <button 
            onClick={() => scrollToSection('pricing')}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Pricing
          </button>
          <button 
            onClick={() => scrollToSection('contact')}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Contact
          </button>
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate('/auth')}>
            Sign In
          </Button>
          <Button 
            onClick={() => navigate('/auth')} 
            className="liquid-gradient-button text-white border-0 relative overflow-hidden transition-all duration-300 hover:shadow-lg"
          >
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}
