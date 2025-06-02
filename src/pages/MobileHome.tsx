
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { Mic, Users, FileText, Heart, Calendar, BarChart3, ClipboardList, Clock, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getPersonalizedGreeting } from '@/utils/greetingUtils';
import { ProtectedRoute } from '@/components/ProtectedRoute';

function MobileHomeContent() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const userName = user?.user_metadata?.full_name;
  const greeting = getPersonalizedGreeting(userName);

  const shortcuts = [
    { icon: Users, label: "Heutige Bewohner", count: 12, href: "/residents", color: "bg-blue-100 text-blue-600" },
    { icon: FileText, label: "Berichte", count: 8, href: "/reports", color: "bg-green-100 text-green-600" },
    { icon: Heart, label: "Vitalwerte", count: 3, href: "/vitals", color: "bg-red-100 text-red-600" },
    { icon: Calendar, label: "Terminplan", count: 5, href: "/schedule", color: "bg-purple-100 text-purple-600" }
  ];

  const quickActions = [
    {
      icon: BarChart3,
      label: "Dashboard",
      description: "Übersicht & Statistiken",
      href: "/dashboard",
      color: "bg-blue-500"
    },
    {
      icon: Calendar,
      label: "Kalender",
      description: "Termine & Aktivitäten",
      href: "/schedule",
      color: "bg-green-500"
    },
    {
      icon: Users,
      label: "Bewohner",
      description: "Bewohnerverwaltung",
      href: "/residents",
      color: "bg-purple-500"
    },
    {
      icon: ClipboardList,
      label: "Schichtwechsel",
      description: "Wichtige Übergabedaten",
      href: "/shift-handover",
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader 
        title="CareMate" 
        onTitleClick={() => navigate('/mobile-home')}
      />
      
      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{greeting}</h2>
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

        {/* Quick Info for Shift Change */}
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800 mb-1">Schichtübergabe</h4>
              <p className="text-sm text-yellow-700">
                3 wichtige Notizen für die nächste Schicht verfügbar
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                onClick={() => navigate('/shift-handover')}
              >
                Jetzt ansehen
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Schnellzugriff</h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Card 
                key={index}
                className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(action.href)}
              >
                <div className="text-center space-y-3">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{action.label}</h4>
                    <p className="text-xs text-gray-600">{action.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Statistics Overview */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Heutige Übersicht</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/residents')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Bewohner hinzufügen
            </Button>
          </div>
          <div className="grid gap-4">
            {shortcuts.map((shortcut, index) => (
              <Card 
                key={index}
                className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(shortcut.href)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${shortcut.color} rounded-lg flex items-center justify-center`}>
                      <shortcut.icon className="w-5 h-5" />
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

export function MobileHome() {
  return (
    <ProtectedRoute>
      <MobileHomeContent />
    </ProtectedRoute>
  );
}
