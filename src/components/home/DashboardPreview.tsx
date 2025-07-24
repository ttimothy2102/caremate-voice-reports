
import React, { useEffect, useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CelebrationButton } from "@/components/ui/celebration-button";
import { InteractiveCounter } from "@/components/ui/interactive-counter";
import { ArrowRight, BarChart3, Users, Calendar, Heart, Mic, Play, CheckCircle, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CountUpNumber = ({ end, duration = 2000, isVisible }: { end: number; duration?: number; isVisible: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    
    let startTime: number;
    const startValue = 0;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const currentCount = Math.floor(progress * (end - startValue) + startValue);
      setCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, duration, isVisible]);

  return <span>{count}</span>;
};

export function DashboardPreview() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    { label: "Active Residents", value: 127, icon: Users, color: "text-blue-600", change: "+12% this month" },
    { label: "Daily Reports", value: 23, icon: BarChart3, color: "text-green-600", change: "Real-time updates" },
    { label: "Scheduled Tasks", value: 45, icon: Calendar, color: "text-purple-600", change: "Auto-generated" },
    { label: "Health Alerts", value: 3, icon: Heart, color: "text-red-600", change: "Urgent attention" }
  ];

  const features = [
    {
      id: 'voice',
      title: 'Voice Documentation',
      description: 'Record care notes with AI transcription',
      icon: Mic,
      benefit: '70% faster documentation'
    },
    {
      id: 'residents',
      title: 'Smart Resident Profiles',
      description: 'Comprehensive care information at your fingertips',
      icon: Users,
      benefit: 'Complete care history'
    },
    {
      id: 'vitals',
      title: 'Real-time Health Monitoring',
      description: 'Automated vital signs tracking and alerts',
      icon: Heart,
      benefit: 'Prevent health incidents'
    }
  ];

  const handleFeatureDemo = (featureId: string) => {
    setActiveDemo(featureId);
    setTimeout(() => setActiveDemo(null), 3000);
  };

  return (
    <section ref={sectionRef} id="dashboard-preview" className="max-w-7xl mx-auto px-6 py-8 md:py-12 opacity-0 animate-fade-in">
      <div className="text-center mb-6 md:mb-12">
        <h3 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3">
          See CareMate in Action
        </h3>
        <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto mb-4 md:mb-6">
          Experience our live dashboard that transforms care documentation from hours of paperwork 
          into simple voice commands and intelligent automation.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
          <CelebrationButton 
            onClick={() => navigate('/demo')}
            className="liquid-gradient-button text-white border-0 relative overflow-hidden transition-all duration-300 hover:shadow-lg text-sm md:text-base px-6 py-3 md:px-8 md:py-4 pulse-ring"
            celebrationEmoji="⚡"
          >
            <Zap className="w-4 h-4 mr-2" />
            Try Interactive Demo
            <ArrowRight className="w-4 h-4 ml-2" />
          </CelebrationButton>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500" />
            No signup required
          </div>
        </div>
      </div>

      <div className="relative">
        <Card className="p-3 md:p-6 bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
          <div className="space-y-3 md:space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base md:text-xl font-bold text-primary">
                  CareMate Dashboard
                </h4>
                <p className="text-xs md:text-sm text-gray-600">Live Demo Environment</p>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Live Data
              </div>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="stagger-child bg-gradient-to-br from-gray-50 to-white rounded-lg p-3 md:p-4 hover:shadow-md transition-all duration-300 border border-gray-100 playful-card">
                  <div className="flex items-center justify-between mb-1 md:mb-2">
                    <stat.icon className={`w-4 h-4 md:w-6 md:h-6 ${stat.color}`} />
                    <span className="text-lg md:text-2xl font-bold text-gray-800">
                      <InteractiveCounter end={stat.value} />
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 font-medium">{stat.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
              ))}
            </div>

            {/* Interactive Chart Preview */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 md:p-6 h-32 md:h-48 flex items-center justify-center border border-gray-100">
              <div className="text-center">
                <BarChart3 className="w-8 h-8 md:w-12 md:h-12 text-primary mx-auto mb-2 md:mb-3" />
                <p className="text-sm md:text-base font-semibold text-gray-700 mb-1">Real-time Analytics</p>
                <p className="text-xs md:text-sm text-gray-500">Track care quality, medication compliance, and resident satisfaction</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3 text-xs"
                  onClick={() => navigate('/demo')}
                >
                  View Full Analytics
                </Button>
              </div>
            </div>

            {/* Interactive Features Demo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 pt-4 md:pt-6 border-t">
              {features.map((feature, index) => (
                <div 
                  key={feature.id}
                  className={`stagger-child text-center p-4 rounded-lg transition-all duration-300 cursor-pointer playful-card ${
                    activeDemo === feature.id 
                      ? 'bg-blue-50 border-2 border-blue-200 scale-105 celebration' 
                      : 'hover:bg-gray-50 border border-gray-100'
                  }`}
                  onClick={() => handleFeatureDemo(feature.id)}
                >
                  <div className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3 transition-all duration-300 ${
                    activeDemo === feature.id 
                      ? 'bg-blue-500 scale-110' 
                      : 'bg-blue-100'
                  }`}>
                    <feature.icon className={`w-4 h-4 md:w-6 md:h-6 ${
                      activeDemo === feature.id ? 'text-white' : 'text-blue-600'
                    }`} />
                  </div>
                  <h5 className="text-sm md:text-base font-semibold text-gray-800 mb-1 md:mb-2">{feature.title}</h5>
                  <p className="text-xs md:text-sm text-gray-600 mb-2">{feature.description}</p>
                  <div className="text-xs font-medium text-green-600 bg-green-50 rounded-full px-2 py-1 inline-block">
                    {feature.benefit}
                  </div>
                  {activeDemo === feature.id && (
                    <div className="mt-2 text-xs text-blue-600 font-medium">
                      ✓ Demo activated! Click "Try Interactive Demo" above
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 md:p-6 text-center border border-blue-100">
              <h5 className="text-lg font-semibold text-gray-800 mb-2">Ready to revolutionize your care facility?</h5>
              <p className="text-sm text-gray-600 mb-4">Join 200+ facilities already using CareMate to improve care quality and reduce documentation time.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={() => navigate('/demo')}
                  className="liquid-gradient-button text-white border-0"
                >
                  Try Full Demo
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    const element = document.getElementById('waitlist-form');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Join Waitlist
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
