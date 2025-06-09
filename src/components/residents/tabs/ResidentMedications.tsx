
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ExtendedResident } from '../ResidentsList';
import { 
  Pill, 
  Clock, 
  Plus, 
  AlertTriangle, 
  CheckCircle,
  Calendar,
  FileText,
  Upload
} from 'lucide-react';

interface ResidentMedicationsProps {
  resident: ExtendedResident;
  onUpdate: (updates: Partial<ExtendedResident>) => void;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  instructions: string;
  stockCount: number;
  reorderLevel: number;
  lastTaken?: string;
  nextDue: string;
}

interface MedicationLog {
  id: string;
  medicationId: string;
  scheduledTime: string;
  actualTime?: string;
  completed: boolean;
  notes?: string;
  administeredBy: string;
}

export function ResidentMedications({ resident, onUpdate }: ResidentMedicationsProps) {
  const [showAddReport, setShowAddReport] = useState(false);
  const [reportText, setReportText] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  // Mock medication data for demonstration
  const mockMedications: Medication[] = [
    {
      id: '1',
      name: 'Aspirin 100mg',
      dosage: '1 Tablette',
      frequency: 'Täglich',
      times: ['08:00'],
      instructions: 'Nach dem Frühstück einnehmen',
      stockCount: 28,
      reorderLevel: 7,
      nextDue: '08:00'
    },
    {
      id: '2',
      name: 'Metformin 500mg',
      dosage: '1 Tablette',
      frequency: '2x täglich',
      times: ['08:00', '20:00'],
      instructions: 'Zu den Mahlzeiten',
      stockCount: 15,
      reorderLevel: 10,
      nextDue: '20:00'
    },
    {
      id: '3',
      name: 'Lisinopril 10mg',
      dosage: '1 Tablette',
      frequency: 'Täglich',
      times: ['08:00'],
      instructions: 'Morgens nüchtern',
      stockCount: 5,
      reorderLevel: 7,
      nextDue: '08:00'
    }
  ];

  const mockLogs: MedicationLog[] = [
    {
      id: '1',
      medicationId: '1',
      scheduledTime: '08:00',
      actualTime: '08:15',
      completed: true,
      administeredBy: 'Schwester Maria',
      notes: 'Problemlos eingenommen'
    },
    {
      id: '2',
      medicationId: '2',
      scheduledTime: '08:00',
      completed: false,
      administeredBy: 'Schwester Maria'
    }
  ];

  const getTodayLogs = (medicationId: string) => {
    return mockLogs.filter(log => log.medicationId === medicationId);
  };

  const getStockStatus = (stockCount: number, reorderLevel: number) => {
    if (stockCount <= reorderLevel) {
      return { status: 'critical', color: 'bg-red-100 text-red-800', text: 'Kritisch niedrig' };
    } else if (stockCount <= reorderLevel * 2) {
      return { status: 'warning', color: 'bg-yellow-100 text-yellow-800', text: 'Nachbestellen' };
    }
    return { status: 'good', color: 'bg-green-100 text-green-800', text: 'Ausreichend' };
  };

  const handleMarkCompleted = (medicationId: string, timeSlot: string) => {
    console.log(`Marking medication ${medicationId} as completed for ${timeSlot}`);
    // Here you would typically update the medication log
  };

  const handleAddReport = () => {
    console.log('Adding care report:', { reportText, selectedFiles });
    // Here you would save the report to the database
    setReportText('');
    setSelectedFiles(null);
    setShowAddReport(false);
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
                  <Textarea
                    id="report-text"
                    placeholder="Beschreiben Sie die Pflegemaßnahmen, Beobachtungen und besondere Ereignisse..."
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    rows={8}
                  />
                </div>
                
                <div>
                  <Label htmlFor="file-upload">Dateien anhängen (optional)</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => setSelectedFiles(e.target.files)}
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
          
          <Button size="sm" className="bg-caremate-gradient">
            <Plus className="w-4 h-4 mr-2" />
            Medikament hinzufügen
          </Button>
        </div>
      </div>

      {/* Medication Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-blue-500" />
            Medikamentenplan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockMedications.map((medication) => {
              const todayLogs = getTodayLogs(medication.id);
              const stockStatus = getStockStatus(medication.stockCount, medication.reorderLevel);

              return (
                <div key={medication.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-800">{medication.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {medication.dosage}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${stockStatus.color}`}
                        >
                          {stockStatus.text}: {medication.stockCount}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {medication.frequency}
                        </span>
                        <span>Nächste Gabe: {medication.nextDue}</span>
                      </div>

                      {medication.instructions && (
                        <p className="text-sm text-gray-600">{medication.instructions}</p>
                      )}
                    </div>

                    {stockStatus.status === 'critical' && (
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    )}
                  </div>

                  {/* Time slots for today */}
                  <div className="flex gap-2 flex-wrap">
                    {medication.times.map((time, index) => {
                      const timeLog = todayLogs.find(log => 
                        log.scheduledTime === time
                      );
                      
                      return (
                        <div key={index} className="flex items-center gap-2">
                          <Checkbox 
                            id={`med-${medication.id}-${time}`}
                            checked={timeLog?.completed || false}
                            onCheckedChange={() => handleMarkCompleted(medication.id, time)}
                            className="data-[state=checked]:bg-green-600"
                          />
                          <label 
                            htmlFor={`med-${medication.id}-${time}`}
                            className={`text-sm ${timeLog?.completed ? 'line-through text-gray-500' : ''}`}
                          >
                            {time}
                            {timeLog?.completed && timeLog.actualTime && (
                              <span className="text-xs text-green-600 ml-1">
                                (um {timeLog.actualTime})
                              </span>
                            )}
                          </label>
                        </div>
                      );
                    })}
                  </div>

                  {/* Notes from logs */}
                  {todayLogs.some(log => log.notes) && (
                    <div className="bg-blue-50 p-2 rounded text-sm">
                      <strong>Notizen:</strong>
                      {todayLogs.filter(log => log.notes).map((log, idx) => (
                        <div key={idx} className="text-blue-800">
                          {log.scheduledTime}: {log.notes}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Care Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-500" />
            Aktuelle Pflegeberichte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                date: '2024-01-09 14:30',
                author: 'Schwester Maria',
                summary: 'Patient war kooperativ, Medikamente pünktlich eingenommen.',
                type: 'Tagesrapport'
              },
              {
                date: '2024-01-09 08:15',
                author: 'Pfleger Thomas',
                summary: 'Morgendliche Körperpflege ohne Probleme durchgeführt.',
                type: 'Pflegemaßnahme'
              },
              {
                date: '2024-01-08 20:45',
                author: 'Schwester Anna',
                summary: 'Patient klagte über leichte Übelkeit nach Abendmedikation.',
                type: 'Besondere Beobachtung'
              }
            ].map((report, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{report.summary}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                      <span>{report.date}</span>
                      <span>von {report.author}</span>
                      <Badge variant="outline" className="text-xs">
                        {report.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Empty state */}
            <div className="text-center py-4">
              <Button variant="outline" size="sm" onClick={() => setShowAddReport(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Ersten Pflegebericht hinzufügen
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
