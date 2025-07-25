
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';

export function HomeFooter() {
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate('/')}
            >
              <Heart className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold">CareMate</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Transforming elderly care with AI-powered documentation and comprehensive facility management.
            </p>
            <a 
              href="mailto:contact@caremate.com"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span className="text-sm">contact@caremate.com</span>
            </a>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Product</h4>
            <div className="space-y-2">
              <button onClick={() => scrollToSection('features')} className="block text-gray-400 hover:text-white transition-colors text-left">
                Features
              </button>
              <button onClick={() => scrollToSection('dashboard-preview')} className="block text-gray-400 hover:text-white transition-colors text-left">
                Dashboard
              </button>
              <button onClick={() => scrollToSection('pricing')} className="block text-gray-400 hover:text-white transition-colors text-left">
                Pricing
              </button>
              <button onClick={() => navigate('/demo')} className="block text-gray-400 hover:text-white transition-colors text-left">
                Demo
              </button>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Company</h4>
            <div className="space-y-2">
              <button onClick={() => navigate('/about')} className="block text-gray-400 hover:text-white transition-colors text-left">About Us</button>
              <button onClick={() => navigate('/careers')} className="block text-gray-400 hover:text-white transition-colors text-left">Careers</button>
              <button onClick={() => navigate('/blog')} className="block text-gray-400 hover:text-white transition-colors text-left">Blog</button>
              <button onClick={() => navigate('/contact')} className="block text-gray-400 hover:text-white transition-colors text-left">
                Contact
              </button>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Legal</h4>
            <div className="space-y-2">
              <button onClick={() => navigate('/privacy')} className="block text-gray-400 hover:text-white transition-colors text-left">Privacy Policy</button>
              <button onClick={() => navigate('/terms')} className="block text-gray-400 hover:text-white transition-colors text-left">Terms of Service</button>
              <button onClick={() => navigate('/gdpr')} className="block text-gray-400 hover:text-white transition-colors text-left">GDPR Compliance</button>
              <button onClick={() => navigate('/security')} className="block text-gray-400 hover:text-white transition-colors text-left">Security</button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 CareMate. All rights reserved.
          </p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              All systems operational
            </div>
            <div className="text-sm text-gray-400">
              SOC 2 Type II Certified
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
