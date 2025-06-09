
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Sunrise, Sun, CloudSun, Moon } from 'lucide-react';

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

interface MedicationScheduleProps {
  medications: Medication[];
  logs: MedicationLog[];
  onMarkCompleted: (medicationId: string, timeSlot: string) => void;
}

export function MedicationSchedule({ medications, logs, onMarkCompleted }: MedicationScheduleProps) {
  const getTimeSlotIcon = (slot: string) => {
    switch (slot) {
      case 'morning': return <Sunrise className="w-4 h-4 text-orange-500" />;
      case 'midday': return <Sun className="w-4 h-4 text-yellow-500" />;
      case 'evening': return <CloudSun className="w-4 h-4 text-orange-600" />;
      case 'night': return <Moon className="w-4 h-4 text-blue-500" />;
      default: return <Sun className="w-4 h-4" />;
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

  const formatSchedule = (schedule: Medication['schedule']) => {
    return `${schedule.morning}-${schedule.midday}-${schedule.evening}-${schedule.night}`;
  };

  const getTodayLogs = (medicationId: string) => {
    return logs.filter(log => log.medicationId === medicationId);
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

  return (
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
                            onCheckedChange={() => onMarkCompleted(med.id, timeSlot.time)}
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
  );
}
