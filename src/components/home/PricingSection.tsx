
import React, { useEffect, useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CelebrationButton } from "@/components/ui/celebration-button";
import { Check, Star, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function PricingSection() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const plans = [
    {
      name: "Starter",
      price: "€49",
      period: "per month",
      description: "Perfect for small care facilities",
      features: [
        "Up to 25 residents",
        "Basic voice transcription",
        "Standard reporting",
        "Email support",
        "Mobile app access"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "€99",
      period: "per month",
      description: "Ideal for growing care facilities",
      features: [
        "Up to 100 residents",
        "Advanced AI transcription",
        "Custom reporting",
        "Priority support",
        "API access",
        "Advanced analytics",
        "Integration support"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For large healthcare organizations",
      features: [
        "Unlimited residents",
        "White-label solution",
        "Custom integrations",
        "24/7 dedicated support",
        "On-premise deployment",
        "Advanced security",
        "Training & onboarding"
      ],
      popular: false
    }
  ];

  return (
    <section ref={sectionRef} id="pricing" className={`max-w-7xl mx-auto px-6 py-12 md:py-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="text-center mb-8 md:mb-16">
        <h3 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
          Simple, transparent pricing
        </h3>
        <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto">
          Choose the perfect plan for your care facility. All plans include a 14-day free trial with credit card required.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
        {plans.map((plan, index) => (
          <Card key={index} className={`relative p-4 md:p-8 ${plan.popular ? 'border-2 border-blue-500 shadow-xl' : 'border'} bg-white hover:shadow-lg transition-all duration-300 ${isVisible ? 'animate-fade-in' : ''}`} style={{ animationDelay: `${index * 0.2}s` }}>
            {plan.popular && (
              <div className="absolute -top-3 md:-top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-blue-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium flex items-center gap-2 whitespace-nowrap">
                  <Star className="w-3 h-3 md:w-4 md:h-4" />
                  Most Popular
                </div>
              </div>
            )}
            
            <div className="text-center mb-4 md:mb-8">
              <h4 className="text-lg md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">{plan.name}</h4>
              <p className="text-sm md:text-base text-gray-600 mb-2 md:mb-4">{plan.description}</p>
              <div className="flex items-baseline justify-center">
                <span className="text-2xl md:text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-sm md:text-base text-gray-600 ml-2">/{plan.period}</span>
              </div>
            </div>

            <div className="space-y-2 md:space-y-4 mb-4 md:mb-8">
              {plan.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-center gap-2 md:gap-3">
                  <Check className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm md:text-base text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {plan.popular ? (
              <CelebrationButton 
                className="w-full text-sm md:text-base bg-blue-500 hover:bg-blue-600 text-white border-0"
                onClick={() => navigate('/auth')}
                celebrationEmoji="👑"
              >
                <Crown className="w-4 h-4 mr-2" />
                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
              </CelebrationButton>
            ) : (
              <Button 
                className="w-full text-sm md:text-base"
                variant="outline"
                onClick={() => navigate('/auth')}
              >
                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
              </Button>
            )}
          </Card>
        ))}
      </div>

      <div className="text-center mt-8 md:mt-12">
        <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
          All plans include a 14-day free trial. Credit card required for subscription.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-xs md:text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Check className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
            GDPR Compliant
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
            EU Data Protection
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
            99.9% Uptime SLA
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
            24/7 Support
          </div>
        </div>
      </div>
    </section>
  );
}
