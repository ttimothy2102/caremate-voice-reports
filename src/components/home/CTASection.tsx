
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="bg-caremate-gradient text-white py-12 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
      <div className="relative max-w-4xl mx-auto text-center px-6">
        <div className="mb-4 md:mb-6">
          <div className="flex justify-center items-center gap-1 mb-2 md:mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-sm md:text-lg text-blue-100">
            "CareMate has transformed our documentation process. We save hours every day!" 
            <span className="block mt-1 md:mt-2 text-xs md:text-sm opacity-80">— Sarah M., Director of Nursing</span>
          </p>
        </div>
        
        <h3 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">
          Ready to revolutionize your care documentation?
        </h3>
        <p className="text-sm md:text-xl text-blue-100 mb-6 md:mb-8 leading-relaxed">
          Join hundreds of care facilities already using CareMate to improve efficiency, 
          reduce documentation burden, and enhance care quality.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="cursor-tracking-button-inverse text-primary border-0 relative overflow-hidden transition-all duration-300 hover:shadow-lg text-sm md:text-lg px-6 py-4 md:px-8 md:py-6 w-full sm:w-auto"
            onClick={() => navigate('/auth')}
          >
            Start Your Free Trial
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white text-sm md:text-lg px-6 py-4 md:px-8 md:py-6 w-full sm:w-auto"
            onClick={() => navigate('/demo')}
          >
            View Demo
          </Button>
        </div>
        
        <div className="mt-4 md:mt-8 text-blue-100 text-xs md:text-sm">
          ✓ 14-day free trial  ✓ Credit card required  ✓ GDPR compliant
        </div>
      </div>
    </section>
  );
}
