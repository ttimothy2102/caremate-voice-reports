
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { Mic, Users, FileText, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function MobileHome() {
  const navigate = useNavigate();

  const shortcuts = [
    { icon: Users, label: "Heutige Bewohner", count: 12, href: "/residents" },
    { icon: FileText, label: "Berichte", count: 8, href: "/reports" },
    { icon: Heart, label: "Vitalwerte", count: 3, href: "/vitals" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader 
        title="CareMate" 
        onTitleClick={() => navigate('/')}
      />
      
      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Guten Morgen!</h2>
          <p className="text-gray-600">Bereit für die Pflegedokumentation Ihrer Bewohner?</p>
        </div>

        {/* Main Action Button */}
        <Card className="p-6 bg-caremate-gradient text-white">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
              <Mic className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Neue Sprachnotiz</h3>
              <p className="text-blue-100 text-sm mb-4">
                Nehmen Sie Ihre Beobachtungen auf und lassen Sie die KI strukturierte Berichte erstellen
              </p>
            </div>
            <Button 
              className="w-full bg-white text-primary hover:bg-gray-100"
              size="lg"
              onClick={() => navigate('/voice-input')}
            >
              Aufnahme starten
            </Button>
          </div>
        </Card>

        {/* Quick Shortcuts */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Schnellzugriff</h3>
          <div className="grid gap-4">
            {shortcuts.map((shortcut, index) => (
              <Card 
                key={index}
                className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(shortcut.href)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <shortcut.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{shortcut.label}</h4>
                      <p className="text-sm text-gray-600">{shortcut.count} Einträge</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-primary">{shortcut.count}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
