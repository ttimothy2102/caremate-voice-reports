
import React from 'react';
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

  if (user) {
    navigate('/mobile-home');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <HomeHeader />
      <HeroSection />
      <FeaturesSection />
      <DashboardPreview />
      <PricingSection />
      <ContactSection />
      <CTASection />
      <HomeFooter />
      <LiquidGradientStyles />
    </div>
  );
};

export default Index;
