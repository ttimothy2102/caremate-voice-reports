
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
      title: "HIPAA Compliant",
      description: "Enterprise-grade security with full HIPAA compliance and data encryption",
      benefit: "Complete data protection"
    }
  ];

  return (
    <section id="features" className="max-w-7xl mx-auto px-6 py-20 bg-white/40 backdrop-blur-sm rounded-3xl my-20">
      <div className="text-center mb-16">
        <h3 className="text-4xl font-bold text-gray-900 mb-4">
          Everything you need for modern elder care
        </h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          CareMate combines cutting-edge AI technology with intuitive design 
          for comprehensive care facility management.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm group hover:-translate-y-2">
            <div className="space-y-4">
              <div className="w-14 h-14 bg-caremate-gradient rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-semibold text-gray-900">{feature.title}</h4>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                <div className="inline-flex items-center gap-2 text-sm font-medium text-blue-600">
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
