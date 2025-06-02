
import React from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { WeeklyCalendar } from '@/components/calendar/WeeklyCalendar';
import { useAuth } from '@/hooks/useAuth';

function ScheduleContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-caremate-gradient bg-clip-text text-transparent">
              Schedule Management
            </h1>
            <p className="text-sm text-gray-600">Manage patient schedules and activities</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              Welcome, {user?.email}
            </span>
            <div className="w-8 h-8 bg-caremate-gradient rounded-full"></div>
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
