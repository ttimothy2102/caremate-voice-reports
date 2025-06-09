
import React, { useState, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MedicationTracker } from "@/components/medications/MedicationTracker";
import { DrugOrdering } from "@/components/medications/DrugOrdering";
import { WithingsIntegration } from "@/components/withings/WithingsIntegration";
import { ResidentsList } from "@/components/residents/ResidentsList";
import { AddResidentDialog } from "@/components/residents/AddResidentDialog";
import { Plus, AlertTriangle, FileText, Users, Heart, LogOut, Calendar, Phone } from 'lucide-react';
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

  const handleContactDoctor = () => {
    toast({
      title: "Arzt kontaktieren",
      description: "Weiterleitung zur Arztkontakt-Funktion..."
    });
    // Here you could implement actual doctor contact functionality
    // For now, we'll just show a toast
  };

  // Reordered stats with scheduled tasks first and contact doctor button
  const overviewStats = [
    {
      title: "Terminierte Aufgaben",
      value: "5",
      icon: Calendar,
      color: "text-purple-600",
      onClick: () => navigate('/schedule')
    },
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
    }
  ];

  if (residentsLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Dashboard wird geladen...</p>
        </div>
      </div>;
  }

  return <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/mobile-home')}>
            <h1 className="text-2xl font-bold text-primary">
              CareMate
            </h1>
            <p className="text-sm text-gray-600">Management Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {greeting}
            </span>
            
            <Button variant="outline" size="sm" onClick={() => navigate('/schedule')}>
              <Calendar className="w-4 h-4 mr-2" />
              Terminplan
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleContactDoctor}
              className="text-green-600 border-green-300 hover:bg-green-50"
            >
              <Phone className="w-4 h-4 mr-2" />
              Arzt kontaktieren
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Abmelden
            </Button>
            <Avatar className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setShowAccountManagement(true)}>
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <Logo />
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {overviewStats.map((stat, index) => (
            <Card 
              key={index} 
              className={`p-4 ${stat.onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
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

        {/* Residents List */}
        <div>
          <ResidentsList />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Medication Tracking */}
          <div>
            <MedicationTracker />
          </div>

          {/* Drug Ordering */}
          <div>
            <DrugOrdering />
          </div>

          {/* Withings Integration */}
          <div className="lg:col-span-2">
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
