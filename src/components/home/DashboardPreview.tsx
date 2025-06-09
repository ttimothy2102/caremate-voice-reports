
import React, { useEffect, useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Users, Calendar, Heart, Mic } from 'lucide-react';
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
    { label: "Active Residents", value: 127, icon: Users, color: "text-blue-600" },
    { label: "Today's Reports", value: 23, icon: BarChart3, color: "text-green-600" },
    { label: "Scheduled Tasks", value: 45, icon: Calendar, color: "text-purple-600" },
    { label: "Vital Alerts", value: 3, icon: Heart, color: "text-red-600" }
  ];

  return (
    <section ref={sectionRef} id="dashboard-preview" className="max-w-7xl mx-auto px-6 py-8 md:py-12 opacity-0 animate-fade-in">
      <div className="text-center mb-6 md:mb-12">
        <h3 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3">
          See CareMate in action
        </h3>
        <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto mb-4 md:mb-6">
          Get a glimpse of our comprehensive dashboard that puts all care information at your fingertips.
        </p>
        <Button 
          onClick={() => navigate('/demo')}
          className="liquid-gradient-button text-white border-0 relative overflow-hidden transition-all duration-300 hover:shadow-lg text-sm md:text-base px-6 py-3 md:px-8 md:py-4"
        >
          View Live Demo
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <div className="relative">
        <Card className="p-3 md:p-6 bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
          <div className="space-y-3 md:space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base md:text-xl font-bold text-primary">
                  CareMate Dashboard
                </h4>
                <p className="text-xs md:text-sm text-gray-600">Real-time care facility overview</p>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Live Data
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3 md:p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between mb-1 md:mb-2">
                    <stat.icon className={`w-4 h-4 md:w-6 md:h-6 ${stat.color}`} />
                    <span className="text-lg md:text-2xl font-bold text-gray-800">
                      <CountUpNumber end={stat.value} isVisible={isVisible} />
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Compact Chart Placeholder */}
            <div className="bg-gray-50 rounded-lg p-4 md:p-6 h-32 md:h-64 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-8 h-8 md:w-16 md:h-16 text-gray-400 mx-auto mb-2 md:mb-4" />
                <p className="text-sm md:text-base text-gray-500">Interactive charts and analytics</p>
                <p className="text-xs md:text-sm text-gray-400">Track vital signs, medication compliance, and care quality metrics</p>
              </div>
            </div>

            {/* Features List - More compact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 pt-4 md:pt-6 border-t">
              <div className="text-center">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <Mic className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
                </div>
                <h5 className="text-sm md:text-base font-semibold text-gray-800 mb-1 md:mb-2">Voice Documentation</h5>
                <p className="text-xs md:text-sm text-gray-600">Record care notes with AI transcription</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <Users className="w-4 h-4 md:w-6 md:h-6 text-green-600" />
                </div>
                <h5 className="text-sm md:text-base font-semibold text-gray-800 mb-1 md:mb-2">Resident Profiles</h5>
                <p className="text-xs md:text-sm text-gray-600">Comprehensive care information</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <Heart className="w-4 h-4 md:w-6 md:h-6 text-purple-600" />
                </div>
                <h5 className="text-sm md:text-base font-semibold text-gray-800 mb-1 md:mb-2">Health Monitoring</h5>
                <p className="text-xs md:text-sm text-gray-600">Real-time vital signs tracking</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
