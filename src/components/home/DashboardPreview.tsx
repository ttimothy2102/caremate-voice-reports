
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
    <section ref={sectionRef} id="dashboard-preview" className="max-w-7xl mx-auto px-6 py-20 opacity-0 animate-fade-in">
      <div className="text-center mb-16">
        <h3 className="text-4xl font-bold text-gray-900 mb-4">
          See CareMate in action
        </h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Get a glimpse of our comprehensive dashboard that puts all care information at your fingertips.
        </p>
        <Button 
          onClick={() => navigate('/demo')}
          className="liquid-gradient-button text-white border-0 relative overflow-hidden transition-all duration-300 hover:shadow-lg"
        >
          View Live Demo
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <div className="relative">
        <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-2xl font-bold bg-caremate-gradient bg-clip-text text-transparent">
                  CareMate Dashboard
                </h4>
                <p className="text-gray-600">Real-time care facility overview</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Live Data
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    <span className="text-2xl font-bold text-gray-800">
                      <CountUpNumber end={stat.value} isVisible={isVisible} />
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Chart Placeholder */}
            <div className="bg-gray-50 rounded-lg p-6 h-64 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Interactive charts and analytics</p>
                <p className="text-sm text-gray-400">Track vital signs, medication compliance, and care quality metrics</p>
              </div>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mic className="w-6 h-6 text-blue-600" />
                </div>
                <h5 className="font-semibold text-gray-800 mb-2">Voice Documentation</h5>
                <p className="text-sm text-gray-600">Record care notes with AI transcription</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h5 className="font-semibold text-gray-800 mb-2">Resident Profiles</h5>
                <p className="text-sm text-gray-600">Comprehensive care information</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
                <h5 className="font-semibold text-gray-800 mb-2">Health Monitoring</h5>
                <p className="text-sm text-gray-600">Real-time vital signs tracking</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
