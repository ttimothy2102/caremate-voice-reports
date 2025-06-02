import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResidentsFilters } from './ResidentsFilters';
import { ResidentCard } from './ResidentCard';
import { ResidentDetailModal } from './ResidentDetailModal';
import { useResidents } from '@/hooks/useResidents';
import { Resident } from '@/hooks/useResidents';

export interface ExtendedResident extends Resident {
  health_status?: 'gut' | 'bedenklich' | 'kritisch';
  birth_date?: string;
  upcoming_appointments?: number;
  // Vitalwerte als strings (wie in der Datenbank gespeichert)
  blood_pressure?: string;
  blood_sugar?: string;
  temperature?: string;
  pulse?: string;
  respiratory_rate?: string;
  bmi?: string;
  care_situation?: string;
  shift_notes?: string;
  medication_deviations?: string;
  care_deviations?: string;
  emergency_medication?: string;
  energy_consumption?: number;
  energy_requirement?: number;
  water_intake?: number;
  hygiene_data?: string;
}

export function ResidentsList() {
  const { data: residents = [], isLoading } = useResidents();
  const [selectedResident, setSelectedResident] = useState<ExtendedResident | null>(null);
  const [filters, setFilters] = useState({
    name: '',
    healthStatus: 'all',
    birthDate: '',
    upcomingAppointments: false
  });

  // Mock extended data for demonstration - ensure all vital signs are strings
  const extendedResidents: ExtendedResident[] = residents.map(resident => ({
    ...resident,
    health_status: Math.random() > 0.7 ? 'kritisch' : Math.random() > 0.4 ? 'bedenklich' : 'gut',
    birth_date: `19${Math.floor(Math.random() * 50 + 30)}-${Math.floor(Math.random() * 12 + 1).toString().padStart(2, '0')}-${Math.floor(Math.random() * 28 + 1).toString().padStart(2, '0')}`,
    upcoming_appointments: Math.floor(Math.random() * 5),
    blood_pressure: `${Math.floor(Math.random() * 40 + 110)}/${Math.floor(Math.random() * 20 + 70)}`,
    blood_sugar: `${Math.floor(Math.random() * 50 + 80)}`,
    temperature: `${(36.0 + Math.random() * 2).toFixed(1)}`,
    pulse: `${Math.floor(Math.random() * 40 + 60)}`,
    respiratory_rate: `${Math.floor(Math.random() * 8 + 12)}`,
    bmi: `${(18 + Math.random() * 15).toFixed(1)}`,
    care_situation: 'Teilweise mobil, benötigt Unterstützung bei der Körperpflege',
    shift_notes: 'Patient war heute sehr kooperativ, hat gut gegessen.',
    medication_deviations: '',
    care_deviations: '',
    emergency_medication: 'Nitro-Spray bei Bedarf',
    energy_consumption: Math.floor(Math.random() * 500 + 1500),
    energy_requirement: Math.floor(Math.random() * 300 + 1800),
    water_intake: Math.floor(Math.random() * 500 + 1500),
    hygiene_data: 'Vollständige Körperpflege durchgeführt'
  }));

  const filteredResidents = extendedResidents.filter(resident => {
    const matchesName = resident.name.toLowerCase().includes(filters.name.toLowerCase());
    const matchesHealth = filters.healthStatus === 'all' || resident.health_status === filters.healthStatus;
    const matchesAppointments = !filters.upcomingAppointments || (resident.upcoming_appointments && resident.upcoming_appointments > 0);
    
    return matchesName && matchesHealth && matchesAppointments;
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Lade Bewohner...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Bewohnerübersicht</CardTitle>
        </CardHeader>
        <CardContent>
          <ResidentsFilters 
            filters={filters}
            onFiltersChange={setFilters}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {filteredResidents.map(resident => (
              <ResidentCard
                key={resident.id}
                resident={resident}
                onClick={() => setSelectedResident(resident)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedResident && (
        <ResidentDetailModal
          resident={selectedResident}
          isOpen={!!selectedResident}
          onClose={() => setSelectedResident(null)}
          onSave={(updatedResident) => {
            // Here you would typically update the resident in the database
            console.log('Saving resident:', updatedResident);
            setSelectedResident(null);
          }}
        />
      )}
    </div>
  );
}
