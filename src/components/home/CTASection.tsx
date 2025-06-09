
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="bg-caremate-gradient text-white py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
      <div className="relative max-w-4xl mx-auto text-center px-6">
        <div className="mb-6">
          <div className="flex justify-center items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-blue-100 text-lg">
            "CareMate has transformed our documentation process. We save hours every day!" 
            <span className="block mt-2 text-sm opacity-80">— Sarah M., Director of Nursing</span>
          </p>
        </div>
        
        <h3 className="text-4xl font-bold mb-4">
          Ready to revolutionize your care documentation?
        </h3>
        <p className="text-xl text-blue-100 mb-8 leading-relaxed">
          Join hundreds of care facilities already using CareMate to improve efficiency, 
          reduce documentation burden, and enhance care quality.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="liquid-gradient-button-inverse text-primary border-0 relative overflow-hidden transition-all duration-300 hover:shadow-lg text-lg px-8 py-6"
            onClick={() => navigate('/auth')}
          >
            Start Your Free Trial
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-gray-900 text-lg px-8 py-6"
            onClick={() => navigate('/dashboard')}
          >
            View Demo
          </Button>
        </div>
        
        <div className="mt-8 text-blue-100 text-sm">
          ✓ 14-day free trial  ✓ No credit card required  ✓ HIPAA compliant
        </div>
      </div>
    </section>
  );
}
