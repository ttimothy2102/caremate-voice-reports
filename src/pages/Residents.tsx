
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { getPersonalizedGreeting } from '@/utils/greetingUtils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AccountManagement } from "@/components/account/AccountManagement";
import { Logo } from '@/components/layout/Logo';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ResidentCard } from '@/components/residents/ResidentCard';
import { ResidentDetailModal } from '@/components/residents/ResidentDetailModal';
import { useResidents } from '@/hooks/useResidents';
import { ExtendedResident } from '@/components/residents/ResidentsList';

function ResidentsContent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAccountManagement, setShowAccountManagement] = useState(false);
  const [selectedResident, setSelectedResident] = useState<ExtendedResident | null>(null);
  const [filters, setFilters] = useState({
    name: '',
    healthStatus: 'all',
    birthDate: '',
    upcomingAppointments: false
  });
  
  const { data: residents = [], isLoading } = useResidents();

  const userName = user?.user_metadata?.full_name;
  const greeting = getPersonalizedGreeting(userName);

  const userInitials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((name: string) => name[0]).join('').toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U';

  // Mock extended data for residents with proper type safety
  const extendedResidents: ExtendedResident[] = residents.map(resident => {
    const randomNum = Math.random();
    const health_status: 'kritisch' | 'bedenklich' | 'gut' = 
      randomNum > 0.7 ? 'kritisch' : randomNum > 0.4 ? 'bedenklich' : 'gut';
    
    return {
      ...resident,
      health_status,
      birth_date: `19${Math.floor(Math.random() * 50 + 30)}-${Math.floor(Math.random() * 12 + 1).toString().padStart(2, '0')}-${Math.floor(Math.random() * 28 + 1).toString().padStart(2, '0')}`,
      upcoming_appointments: Math.floor(Math.random() * 5),
      blood_pressure: resident.blood_pressure || `${Math.floor(Math.random() * 40 + 110)}/${Math.floor(Math.random() * 20 + 70)}`,
      blood_sugar: resident.blood_sugar || `${Math.floor(Math.random() * 50 + 80)}`,
      temperature: resident.temperature || `${(36.0 + Math.random() * 2).toFixed(1)}`,
      pulse: resident.pulse || `${Math.floor(Math.random() * 40 + 60)}`,
      respiratory_rate: resident.respiratory_rate || `${Math.floor(Math.random() * 8 + 12)}`,
      bmi: resident.bmi || `${(18 + Math.random() * 15).toFixed(1)}`,
      care_situation: 'Teilweise mobil, benötigt Unterstützung bei der Körperpflege',
      shift_notes: 'Patient war heute sehr kooperativ, hat gut gegessen.',
      medication_deviations: '',
      care_deviations: '',
      emergency_medication: 'Nitro-Spray bei Bedarf',
      energy_consumption: Math.floor(Math.random() * 500 + 1500),
      energy_requirement: Math.floor(Math.random() * 300 + 1800),
      water_intake: Math.floor(Math.random() * 500 + 1500),
      hygiene_data: 'Vollständige Körperpflege durchgeführt'
    };
  });

  const filteredResidents = extendedResidents.filter(resident => {
    const matchesName = resident.name.toLowerCase().includes(filters.name.toLowerCase());
    const matchesHealth = filters.healthStatus === 'all' || resident.health_status === filters.healthStatus;
    const matchesBirthdate = !filters.birthDate || resident.birth_date?.includes(filters.birthDate);
    const matchesAppointments = !filters.upcomingAppointments || (resident.upcoming_appointments && resident.upcoming_appointments > 0);
    
    return matchesName && matchesHealth && matchesBirthdate && matchesAppointments;
  });

  const updateFilter = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Bewohner werden geladen...</p>
        </div>
      </div>
    );
  }

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
                Bewohnerverwaltung
              </h1>
              <p className="text-sm text-gray-600">Verwalten Sie alle Bewohner und deren Daten</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Bewohner hinzufügen
            </Button>
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

      <div className="p-6 space-y-6">
        {/* Enhanced Filters */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Filter className="w-4 h-4" />
              Filteroptionen
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Name Filter */}
              <div className="space-y-2">
                <Label htmlFor="nameFilter">Name</Label>
                <Input
                  id="nameFilter"
                  placeholder="Nach Name suchen..."
                  value={filters.name}
                  onChange={(e) => updateFilter('name', e.target.value)}
                />
              </div>
              
              {/* Health Status Filter */}
              <div className="space-y-2">
                <Label>Gesundheitszustand</Label>
                <Select
                  value={filters.healthStatus}
                  onValueChange={(value) => updateFilter('healthStatus', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle</SelectItem>
                    <SelectItem value="gut">Gut</SelectItem>
                    <SelectItem value="bedenklich">Bedenklich</SelectItem>
                    <SelectItem value="kritisch">Kritisch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Birth Date Filter */}
              <div className="space-y-2">
                <Label htmlFor="birthdateFilter">Geburtsdatum</Label>
                <Input
                  id="birthdateFilter"
                  type="date"
                  value={filters.birthDate}
                  onChange={(e) => updateFilter('birthDate', e.target.value)}
                />
              </div>

              {/* Upcoming Appointments Filter */}
              <div className="space-y-2">
                <Label>Bevorstehende Termine</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="appointments"
                    checked={filters.upcomingAppointments}
                    onCheckedChange={(checked) => updateFilter('upcomingAppointments', checked)}
                  />
                  <Label 
                    htmlFor="appointments"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Nur mit Terminen
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Residents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResidents.map(resident => (
            <ResidentCard
              key={resident.id}
              resident={resident}
              onClick={() => setSelectedResident(resident)}
            />
          ))}
        </div>

        {filteredResidents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Keine Bewohner gefunden.</p>
          </div>
        )}
      </div>

      <AccountManagement 
        open={showAccountManagement}
        onOpenChange={setShowAccountManagement}
      />

      {selectedResident && (
        <ResidentDetailModal
          resident={selectedResident}
          isOpen={!!selectedResident}
          onClose={() => setSelectedResident(null)}
          onSave={(updatedResident) => {
            console.log('Saving resident:', updatedResident);
            setSelectedResident(null);
          }}
        />
      )}
    </div>
  );
}

export function Residents() {
  return (
    <ProtectedRoute>
      <ResidentsContent />
    </ProtectedRoute>
  );
}
