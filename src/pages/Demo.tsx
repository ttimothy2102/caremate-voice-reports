import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Users, FileText, BarChart3, Heart } from 'lucide-react';
import { CareMateLogoSvg } from "@/components/ui/CareMateLogoSvg";

const Demo = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: "Resident Management",
      description: "Comprehensive resident profiles with medical history and care plans"
    },
    {
      icon: FileText,
      title: "Smart Documentation",
      description: "AI-powered voice transcription for efficient care notes"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Real-time insights and reporting for better care outcomes"
    },
    {
      icon: Heart,
      title: "Health Monitoring",
      description: "Continuous vital signs tracking and automated alerts"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <CareMateLogoSvg />
            <span className="text-lg font-semibold text-gray-700">Demo</span>
          </div>
          <Button 
            onClick={() => navigate('/auth')}
            className="bg-caremate-gradient text-white border-0"
          >
            Start Free Trial
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Experience CareMate Dashboard
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Watch our comprehensive demo video and explore the interactive dashboard features 
            that are transforming elderly care documentation.
          </p>
        </div>

        {/* Video Section */}
        <Card className="p-8 mb-12 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-white ml-1" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                CareMate Platform Overview
              </h3>
              <p className="text-gray-600 mb-4">
                Complete walkthrough of all features and capabilities
              </p>
              <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 text-yellow-800 text-sm">
                YouTube Video Placeholder - Demo video will be embedded here
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Button 
              onClick={() => navigate('/dashboard')}
              className="cursor-tracking-button text-white border-0 mr-4"
            >
              Try Interactive Demo
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/auth')}
            >
              Start Your Free Trial
            </Button>
          </div>
        </Card>

        {/* Dashboard Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-caremate-gradient rounded-xl flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Interactive Dashboard Preview */}
        <Card className="p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Interactive Dashboard Preview
            </h3>
            <p className="text-gray-600">
              Click below to explore our live dashboard with sample data
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">127</div>
              <div className="text-sm text-gray-600">Active Residents</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">23</div>
              <div className="text-sm text-gray-600">Today's Reports</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">45</div>
              <div className="text-sm text-gray-600">Scheduled Tasks</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">3</div>
              <div className="text-sm text-gray-600">Vital Alerts</div>
            </div>
          </div>
          
          <div className="text-center">
            <Button 
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="cursor-tracking-button text-white border-0"
            >
              Launch Interactive Demo
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Demo;
