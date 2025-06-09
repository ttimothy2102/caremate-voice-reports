
import React from 'react';
import { Card } from "@/components/ui/card";
import { Mic, Users, FileText, Heart, Clock, Shield } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: Mic,
      title: "AI Voice Transcription",
      description: "Speak naturally about care observations and let AI create structured reports instantly",
      benefit: "Save 70% documentation time"
    },
    {
      icon: Users,
      title: "Resident Management",
      description: "Comprehensive resident profiles with medical history, care plans, and medication tracking",
      benefit: "Centralized care coordination"
    },
    {
      icon: FileText,
      title: "Smart Reports",
      description: "Auto-generated care reports with structured data for better tracking and compliance",
      benefit: "Improved care quality"
    },
    {
      icon: Heart,
      title: "Vital Signs Monitoring",
      description: "Real-time vital signs tracking with automatic alerts for critical changes",
      benefit: "Proactive health monitoring"
    },
    {
      icon: Clock,
      title: "Schedule Management",
      description: "Intelligent scheduling for medications, appointments, and care activities",
      benefit: "Never miss important care tasks"
    },
    {
      icon: Shield,
      title: "GDPR Compliant",
      description: "Enterprise-grade security with full GDPR compliance and EU data protection",
      benefit: "Complete data protection"
    }
  ];

  return (
    <section id="features" className="max-w-7xl mx-auto px-6 py-12 md:py-20 bg-white/40 backdrop-blur-sm rounded-3xl my-12 md:my-20">
      <div className="text-center mb-8 md:mb-16">
        <h3 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
          Everything you need for modern elder care
        </h3>
        <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto">
          CareMate combines cutting-edge AI technology with intuitive design 
          for comprehensive care facility management.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="p-4 md:p-8 hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm group hover:-translate-y-2 cursor-pointer relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="space-y-2 md:space-y-4 relative z-10">
              <div className="w-10 h-10 md:w-14 md:h-14 bg-caremate-gradient rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <feature.icon className="w-5 h-5 md:w-7 md:h-7 text-white relative z-10" />
              </div>
              <div className="space-y-1 md:space-y-2">
                <h4 className="text-lg md:text-xl font-semibold text-gray-900">{feature.title}</h4>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">{feature.description}</p>
                <div className="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-blue-600">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  {feature.benefit}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
