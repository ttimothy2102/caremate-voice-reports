import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export function HeroSection() {
  const navigate = useNavigate();
  return <section className="max-w-7xl mx-auto px-6 py-8 md:py-12">
      <div className="text-center space-y-4 md:space-y-6">
        <div className="space-y-3 md:space-y-4">
          
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            AI-Powered Care
            <span className="block text-primary">
              Documentation Platform
            </span>
          </h2>
          <p className="text-sm md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transform elderly care with intelligent voice transcription, automated reporting, 
            and comprehensive resident management. Reduce documentation time by 70% while improving care quality.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
          <Button size="lg" className="cursor-tracking-button text-white border-0 relative overflow-hidden transition-all duration-300 hover:shadow-lg text-base md:text-lg px-6 py-4 md:px-8 md:py-6 w-full sm:w-auto" onClick={() => navigate('/auth')}>
            Start Free Trial
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
          </Button>
          <Button size="lg" variant="outline" className="text-base md:text-lg px-6 py-4 md:px-8 md:py-6 group w-full sm:w-auto" onClick={() => navigate('/demo')}>
            <Play className="w-4 h-4 md:w-5 md:h-5 mr-2 group-hover:scale-110 transition-transform" />
            View Demo
          </Button>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mt-8 md:mt-12 opacity-60">
          <div className="text-xs md:text-sm text-gray-500">Trusted by:</div>
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-20 h-6 md:w-24 md:h-8 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">Healthcare+</div>
            <div className="w-20 h-6 md:w-24 md:h-8 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">CareFirst</div>
            <div className="w-20 h-6 md:w-24 md:h-8 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">ElderCare Pro</div>
          </div>
        </div>
      </div>
    </section>;
}