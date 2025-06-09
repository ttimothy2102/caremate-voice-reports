
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function PricingSection() {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Starter",
      price: "$49",
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
      price: "$99",
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
    <section id="pricing" className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h3 className="text-4xl font-bold text-gray-900 mb-4">
          Simple, transparent pricing
        </h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose the perfect plan for your care facility. All plans include a 14-day free trial.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <Card key={index} className={`relative p-8 ${plan.popular ? 'border-2 border-blue-500 shadow-xl scale-105' : 'border-0'} bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300`}>
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Most Popular
                </div>
              </div>
            )}
            
            <div className="text-center mb-8">
              <h4 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h4>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              <div className="flex items-baseline justify-center">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-600 ml-2">/{plan.period}</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <Button 
              className={`w-full ${plan.popular ? 'liquid-gradient-button text-white border-0' : 'border-2 border-gray-200 hover:border-blue-500'}`}
              variant={plan.popular ? 'default' : 'outline'}
              onClick={() => navigate('/auth')}
            >
              {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
            </Button>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-gray-600 mb-4">
          All plans include a 14-day free trial. No credit card required.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            HIPAA Compliant
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            99.9% Uptime SLA
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            24/7 Support
          </div>
        </div>
      </div>
    </section>
  );
}
