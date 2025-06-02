
import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { WeeklyCalendar } from '@/components/calendar/WeeklyCalendar';
import { useAuth } from '@/hooks/useAuth';
import { Logo } from '@/components/layout/Logo';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getPersonalizedGreeting } from '@/utils/greetingUtils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AccountManagement } from "@/components/account/AccountManagement";

function ScheduleContent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAccountManagement, setShowAccountManagement] = useState(false);

  const userName = user?.user_metadata?.full_name;
  const greeting = getPersonalizedGreeting(userName);

  const userInitials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((name: string) => name[0]).join('').toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/mobile-home')}
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
              {greeting}
            </span>
            <Avatar 
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setShowAccountManagement(true)}
            >
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <Logo />
          </div>
        </div>
      </header>

      <div className="p-6">
        <WeeklyCalendar />
      </div>

      <AccountManagement 
        open={showAccountManagement}
        onOpenChange={setShowAccountManagement}
      />
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
