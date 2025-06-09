
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pill, AlertTriangle, Sunrise, Sun, CloudSun, Moon, Edit, Trash2 } from 'lucide-react';

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

interface MedicationListProps {
  medications: Medication[];
  logs?: MedicationLog[];
  onEditMedication: (medicationId: string) => void;
  onDeleteMedication: (medicationId: string) => void;
}

export function MedicationList({ medications, logs = [], onEditMedication, onDeleteMedication }: MedicationListProps) {
  const formatSchedule = (schedule: Medication['schedule']) => {
    return `${schedule.morning}-${schedule.midday}-${schedule.evening}-${schedule.night}`;
  };

  const getTodayLogs = (medicationId: string) => {
    if (!logs || !Array.isArray(logs)) {
      return [];
    }
    return logs.filter(log => log.medication_id === medicationId);
  };

  const getStockStatus = (stockCount: number, reorderLevel: number) => {
    if (stockCount <= reorderLevel) {
      return { status: 'critical', color: 'bg-red-100 text-red-800', text: 'Kritisch niedrig' };
    } else if (stockCount <= reorderLevel * 2) {
      return { status: 'warning', color: 'bg-yellow-100 text-yellow-800', text: 'Nachbestellen' };
    }
    return { status: 'good', color: 'bg-green-100 text-green-800', text: 'Ausreichend' };
  };

  return (
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
                      onClick={() => onEditMedication(medication.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDeleteMedication(medication.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {todayLogs.some(log => log.notes) && (
                  <div className="bg-blue-50 p-2 rounded text-sm">
                    <strong>Notizen:</strong>
                    {todayLogs.filter(log => log.notes).map((log, idx) => (
                      <div key={idx} className="text-blue-800">
                        {log.scheduled_time}: {log.notes}
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
  );
}
