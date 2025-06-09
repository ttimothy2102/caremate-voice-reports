
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
  Upload,
  Sun,
  CloudSun,
  Moon,
  Sunrise
} from 'lucide-react';

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

  // Updated mock medication data with German schedule format
  const mockMedications: Medication[] = [
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

  const formatSchedule = (schedule: Medication['schedule']) => {
    return `${schedule.morning}-${schedule.midday}-${schedule.evening}-${schedule.night}`;
  };

  const getTimeSlotIcon = (slot: string) => {
    switch (slot) {
      case 'morning': return <Sunrise className="w-4 h-4 text-orange-500" />;
      case 'midday': return <Sun className="w-4 h-4 text-yellow-500" />;
      case 'evening': return <CloudSun className="w-4 h-4 text-orange-600" />;
      case 'night': return <Moon className="w-4 h-4 text-blue-500" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getTimeSlotLabel = (slot: string) => {
    switch (slot) {
      case 'morning': return 'Morgens';
      case 'midday': return 'Mittags';
      case 'evening': return 'Abends';
      case 'night': return 'Nachts';
      default: return slot;
    }
  };

  const getDayPlan = () => {
    const timeSlots = [
      { key: 'morning', label: 'Morgens (08:00)', time: '08:00' },
      { key: 'midday', label: 'Mittags (13:00)', time: '13:00' },
      { key: 'evening', label: 'Abends (20:00)', time: '20:00' },
      { key: 'night', label: 'Nachts (22:00)', time: '22:00' }
    ];

    return timeSlots.map(slot => {
      const medicationsForSlot = mockMedications.filter(med => 
        med.schedule[slot.key as keyof typeof med.schedule] > 0
      );

      return {
        ...slot,
        medications: medicationsForSlot
      };
    });
  };

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
  };

  const handleAddReport = () => {
    console.log('Adding care report:', { reportText, selectedFiles });
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

      {/* Daily Medication Plan */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Calendar className="w-5 h-5" />
            Tagesplan Medikamente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {getDayPlan().map((timeSlot) => (
              <div key={timeSlot.key} className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  {getTimeSlotIcon(timeSlot.key)}
                  <div>
                    <h4 className="font-semibold text-sm">{getTimeSlotLabel(timeSlot.key)}</h4>
                    <p className="text-xs text-gray-600">{timeSlot.time}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {timeSlot.medications.length === 0 ? (
                    <p className="text-xs text-gray-500 italic">Keine Medikamente</p>
                  ) : (
                    timeSlot.medications.map((med) => {
                      const dosageCount = med.schedule[timeSlot.key as keyof typeof med.schedule];
                      const todayLogs = getTodayLogs(med.id);
                      const timeLog = todayLogs.find(log => log.scheduledTime === timeSlot.time);
                      
                      return (
                        <div key={med.id} className="bg-white border rounded p-2 space-y-1">
                          <div className="flex items-center gap-2">
                            <Checkbox 
                              id={`med-${med.id}-${timeSlot.key}`}
                              checked={timeLog?.completed || false}
                              onCheckedChange={() => handleMarkCompleted(med.id, timeSlot.time)}
                              className="data-[state=checked]:bg-green-600"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{med.name}</p>
                              <p className="text-xs text-gray-600">
                                {dosageCount}x {med.dosage}
                              </p>
                            </div>
                          </div>
                          {timeLog?.completed && timeLog.actualTime && (
                            <p className="text-xs text-green-600">
                              Gegeben um {timeLog.actualTime}
                            </p>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Medication List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-blue-500" />
            Medikamentenplan (Detailansicht)
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
                        <Badge variant="outline" className="text-xs font-mono">
                          {formatSchedule(medication.schedule)}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${stockStatus.color}`}
                        >
                          {stockStatus.text}: {medication.stockCount}
                        </Badge>
                      </div>
                      
                      {medication.instructions && (
                        <p className="text-sm text-gray-600 mb-2">{medication.instructions}</p>
                      )}

                      {/* Schedule breakdown */}
                      <div className="flex gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Sunrise className="w-3 h-3" />
                          <span>Morgens: {medication.schedule.morning}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Sun className="w-3 h-3" />
                          <span>Mittags: {medication.schedule.midday}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CloudSun className="w-3 h-3" />
                          <span>Abends: {medication.schedule.evening}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Moon className="w-3 h-3" />
                          <span>Nachts: {medication.schedule.night}</span>
                        </div>
                      </div>
                    </div>

                    {stockStatus.status === 'critical' && (
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    )}
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
