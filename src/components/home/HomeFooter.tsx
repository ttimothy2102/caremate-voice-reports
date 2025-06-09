
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

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
              <div className="w-8 h-8 bg-caremate-gradient rounded-full"></div>
              <span className="text-2xl font-bold">CareMate</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Transforming elderly care with AI-powered documentation and comprehensive facility management.
            </p>
            <div className="flex items-center gap-2 text-gray-400">
              <Mail className="w-4 h-4" />
              <span className="text-sm">contact@caremate.com</span>
            </div>
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
              <button onClick={() => navigate('/dashboard')} className="block text-gray-400 hover:text-white transition-colors text-left">
                Demo
              </button>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Company</h4>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">About Us</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Careers</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Blog</a>
              <button onClick={() => scrollToSection('contact')} className="block text-gray-400 hover:text-white transition-colors text-left">
                Contact
              </button>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Legal</h4>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">HIPAA Compliance</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Security</a>
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
