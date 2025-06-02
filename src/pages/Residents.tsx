
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
import { ResidentCard } from '@/components/residents/ResidentCard';
import { useResidents } from '@/hooks/useResidents';

function ResidentsContent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAccountManagement, setShowAccountManagement] = useState(false);
  const [nameFilter, setNameFilter] = useState('');
  const [birthdateFilter, setBirthdateFilter] = useState('');
  
  const { data: residents = [], isLoading } = useResidents();

  const userName = user?.user_metadata?.full_name;
  const greeting = getPersonalizedGreeting(userName);

  const userInitials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((name: string) => name[0]).join('').toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U';

  // Mock extended data for residents
  const extendedResidents = residents.map(resident => ({
    ...resident,
    health_status: Math.random() > 0.7 ? 'kritisch' : Math.random() > 0.4 ? 'bedenklich' : 'gut',
    birth_date: `19${Math.floor(Math.random() * 50 + 30)}-${Math.floor(Math.random() * 12 + 1).toString().padStart(2, '0')}-${Math.floor(Math.random() * 28 + 1).toString().padStart(2, '0')}`,
    upcoming_appointments: Math.floor(Math.random() * 5),
  }));

  const filteredResidents = extendedResidents.filter(resident => {
    const matchesName = resident.name.toLowerCase().includes(nameFilter.toLowerCase());
    const matchesBirthdate = !birthdateFilter || resident.birth_date?.includes(birthdateFilter);
    return matchesName && matchesBirthdate;
  });

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
              onClick={() => navigate('/mobile-home')}
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
        {/* Filters */}
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Filter:</span>
            </div>
            
            <div className="flex gap-4">
              <div>
                <Label htmlFor="nameFilter" className="text-sm">Name</Label>
                <Input
                  id="nameFilter"
                  placeholder="Nach Name suchen..."
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  className="w-48"
                />
              </div>
              
              <div>
                <Label htmlFor="birthdateFilter" className="text-sm">Geburtsdatum</Label>
                <Input
                  id="birthdateFilter"
                  type="date"
                  value={birthdateFilter}
                  onChange={(e) => setBirthdateFilter(e.target.value)}
                  className="w-48"
                />
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
              onClick={() => console.log('Open resident details', resident.id)}
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
