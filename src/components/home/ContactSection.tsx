
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    toast({
      title: "Message sent!",
      description: "Thank you for your inquiry. We'll get back to you within 24 hours.",
    });
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  return (
    <section id="contact" className="max-w-7xl mx-auto px-6 py-12 md:py-20">
      <div className="text-center mb-8 md:mb-16">
        <h3 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
          Get in touch with our team
        </h3>
        <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto">
          Ready to transform your care facility? Contact us for a personalized demo and consultation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
        <div className="space-y-4 md:space-y-8">
          <Card className="p-4 md:p-8 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <h4 className="text-lg md:text-2xl font-bold text-gray-900 mb-3 md:mb-6">Let's discuss your needs</h4>
            
            <div className="space-y-3 md:space-y-6">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
                </div>
                <div>
                  <h5 className="text-sm md:text-base font-semibold text-gray-900">Email</h5>
                  <p className="text-sm md:text-base text-gray-600">contact@caremate.at</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Phone className="w-4 h-4 md:w-6 md:h-6 text-green-600" />
                </div>
                <div>
                  <h5 className="text-sm md:text-base font-semibold text-gray-900">Phone</h5>
                  <p className="text-sm md:text-base text-gray-600">+43 660 7906521</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 md:w-6 md:h-6 text-purple-600" />
                </div>
                <div>
                  <h5 className="text-sm md:text-base font-semibold text-gray-900">Office</h5>
                  <p className="text-sm md:text-base text-gray-600">Parkring 12, 1010 Vienna, Austria</p>
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-8 p-3 md:p-4 bg-blue-50 rounded-lg">
              <h5 className="text-sm md:text-base font-semibold text-blue-900 mb-1 md:mb-2">Enterprise Solutions</h5>
              <p className="text-xs md:text-sm text-blue-700">
                Need custom features or have specific compliance requirements? 
                Our enterprise team can create a tailored solution for your organization.
              </p>
            </div>
          </Card>
        </div>

        <Card className="p-4 md:p-8 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label htmlFor="name" className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                  Full Name *
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                  className="text-sm md:text-base"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                  Email Address *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email"
                  className="text-sm md:text-base"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="company" className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                Company/Organization
              </label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="Enter your company name"
                className="text-sm md:text-base"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                Message *
              </label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                placeholder="Tell us about your care facility and how we can help..."
                rows={4}
                className="text-sm md:text-base"
              />
            </div>
            
            <Button 
              type="submit"
              className="w-full cursor-tracking-button text-white border-0 relative overflow-hidden transition-all duration-300 hover:shadow-lg text-sm md:text-base"
            >
              Send Message
              <Send className="w-3 h-3 md:w-4 md:h-4 ml-2" />
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}
