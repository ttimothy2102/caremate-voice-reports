
import React from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { WeeklyCalendar } from '@/components/calendar/WeeklyCalendar';
import { useAuth } from '@/hooks/useAuth';
import { Logo } from '@/components/layout/Logo';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function ScheduleContent() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
            <div>
              <h1 className="text-2xl font-bold bg-caremate-gradient bg-clip-text text-transparent">
                Terminverwaltung
              </h1>
              <p className="text-sm text-gray-600">Verwalten Sie Bewohner-Termine und Aktivitäten</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              Willkommen, {user?.email}
            </span>
            <Logo />
          </div>
        </div>
      </header>

      <div className="p-6">
        <WeeklyCalendar />
      </div>
    </div>
  );
}

export function Schedule() {
  return (
    <ProtectedRoute>
      <ScheduleContent />
    </ProtectedRoute>
  );
}
