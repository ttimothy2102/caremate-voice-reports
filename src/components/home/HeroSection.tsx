
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-5xl font-bold text-gray-900 leading-tight">
            Intelligente Pflege
            <span className="block bg-caremate-gradient bg-clip-text text-transparent">
              mit KI-Unterstützung
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Revolutionieren Sie Ihre Pflegedokumentation mit KI-gestützter Sprachtranskription 
            und intelligenter Berichtserstellung für Pflegeheime.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="liquid-gradient-button text-white border-0 relative overflow-hidden transition-all duration-300 hover:shadow-lg text-lg px-8 py-6"
            onClick={() => navigate('/auth')}
          >
            Kostenlos starten
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="text-lg px-8 py-6"
            onClick={() => navigate('/dashboard')}
          >
            Demo ansehen
          </Button>
        </div>
      </div>
    </section>
  );
}
