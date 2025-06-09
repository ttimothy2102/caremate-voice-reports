
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ColorCodedEditor } from "@/components/ui/color-coded-editor";
import { AddMedicationDialog } from "@/components/medications/AddMedicationDialog";
import { MedicationSchedule } from "@/components/medications/MedicationSchedule";
import { MedicationList } from "@/components/medications/MedicationList";
import { CareReports } from "@/components/care/CareReports";
import { DeviationsSection } from "@/components/care/DeviationsSection";
import { ExtendedResident } from '../ResidentsList';
import { Plus, FileText } from 'lucide-react';

interface ResidentMedicationsProps {
  resident: ExtendedResident;
  onUpdate: (updates: Partial<ExtendedResident>) => void;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  schedule: {
    morning: number;
    midday: number;
    evening: number;
    night: number;
  };
  instructions: string;
  stockCount: number;
  reorderLevel: number;
  lastTaken?: string;
  times: string[];
}

interface MedicationLog {
  id: string;
  medication_id: string;
  scheduled_time: string;
  actual_time?: string;
  completed: boolean;
  notes?: string;
  administered_by: string;
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
  const [reportText, setReportText] = useState('');
  const [reportColorCode, setReportColorCode] = useState<string>();
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Aspirin 100mg',
      dosage: '1 Tablette',
      schedule: { morning: 1, midday: 0, evening: 0, night: 0 },
      instructions: 'Nach dem Frühstück einnehmen',
      stockCount: 28,
      reorderLevel: 7,
      times: ['08:00']
    },
    {
      id: '2',
      name: 'Metformin 500mg',
      dosage: '1 Tablette',
      schedule: { morning: 1, midday: 0, evening: 1, night: 0 },
      instructions: 'Zu den Mahlzeiten',
      stockCount: 15,
      reorderLevel: 10,
      times: ['08:00', '20:00']
    },
    {
      id: '3',
      name: 'Lisinopril 10mg',
      dosage: '1 Tablette',
      schedule: { morning: 1, midday: 0, evening: 0, night: 0 },
      instructions: 'Morgens nüchtern',
      stockCount: 5,
      reorderLevel: 7,
      times: ['08:00']
    },
    {
      id: '4',
      name: 'Ibuprofen 400mg',
      dosage: '1 Tablette',
      schedule: { morning: 1, midday: 1, evening: 1, night: 0 },
      instructions: 'Bei Bedarf gegen Schmerzen',
      stockCount: 20,
      reorderLevel: 5,
      times: ['08:00', '13:00', '20:00']
    }
  ]);

  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([]);

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

  const handleAddReport = () => {
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
    
    setReportText('');
    setReportColorCode(undefined);
    setSelectedFiles(null);
    setShowAddReport(false);
  };

  const handleAddMedication = (medication: Medication) => {
    setMedications(prev => [...prev, medication]);
    console.log('Adding medication:', medication);
  };

  const handleEditMedication = (medicationId: string) => {
    console.log('Editing medication:', medicationId);
  };

  const handleDeleteMedication = (medicationId: string) => {
    setMedications(prev => prev.filter(med => med.id !== medicationId));
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
              <div className="space-y-4">
                <div>
                  <Label htmlFor="report-text">Pflegebericht</Label>
                  <ColorCodedEditor
                    value={reportText}
                    onChange={(value, colorCode) => {
                      setReportText(value);
                      setReportColorCode(colorCode);
                    }}
                    placeholder="Beschreiben Sie die Pflegemaßnahmen, Beobachtungen und besondere Ereignisse..."
                    rows={8}
                  />
                </div>
                
                <div>
                  <Label htmlFor="file-upload">Dateien anhängen (optional)</Label>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => setSelectedFiles(e.target.files)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Unterstützte Formate: PDF, DOC, DOCX, JPG, PNG
                  </p>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAddReport(false)}>
                    Abbrechen
                  </Button>
                  <Button onClick={handleAddReport}>
                    Bericht speichern
                  </Button>
                </div>
              </div>
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
        medications={medications}
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
