import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Users, Clock, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export function CTASection() {
  const navigate = useNavigate();
  const benefits = [{
    icon: Users,
    text: "Priority access to new features"
  }, {
    icon: Clock,
    text: "Free implementation support"
  }, {
    icon: Shield,
    text: "Exclusive pricing for early adopters"
  }];
  return <section className="bg-caremate-gradient text-white py-12 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
      <div className="relative max-w-4xl mx-auto text-center px-6">
        
        
        <h3 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">
          Ready to join the care revolution?
        </h3>
        <p className="text-sm md:text-xl text-blue-100 mb-6 md:mb-8 leading-relaxed">
          Be among the first care facilities to experience CareMate. Join our waitlist for early access, 
          exclusive pricing, and personalized onboarding support.
        </p>

        {/* Waitlist Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {benefits.map((benefit, index) => <div key={index} className="flex items-center gap-3 text-blue-100 text-sm">
              <benefit.icon className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              <span>{benefit.text}</span>
            </div>)}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
          <Button size="lg" className="cursor-tracking-button-inverse text-primary border-0 relative overflow-hidden transition-all duration-300 hover:shadow-lg text-sm md:text-lg px-6 py-4 md:px-8 md:py-6 w-full sm:w-auto" onClick={() => {
          const element = document.getElementById('waitlist-form');
          element?.scrollIntoView({
            behavior: 'smooth'
          });
        }}>
            Join Waitlist - Get Early Access
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
          </Button>
          <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white text-sm md:text-lg px-6 py-4 md:px-8 md:py-6 w-full sm:w-auto" onClick={() => navigate('/demo')}>
            Try Demo First
          </Button>
        </div>
        
        <div className="mt-4 md:mt-8 text-blue-100 text-xs md:text-sm">
          ✓ No commitment required  ✓ Priority support included  ✓ GDPR compliant
        </div>
      </div>
    </section>;
}