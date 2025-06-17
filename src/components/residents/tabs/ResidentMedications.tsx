
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AddMedicationDialog } from "@/components/medications/AddMedicationDialog";
import { MedicationSchedule } from "@/components/medications/MedicationSchedule";
import { MedicationList } from "@/components/medications/MedicationList";
import { CareReports } from "@/components/care/CareReports";
import { DeviationsSection } from "@/components/care/DeviationsSection";
import { CareReportForm } from "./medication-components/CareReportForm";
import { ExtendedResident } from '../ResidentsList';
import { Plus, FileText } from 'lucide-react';
import { useMedications } from '@/hooks/useMedications';
import { useMedicationLogs } from '@/hooks/useMedicationLogs';

interface ResidentMedicationsProps {
  resident: ExtendedResident;
  onUpdate: (updates: Partial<ExtendedResident>) => void;
}

interface CareReport {
  id: string;
  text: string;
  colorCode?: string;
  timestamp: string;
  author: string;
  type: string;
}

export function ResidentMedications({ resident, onUpdate }: ResidentMedicationsProps) {
  const [showAddReport, setShowAddReport] = useState(false);
  const [showAddMedication, setShowAddMedication] = useState(false);
  
  const { data: medicationsData = [] } = useMedications(resident.id);
  const { data: medicationLogs = [] } = useMedicationLogs();

  // Transform medications from database format to MedicationList format
  const medications = medicationsData.map(med => ({
    id: med.id,
    name: med.drug_name,
    dosage: med.dosage,
    schedule: {
      morning: 1,
      midday: 0,
      evening: 1,
      night: 0
    },
    instructions: med.instructions || '',
    stockCount: med.stock_count || 0,
    reorderLevel: med.reorder_level || 5,
    times: med.frequency.toLowerCase().includes('daily') 
      ? ['morning'] 
      : med.frequency.toLowerCase().split(/[,\s]+/).filter(Boolean)
  }));

  const [careReports, setCareReports] = useState<CareReport[]>([
    {
      id: '1',
      text: 'Patient war kooperativ, Medikamente pünktlich eingenommen.',
      timestamp: '2024-01-09 14:30',
      author: 'Schwester Maria',
      type: 'Tagesrapport'
    },
    {
      id: '2',
      text: 'Morgendliche Körperpflege ohne Probleme durchgeführt.',
      timestamp: '2024-01-09 08:15',
      author: 'Pfleger Thomas',
      type: 'Pflegemaßnahme'
    },
    {
      id: '3',
      text: 'Patient klagte über leichte Übelkeit nach Abendmedikation. Arzt informiert.',
      colorCode: 'red',
      timestamp: '2024-01-08 20:45',
      author: 'Schwester Anna',
      type: 'Besondere Beobachtung'
    }
  ]);

  const handleMarkCompleted = (medicationId: string, timeSlot: string) => {
    console.log(`Marking medication ${medicationId} as completed for ${timeSlot}`);
  };

  const handleAddReport = (reportText: string, reportColorCode?: string, selectedFiles?: FileList | null) => {
    const newReport: CareReport = {
      id: Date.now().toString(),
      text: reportText,
      colorCode: reportColorCode,
      timestamp: new Date().toLocaleString('de-DE'),
      author: 'Aktuelle Pflegekraft',
      type: 'Pflegebericht'
    };
    
    setCareReports(prev => [newReport, ...prev]);
    console.log('Adding care report:', newReport);
    setShowAddReport(false);
  };

  const handleAddMedication = (medication: any) => {
    console.log('Adding medication:', medication);
  };

  const handleEditMedication = (medicationId: string) => {
    console.log('Editing medication:', medicationId);
  };

  const handleDeleteMedication = (medicationId: string) => {
    console.log('Deleting medication:', medicationId);
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Medikamente & Pflege</h2>
        <div className="flex gap-2">
          <Dialog open={showAddReport} onOpenChange={setShowAddReport}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Pflegebericht hinzufügen
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Pflegebericht für {resident.name}</DialogTitle>
              </DialogHeader>
              <CareReportForm onSave={handleAddReport} />
            </DialogContent>
          </Dialog>
          
          <Button size="sm" className="bg-caremate-gradient" onClick={() => setShowAddMedication(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Medikament hinzufügen
          </Button>
        </div>
      </div>

      {/* Daily Medication Plan */}
      <MedicationSchedule 
        residentId={resident.id}
        onMarkCompleted={handleMarkCompleted}
      />

      {/* Detailed Medication List */}
      <MedicationList 
        medications={medications}
        logs={medicationLogs}
        onEditMedication={handleEditMedication}
        onDeleteMedication={handleDeleteMedication}
      />

      {/* Deviations with Auto Color Coding */}
      <DeviationsSection 
        resident={resident}
        onUpdate={onUpdate}
      />

      {/* Recent Care Reports with Color Coding */}
      <CareReports 
        reports={careReports}
        onAddReport={() => setShowAddReport(true)}
      />

      {/* Add Medication Dialog */}
      <AddMedicationDialog
        open={showAddMedication}
        onOpenChange={setShowAddMedication}
        residentId={resident.id}
        onSave={handleAddMedication}
      />
    </div>
  );
}
