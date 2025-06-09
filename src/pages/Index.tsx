
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { HomeHeader } from '@/components/home/HomeHeader';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { DashboardPreview } from '@/components/home/DashboardPreview';
import { PricingSection } from '@/components/home/PricingSection';
import { ContactSection } from '@/components/home/ContactSection';
import { CTASection } from '@/components/home/CTASection';
import { HomeFooter } from '@/components/home/HomeFooter';
import { LiquidGradientStyles } from '@/components/ui/liquid-gradient-styles';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <HomeHeader />
      <div data-scroll-animation>
        <HeroSection />
      </div>
      <div data-scroll-animation>
        <FeaturesSection />
      </div>
      <div data-scroll-animation>
        <DashboardPreview />
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
    </div>
  );
};

export default Index;
