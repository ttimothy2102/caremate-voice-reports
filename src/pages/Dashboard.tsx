import React, { useState, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MedicationTracker } from "@/components/medications/MedicationTracker";
import { DrugOrdering } from "@/components/medications/DrugOrdering";
import { WithingsIntegration } from "@/components/withings/WithingsIntegration";
import { ResidentsList } from "@/components/residents/ResidentsList";
import { AddResidentDialog } from "@/components/residents/AddResidentDialog";
import { Plus, AlertTriangle, FileText, Users, Heart, LogOut, Calendar } from 'lucide-react';
import { useResidents } from '@/hooks/useResidents';
import { useCareReports } from '@/hooks/useCareReports';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/layout/Logo';
import { getPersonalizedGreeting } from '@/utils/greetingUtils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AccountManagement } from "@/components/account/AccountManagement";

function DashboardContent() {
  const {
    data: residents = [],
    isLoading: residentsLoading
  } = useResidents();
  const {
    data: careReports = []
  } = useCareReports();
  const {
    signOut,
    user
  } = useAuth();
  const navigate = useNavigate();
  const [showAccountManagement, setShowAccountManagement] = useState(false);
  const [showAddResidentDialog, setShowAddResidentDialog] = useState(false);
  const userName = user?.user_metadata?.full_name;
  const greeting = getPersonalizedGreeting(userName);
  const userInitials = user?.user_metadata?.full_name ? user.user_metadata.full_name.split(' ').map((name: string) => name[0]).join('').toUpperCase() : user?.email?.[0]?.toUpperCase() || 'U';
  
  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Abgemeldet",
      description: "Sie wurden erfolgreich abgemeldet."
    });
  };

  // Reordered stats with functional navigation
  const overviewStats = [
    {
      title: "Aktive Bewohner",
      value: residents.length.toString(),
      icon: Users,
      color: "text-green-600",
      onClick: () => navigate('/residents')
    },
    {
      title: "Berichte heute",
      value: careReports.filter(r => new Date(r.created_at).toDateString() === new Date().toDateString()).length.toString(),
      icon: FileText,
      color: "text-blue-600",
      onClick: () => navigate('/todays-reports')
    },
    {
      title: "Vital-Alarme",
      value: "3",
      icon: AlertTriangle,
      color: "text-red-600"
    },
    {
      title: "Gerätesync",
      value: "98%",
      icon: Heart,
      color: "text-purple-600"
    }
  ];

  if (residentsLoading) {
    return <div className="min-h-screen liquid-gradient-bg flex items-center justify-center">
        <div className="text-center glass-card p-8 rounded-xl floating-element">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Dashboard wird geladen...</p>
        </div>
      </div>;
  }

  return <div className="min-h-screen liquid-gradient-bg">
      {/* Header */}
      <header className="glass-header px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="cursor-pointer hover:opacity-80 transition-opacity floating-element" onClick={() => navigate('/mobile-home')}>
            <h1 className="text-2xl font-bold bg-caremate-gradient bg-clip-text text-transparent">
              CareMate
            </h1>
            <p className="text-sm text-gray-600">Management Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {greeting}
            </span>
            
            <Button variant="glass" size="sm" onClick={() => navigate('/schedule')}>
              <Calendar className="w-4 h-4 mr-2" />
              Terminplan
            </Button>
            <Button variant="glass" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Abmelden
            </Button>
            <Avatar className="cursor-pointer hover:opacity-80 transition-opacity floating-element" onClick={() => setShowAccountManagement(true)}>
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div className="floating-element">
              <Logo />
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Overview Stats - Now with glass effects */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {overviewStats.map((stat, index) => (
            <Card 
              key={index} 
              variant="glass"
              className={`p-4 floating-element ${stat.onClick ? 'cursor-pointer glow-on-hover' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={stat.onClick}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </Card>
          ))}
        </div>

        {/* Residents List - New comprehensive section */}
        <div className="floating-element" style={{ animationDelay: '0.4s' }}>
          <ResidentsList />
        </div>

        {/* Main Content Grid - Updated to 2 columns with glass effects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Medication Tracking */}
          <div className="floating-element" style={{ animationDelay: '0.5s' }}>
            <MedicationTracker />
          </div>

          {/* Drug Ordering */}
          <div className="floating-element" style={{ animationDelay: '0.6s' }}>
            <DrugOrdering />
          </div>

          {/* Withings Integration - Now spans full width */}
          <div className="lg:col-span-2 floating-element" style={{ animationDelay: '0.7s' }}>
            <WithingsIntegration />
          </div>
        </div>
      </div>

      <AccountManagement open={showAccountManagement} onOpenChange={setShowAccountManagement} />

      <AddResidentDialog isOpen={showAddResidentDialog} onClose={() => setShowAddResidentDialog(false)} />
    </div>;
}

export function Dashboard() {
  return <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>;
}
