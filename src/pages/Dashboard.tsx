
import React, { useState, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResidentCard } from "@/components/dashboard/ResidentCard";
import { VitalsChart } from "@/components/dashboard/VitalsChart";
import { PatientFilters } from "@/components/dashboard/PatientFilters";
import { MedicationTracker } from "@/components/medications/MedicationTracker";
import { DrugOrdering } from "@/components/medications/DrugOrdering";
import { Plus, AlertTriangle, FileText, Users, Heart, LogOut } from 'lucide-react';
import { useResidents } from '@/hooks/useResidents';
import { useVitalSignsChart } from '@/hooks/useVitalSigns';
import { useCareReports } from '@/hooks/useCareReports';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { toast } from '@/components/ui/use-toast';

function DashboardContent() {
  const { data: residents = [], isLoading: residentsLoading } = useResidents();
  const { data: heartRateData = [] } = useVitalSignsChart();
  const { data: careReports = [] } = useCareReports();
  const { signOut, user } = useAuth();

  // Filter states
  const [searchName, setSearchName] = useState('');
  const [roomFilter, setRoomFilter] = useState('all');
  const [careLevelFilter, setCareLevelFilter] = useState('all');

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  // Get unique rooms and care levels for filters
  const availableRooms = useMemo(() => 
    [...new Set(residents.map(r => r.room).filter(Boolean))].sort(),
    [residents]
  );

  const availableCareLevels = useMemo(() => 
    [...new Set(residents.map(r => r.care_level).filter(Boolean))].sort(),
    [residents]
  );

  // Filter residents based on search and filters
  const filteredResidents = useMemo(() => {
    return residents.filter(resident => {
      const matchesName = resident.name.toLowerCase().includes(searchName.toLowerCase());
      const matchesRoom = roomFilter === 'all' || resident.room === roomFilter;
      const matchesCarelevel = careLevelFilter === 'all' || resident.care_level === careLevelFilter;
      
      return matchesName && matchesRoom && matchesCarelevel;
    });
  }, [residents, searchName, roomFilter, careLevelFilter]);

  const overviewStats = [
    { title: "Reports Today", value: careReports.filter(r => 
      new Date(r.created_at).toDateString() === new Date().toDateString()
    ).length.toString(), icon: FileText, color: "text-blue-600" },
    { title: "Active Residents", value: residents.length.toString(), icon: Users, color: "text-green-600" },
    { title: "Vital Alerts", value: "3", icon: AlertTriangle, color: "text-red-600" },
    { title: "Device Sync", value: "98%", icon: Heart, color: "text-purple-600" }
  ];

  const residentsWithExtras = filteredResidents.map(resident => ({
    ...resident,
    lastReport: careReports.find(r => r.resident_id === resident.id) 
      ? new Date(careReports.find(r => r.resident_id === resident.id)!.created_at).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
      : undefined,
    vitalsStatus: (Math.random() > 0.7 ? 'warning' : 'normal') as 'normal' | 'warning' | 'critical',
    hasAlerts: Math.random() > 0.8
  }));

  if (residentsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-caremate-gradient bg-clip-text text-transparent">
              CareMate
            </h1>
            <p className="text-sm text-gray-600">Management Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              Welcome, {user?.email}
            </span>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Resident
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
            <div className="w-8 h-8 bg-caremate-gradient rounded-full"></div>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {overviewStats.map((stat, index) => (
            <Card key={index} className="p-4">
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

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Residents List */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Residents</h2>
            </div>
            
            <PatientFilters
              searchName={searchName}
              onSearchNameChange={setSearchName}
              roomFilter={roomFilter}
              onRoomFilterChange={setRoomFilter}
              careLevelFilter={careLevelFilter}
              onCareLevelFilterChange={setCareLevelFilter}
              availableRooms={availableRooms}
              availableCareLevels={availableCareLevels}
            />
            
            <div className="space-y-3">
              {residentsWithExtras.map((resident) => (
                <ResidentCard 
                  key={resident.id}
                  resident={resident}
                  onClick={() => console.log('Open resident details for:', resident.name)}
                />
              ))}
            </div>
          </div>

          {/* Right Column - Vitals and Medications */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vitals Overview */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Vitals Overview</h2>
              <VitalsChart 
                title="Heart Rate (BPM)"
                data={heartRateData}
                color="#29B6F6"
                unit="bpm"
              />
            </div>

            {/* Medication Tracking */}
            <MedicationTracker />

            {/* Drug Ordering */}
            <DrugOrdering />

            {/* Recent Alerts */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Recent Alerts</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 bg-red-50 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Hans Weber - High BP</p>
                    <p className="text-xs text-gray-600">15:30 - 145/95 mmHg</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Anna Müller - Missed Meal</p>
                    <p className="text-xs text-gray-600">12:00 - Lunch not completed</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
