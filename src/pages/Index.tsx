
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, Users, Heart, FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Mic,
      title: "Voice-to-Report AI",
      description: "Transform spoken observations into structured care reports instantly"
    },
    {
      icon: Heart,
      title: "Vital Signs Integration",
      description: "Real-time monitoring with wearable devices like Fitbit and Apple Watch"
    },
    {
      icon: FileText,
      title: "Smart Documentation",
      description: "Automated shift handovers and comprehensive care tracking"
    },
    {
      icon: Users,
      title: "Resident Management",
      description: "Complete oversight of all residents with quality assurance tools"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-caremate-gradient text-white">
        <div className="container mx-auto px-6 py-16 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">
              CareMate
            </h1>
            <p className="text-xl mb-2 text-blue-100">
              YOUR PERFECT FIT, YOUR EVERYDAY STYLE
            </p>
            <p className="text-lg mb-8 text-blue-100">
              The all-in-one AI documentation and monitoring platform for elderly care homes
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-primary hover:bg-gray-100 px-8 py-3"
                onClick={() => navigate('/mobile-home')}
              >
                <Mic className="w-5 h-5 mr-2" />
                Mobile App (Caregivers)
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary px-8 py-3"
                onClick={() => navigate('/dashboard')}
              >
                <Users className="w-5 h-5 mr-2" />
                Web Dashboard (Management)
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Revolutionizing Elderly Care Documentation
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Speed, accuracy, and compassion combined in one intelligent platform designed specifically for care home professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-caremate-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* USP Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Why CareMate is Different
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">AI-Generated Reports</h3>
                    <p className="text-gray-600">Voice observations automatically become structured, professional care reports</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Real Wearable Integration</h3>
                    <p className="text-gray-600">Direct connection to Fitbit, Apple Watch, and other health monitoring devices</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Mobile-First + Web Overview</h3>
                    <p className="text-gray-600">Designed for both daily caregiving and management oversight</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Daily Summary Generator</h3>
                    <p className="text-gray-600">Automated shift handovers with AI-powered care summaries</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">GDPR Compliant</h3>
                    <p className="text-gray-600">Built with European privacy standards and healthcare compliance in mind</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Speed & Efficiency</h3>
                    <p className="text-gray-600">Minimal clicks, large buttons, designed for busy healthcare professionals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-caremate-gradient text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Care Documentation?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Experience the future of elderly care management today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 px-8 py-3"
              onClick={() => navigate('/mobile-home')}
            >
              Try Mobile App
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary px-8 py-3"
              onClick={() => navigate('/dashboard')}
            >
              View Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">
            © 2024 CareMate. GDPR Compliant Healthcare Technology.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
