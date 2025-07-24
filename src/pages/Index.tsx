
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { HomeHeader } from '@/components/home/HomeHeader';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { DashboardPreview } from '@/components/home/DashboardPreview';
import { WaitlistForm } from '@/components/home/WaitlistForm';
import { PricingSection } from '@/components/home/PricingSection';
import { ContactSection } from '@/components/home/ContactSection';
import { CTASection } from '@/components/home/CTASection';
import { HomeFooter } from '@/components/home/HomeFooter';
import { LiquidGradientStyles } from '@/components/ui/liquid-gradient-styles';
import { EnhancedAnimations } from '@/components/ui/enhanced-animations';
import { FloatingNavigation } from '@/components/ui/floating-navigation';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import { ParticleBackground } from '@/components/ui/particle-background';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const sections = [
    { id: 'hero', label: 'Welcome' },
    { id: 'features', label: 'Features' },
    { id: 'dashboard-preview', label: 'Demo' },
    { id: 'waitlist-form', label: 'Waitlist' },
    { id: 'pricing', label: 'Pricing' }
  ];

  useEffect(() => {
    // Add scroll-based animations
    const handleScroll = () => {
      const elements = document.querySelectorAll('[data-scroll-animation]');
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8;
        
        if (isVisible) {
          element.classList.add('animate-fade-in');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (user) {
    navigate('/mobile-home');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
      <ParticleBackground />
      <ScrollProgress />
      <FloatingNavigation sections={sections} />
      
      <HomeHeader />
      <div id="hero" data-scroll-animation>
        <HeroSection />
      </div>
      <div data-scroll-animation>
        <FeaturesSection />
      </div>
      <div data-scroll-animation>
        <DashboardPreview />
      </div>
      <div data-scroll-animation id="waitlist-form" className="max-w-4xl mx-auto px-6 py-12">
        <WaitlistForm />
      </div>
      <div data-scroll-animation>
        <PricingSection />
      </div>
      <div data-scroll-animation>
        <ContactSection />
      </div>
      <div data-scroll-animation>
        <CTASection />
      </div>
      <HomeFooter />
      <LiquidGradientStyles />
      <EnhancedAnimations />
    </div>
  );
};

export default Index;
