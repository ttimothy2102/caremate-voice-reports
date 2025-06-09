
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center space-y-8">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            Trusted by 200+ care facilities worldwide
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            AI-Powered Care
            <span className="block bg-caremate-gradient bg-clip-text text-transparent">
              Documentation Platform
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transform elderly care with intelligent voice transcription, automated reporting, 
            and comprehensive resident management. Reduce documentation time by 70% while improving care quality.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="liquid-gradient-button text-white border-0 relative overflow-hidden transition-all duration-300 hover:shadow-lg text-lg px-8 py-6"
            onClick={() => navigate('/auth')}
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="text-lg px-8 py-6 group"
            onClick={() => navigate('/dashboard')}
          >
            <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            View Demo
          </Button>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 mt-12 opacity-60">
          <div className="text-sm text-gray-500">Trusted by:</div>
          <div className="flex items-center gap-6">
            <div className="w-24 h-8 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">Healthcare+</div>
            <div className="w-24 h-8 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">CareFirst</div>
            <div className="w-24 h-8 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">ElderCare Pro</div>
          </div>
        </div>
      </div>
    </section>
  );
}
