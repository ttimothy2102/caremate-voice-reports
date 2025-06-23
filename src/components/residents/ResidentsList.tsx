
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResidentsFilters } from './ResidentsFilters';
import { ResidentCard } from './ResidentCard';
import { ResidentDetailModal } from './ResidentDetailModal';
import { useResidents, Resident } from '@/hooks/useResidents';
import { toast } from '@/components/ui/use-toast';

export interface ExtendedResident extends Resident {
  health_status?: 'gut' | 'bedenklich' | 'kritisch';
  birth_date?: string;
  upcoming_appointments?: number;
  next_appointment_date?: string;
  // Vitalwerte als strings (wie in der Datenbank gespeichert)
  blood_pressure?: string;
  blood_sugar?: string;
  temperature?: string;
  pulse?: string;
  respiratory_rate?: string;
  bmi?: string;
  care_situation?: string;
  shift_notes?: string;
  shift_notes_color?: string;
  medication_deviations?: string;
  medication_deviations_color?: string;
  care_deviations?: string;
  care_deviations_color?: string;
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
    upcomingAppointments: false,
    sortByAppointments: false
  });

  // Enhanced mock data with more test patients and appointment dates
  const extendedResidents: ExtendedResident[] = residents.map((resident, index) => {
    const randomNum = Math.random();
    const health_status: 'kritisch' | 'bedenklich' | 'gut' = 
      randomNum > 0.7 ? 'kritisch' : randomNum > 0.4 ? 'bedenklich' : 'gut';
    
    // Generate next appointment date (some residents have appointments in the next 30 days)
    const hasAppointment = Math.random() > 0.3;
    const nextAppointmentDate = hasAppointment 
      ? new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      : null;
    
    return {
      ...resident,
      health_status,
      birth_date: `19${Math.floor(Math.random() * 50 + 30)}-${Math.floor(Math.random() * 12 + 1).toString().padStart(2, '0')}-${Math.floor(Math.random() * 28 + 1).toString().padStart(2, '0')}`,
      upcoming_appointments: hasAppointment ? Math.floor(Math.random() * 5) + 1 : 0,
      next_appointment_date: nextAppointmentDate,
      // Use existing database values or generate mock data
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

  // Add three additional test patients
  const additionalTestPatients: ExtendedResident[] = [
    {
      id: 'test-patient-1',
      name: 'Klaus Schmidt',
      age: 78,
      room: '103',
      care_level: 'Pflegegrad 3',
      admission_date: '2023-08-15',
      emergency_contact: 'Petra Schmidt',
      emergency_phone: '+49 30 98765432',
      medical_conditions: ['Diabetes', 'Bluthochdruck'],
      allergies: ['Penicillin'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      health_status: 'kritisch',
      upcoming_appointments: 3,
      next_appointment_date: '2024-01-15',
      blood_pressure: '160/95',
      blood_sugar: '180',
      temperature: '37.2',
      pulse: '85',
      emergency_medication: 'Insulin bei Bedarf'
    },
    {
      id: 'test-patient-2',
      name: 'Ingrid Weber',
      age: 82,
      room: '205',
      care_level: 'Pflegegrad 2',
      admission_date: '2023-09-22',
      emergency_contact: 'Michael Weber',
      emergency_phone: '+49 40 12345678',
      medical_conditions: ['Arthritis', 'Herzinsuffizienz'],
      allergies: ['Aspirin'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      health_status: 'bedenklich',
      upcoming_appointments: 2,
      next_appointment_date: '2024-01-18',
      blood_pressure: '140/85',
      blood_sugar: '120',
      temperature: '36.8',
      pulse: '75',
      emergency_medication: 'Digitalis bei Bedarf'
    },
    {
      id: 'test-patient-3',
      name: 'Heinrich Bauer',
      age: 75,
      room: '112',
      care_level: 'Pflegegrad 1',
      admission_date: '2023-10-05',
      emergency_contact: 'Anna Bauer',
      emergency_phone: '+49 89 87654321',
      medical_conditions: ['Leichte Demenz'],
      allergies: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      health_status: 'gut',
      upcoming_appointments: 1,
      next_appointment_date: '2024-01-25',
      blood_pressure: '125/80',
      blood_sugar: '95',
      temperature: '36.5',
      pulse: '68',
      emergency_medication: 'Keine'
    }
  ];

  const allResidents = [...extendedResidents, ...additionalTestPatients];

  let filteredResidents = allResidents.filter(resident => {
    const matchesName = resident.name.toLowerCase().includes(filters.name.toLowerCase());
    const matchesHealth = filters.healthStatus === 'all' || resident.health_status === filters.healthStatus;
    const matchesAppointments = !filters.upcomingAppointments || (resident.upcoming_appointments && resident.upcoming_appointments > 0);
    
    return matchesName && matchesHealth && matchesAppointments;
  });

  // Sort residents
  if (filters.sortByAppointments) {
    filteredResidents = filteredResidents.sort((a, b) => {
      // First, sort by those with appointments vs those without
      if (a.next_appointment_date && !b.next_appointment_date) return -1;
      if (!a.next_appointment_date && b.next_appointment_date) return 1;
      
      // Then sort by appointment date (earliest first)
      if (a.next_appointment_date && b.next_appointment_date) {
        return new Date(a.next_appointment_date).getTime() - new Date(b.next_appointment_date).getTime();
      }
      
      return 0;
    });
  } else {
    // Default sort by health status: critical -> bedenklich -> gut
    filteredResidents = filteredResidents.sort((a, b) => {
      const statusOrder = { 'kritisch': 0, 'bedenklich': 1, 'gut': 2 };
      return statusOrder[a.health_status || 'gut'] - statusOrder[b.health_status || 'gut'];
    });
  }

  const handleSaveResident = (updatedResident: ExtendedResident) => {
    toast({
      title: "Resident Updated",
      description: `${updatedResident.name} has been successfully updated.`,
    });
    console.log('Resident saved successfully:', updatedResident);
  };

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
          onSave={handleSaveResident}
        />
      )}
    </div>
  );
}
