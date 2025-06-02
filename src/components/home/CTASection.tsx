
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="bg-caremate-gradient text-white py-20">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h3 className="text-3xl font-bold mb-4">
          Bereit für intelligente Pflegedokumentation?
        </h3>
        <p className="text-xl text-blue-100 mb-8">
          Starten Sie noch heute und erleben Sie, wie KI Ihre Pflegearbeit vereinfacht.
        </p>
        <Button 
          size="lg" 
          className="liquid-gradient-button-inverse text-primary border-0 relative overflow-hidden transition-all duration-300 hover:shadow-lg text-lg px-8 py-6"
          onClick={() => navigate('/auth')}
        >
          Jetzt kostenlos testen
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </section>
  );
}
