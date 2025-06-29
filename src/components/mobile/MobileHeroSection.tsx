
import React from 'react';
import { Mic, Users, Calendar, FileText } from 'lucide-react';

export function MobileHeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
      </div>
      
      <div className="relative px-6 py-12">
        {/* Header Content */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 leading-tight">
            Mobile-First Care
            <span className="block text-blue-200">Documentation Platform</span>
          </h1>
          <p className="text-blue-100 text-lg leading-relaxed max-w-sm mx-auto">
            Designed for caretakers on the go. Streamline your workflow with voice-powered documentation.
          </p>
        </div>

        {/* Phone Mockup */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Hands holding phone illustration */}
            <svg width="280" height="320" viewBox="0 0 280 320" className="drop-shadow-2xl">
              {/* Left Hand */}
              <path
                d="M40 180 C35 175, 30 170, 25 165 C20 160, 15 155, 20 150 C25 145, 35 150, 45 160 L50 170 L55 180 L60 190 L65 200 L70 210 L75 220 L80 230"
                fill="#D4A574"
                stroke="#B8936A"
                strokeWidth="1"
              />
              
              {/* Right Hand */}
              <path
                d="M240 180 C245 175, 250 170, 255 165 C260 160, 265 155, 260 150 C255 145, 245 150, 235 160 L230 170 L225 180 L220 190 L215 200 L210 210 L205 220 L200 230"
                fill="#D4A574"
                stroke="#B8936A"
                strokeWidth="1"
              />

              {/* Phone Frame */}
              <rect
                x="80"
                y="50"
                width="120"
                height="220"
                rx="20"
                fill="#1f2937"
                stroke="#374151"
                strokeWidth="2"
              />
              
              {/* Phone Screen */}
              <rect
                x="88"
                y="65"
                width="104"
                height="190"
                rx="12"
                fill="#ffffff"
              />

              {/* Screen Content - Header */}
              <rect x="88" y="65" width="104" height="35" rx="12" fill="#2563eb" />
              <text x="140" y="85" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">CareMate</text>

              {/* Screen Content - Main Action Button */}
              <circle cx="140" cy="130" r="25" fill="#3b82f6" opacity="0.1" />
              <circle cx="140" cy="130" r="18" fill="#3b82f6" />
              <g transform="translate(132, 122)">
                <Mic size={16} color="white" />
              </g>

              {/* Screen Content - Quick Actions Grid */}
              <rect x="95" y="170" width="20" height="20" rx="4" fill="#e5e7eb" />
              <rect x="120" y="170" width="20" height="20" rx="4" fill="#e5e7eb" />
              <rect x="145" y="170" width="20" height="20" rx="4" fill="#e5e7eb" />
              <rect x="170" y="170" width="20" height="20" rx="4" fill="#e5e7eb" />

              <g transform="translate(99, 174)">
                <Users size={12} color="#6b7280" />
              </g>
              <g transform="translate(124, 174)">
                <Calendar size={12} color="#6b7280" />
              </g>
              <g transform="translate(149, 174)">
                <FileText size={12} color="#6b7280" />
              </g>
              <g transform="translate(174, 174)">
                <Mic size={12} color="#6b7280" />
              </g>

              {/* Screen Content - List Items */}
              <rect x="95" y="200" width="90" height="8" rx="2" fill="#f3f4f6" />
              <rect x="95" y="215" width="75" height="8" rx="2" fill="#f3f4f6" />
              <rect x="95" y="230" width="85" height="8" rx="2" fill="#f3f4f6" />

              {/* Home Indicator */}
              <rect x="125" y="250" width="30" height="3" rx="1.5" fill="#9ca3af" />
            </svg>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-blue-100">Voice Recording</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-blue-100">Resident Management</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-blue-100">Schedule Tracking</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-blue-100">Auto Reports</p>
          </div>
        </div>
      </div>
    </section>
  );
}
