
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ColorCodedEditor } from "@/components/ui/color-coded-editor";
import { AddMedicationDialog } from "@/components/medications/AddMedicationDialog";
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
  Sunrise,
  Edit,
  Trash2
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
      const medicationsForSlot = medications.filter(med => 
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

  const getReportColorStyle = (colorCode?: string) => {
    switch (colorCode) {
      case 'red': return 'border-l-red-500 bg-red-50';
      case 'green': return 'border-l-green-500 bg-green-50';
      case 'yellow': return 'border-l-yellow-500 bg-yellow-50';
      default: return 'border-l-blue-500 bg-blue-50';
    }
  };

  const handleMarkCompleted = (medicationId: string, timeSlot: string) => {
    console.log(`Marking medication ${medicationId} as completed for ${timeSlot}`);
    // TODO: Implement actual completion logic
  };

  const handleAddReport = () => {
    const newReport: CareReport = {
      id: Date.now().toString(),
      text: reportText,
      colorCode: reportColorCode,
      timestamp: new Date().toLocaleString('de-DE'),
      author: 'Aktuelle Pflegekraft', // TODO: Get from auth context
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
    // TODO: Implement edit functionality
  };

  const handleDeleteMedication = (medicationId: string) => {
    setMedications(prev => prev.filter(med => med.id !== medicationId));
    console.log('Deleting medication:', medicationId);
  };

  const handleCareDeviationChange = (value: string, colorCode?: string) => {
    onUpdate({ 
      care_deviations: value,
      // Store color code in a separate field for highlighting
      care_deviations_color: colorCode 
    });
  };

  const handleMedicationDeviationChange = (value: string, colorCode?: string) => {
    onUpdate({ 
      medication_deviations: value,
      medication_deviations_color: colorCode 
    });
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
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Calendar className="w-5 h-5" />
            Tagesplan Medikamente - {new Date().toLocaleDateString('de-DE')}
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
                              <Badge variant="outline" className="text-xs font-mono mt-1">
                                {formatSchedule(med.schedule)}
                              </Badge>
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
            {medications.map((medication) => {
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

                    <div className="flex items-center gap-2">
                      {stockStatus.status === 'critical' && (
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditMedication(medication.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteMedication(medication.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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

      {/* Deviations with Auto Color Coding */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Abweichungen bei Maßnahmen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="care_deviations">Dokumentation von Abweichungen</Label>
              <ColorCodedEditor
                value={resident.care_deviations || ''}
                onChange={handleCareDeviationChange}
                placeholder="Dokumentation von Abweichungen bei geplanten Pflegemaßnahmen..."
                rows={6}
                autoColorCode={true}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Pill className="w-5 h-5 text-red-500" />
              Abweichungen bei der Medikation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="medication_deviations">Dokumentation von Medikationsabweichungen</Label>
              <ColorCodedEditor
                value={resident.medication_deviations || ''}
                onChange={handleMedicationDeviationChange}
                placeholder="Dokumentation von Medikationsabweichungen..."
                rows={6}
                autoColorCode={true}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Care Reports with Color Coding */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-500" />
            Aktuelle Pflegeberichte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {careReports.map((report) => (
              <div key={report.id} className={`border-l-4 pl-4 py-2 ${getReportColorStyle(report.colorCode)}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{report.text}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                      <span>{report.timestamp}</span>
                      <span>von {report.author}</span>
                      <Badge variant="outline" className="text-xs">
                        {report.type}
                      </Badge>
                      {report.colorCode && (
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            report.colorCode === 'red' ? 'bg-red-100 text-red-800' :
                            report.colorCode === 'green' ? 'bg-green-100 text-green-800' :
                            report.colorCode === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {report.colorCode === 'red' ? 'Wichtig' :
                           report.colorCode === 'green' ? 'Positiv' :
                           report.colorCode === 'yellow' ? 'Achtung' : 'Normal'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="text-center py-4">
              <Button variant="outline" size="sm" onClick={() => setShowAddReport(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Weiteren Pflegebericht hinzufügen
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

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
