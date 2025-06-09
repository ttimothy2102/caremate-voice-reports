
import React from 'react';
import { HomeHeader } from '@/components/home/HomeHeader';
import { HomeFooter } from '@/components/home/HomeFooter';

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <HomeHeader />
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About CareMate</h1>
          <p className="text-lg text-gray-600">
            Content coming soon...
          </p>
        </div>
      </div>
      <HomeFooter />
    </div>
  );
}
