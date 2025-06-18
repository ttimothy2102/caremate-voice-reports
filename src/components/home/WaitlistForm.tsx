
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Mail, Building, User, CheckCircle } from 'lucide-react';
import { useWaitlist } from '@/hooks/useWaitlist';

export function WaitlistForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    facilityName: '',
    facilitySize: '',
    phoneNumber: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { submitToWaitlist, isLoading } = useWaitlist();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await submitToWaitlist(formData);
    
    if (result.success) {
      setIsSubmitted(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isSubmitted) {
    return (
      <Card className="p-8 bg-green-50 border-green-200">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-800 mb-2">You're on the list!</h3>
          <p className="text-green-600">
            Thank you for your interest in CareMate. We'll contact you soon with early access details 
            and a personalized demo for your facility.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 md:p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Join the CareMate Waitlist
        </h3>
        <p className="text-gray-600">
          Be among the first to experience the future of care documentation. 
          Get priority access and a free consultation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name *
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className="border-gray-300 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="border-gray-300 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="facilityName" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            Care Facility Name *
          </Label>
          <Input
            id="facilityName"
            name="facilityName"
            type="text"
            required
            value={formData.facilityName}
            onChange={handleInputChange}
            placeholder="Enter your facility name"
            className="border-gray-300 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="facilitySize">Number of Residents</Label>
            <select
              id="facilitySize"
              name="facilitySize"
              value={formData.facilitySize}
              onChange={handleInputChange}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Select facility size</option>
              <option value="1-25">1-25 residents</option>
              <option value="26-50">26-50 residents</option>
              <option value="51-100">51-100 residents</option>
              <option value="100+">100+ residents</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="(Optional) Your phone"
              className="border-gray-300 focus:border-blue-500"
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full liquid-gradient-button text-white border-0 py-3"
          disabled={isLoading}
        >
          {isLoading ? "Joining..." : "Join Waitlist - Get Early Access"}
        </Button>

        <p className="text-xs text-gray-500 text-center mt-4">
          * Required fields. We respect your privacy and will never share your information.
        </p>
      </form>
    </Card>
  );
}
