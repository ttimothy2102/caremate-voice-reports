
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Sunrise, Sun, CloudSun, Moon, Clock } from 'lucide-react';
import { useMedications } from '@/hooks/useMedications';
import { useMedicationLogs } from '@/hooks/useMedicationLogs';
import { useResidents } from '@/hooks/useResidents';

interface MedicationLog {
  id: string;
  medication_id: string;
  scheduled_time: string;
  actual_time?: string;
  completed: boolean;
  notes?: string;
  administered_by: string;
}

interface MedicationScheduleProps {
  medications?: any[];
  logs?: MedicationLog[];
  onMarkCompleted?: (medicationId: string, timeSlot: string) => void;
}

export function MedicationSchedule({ medications: propMedications, logs: propLogs, onMarkCompleted }: MedicationScheduleProps) {
  const { data: allMedications = [] } = useMedications();
  const { data: allLogs = [] } = useMedicationLogs();
  const { data: residents = [] } = useResidents();

  const medications = propMedications || allMedications;
  const logs = propLogs || allLogs;

  const getCurrentTimeSlot = () => {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'midday';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  };

  const currentTimeSlot = getCurrentTimeSlot();

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
      case 'morning': return 'Morgens (06:00-12:00)';
      case 'midday': return 'Mittags (12:00-18:00)';
      case 'evening': return 'Abends (18:00-22:00)';
      case 'night': return 'Nachts (22:00-06:00)';
      default: return slot;
    }
  };

  const getMedicationsForTimeSlot = (timeSlot: string) => {
    return medications.filter(med => {
      const frequency = med.frequency?.toLowerCase() || '';
      
      switch (timeSlot) {
        case 'morning':
          return frequency.includes('daily') || frequency.includes('morning') || frequency.includes('twice') || frequency.includes('three') || frequency.includes('four');
        case 'midday':
          return frequency.includes('three') || frequency.includes('four') || frequency.includes('midday') || frequency.includes('lunch');
        case 'evening':
          return frequency.includes('daily') || frequency.includes('evening') || frequency.includes('twice') || frequency.includes('three') || frequency.includes('four');
        case 'night':
          return frequency.includes('four') || frequency.includes('night') || frequency.includes('bedtime');
        default:
          return false;
      }
    });
  };

  const getTodayLogs = (medicationId: string) => {
    return logs.filter(log => log.medication_id === medicationId);
  };

  const getResidentName = (residentId: string) => {
    const resident = residents.find(r => r.id === residentId);
    return resident?.name || 'Unbekannter Bewohner';
  };

  const currentMedications = getMedicationsForTimeSlot(currentTimeSlot);

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <Calendar className="w-5 h-5" />
          Aktuelle Medikamentengabe - {new Date().toLocaleDateString('de-DE')}
          <Badge variant="outline" className="ml-2">
            {getTimeSlotLabel(currentTimeSlot)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            {getTimeSlotIcon(currentTimeSlot)}
            <div>
              <h4 className="font-semibold text-sm">Jetzt fällig: {getTimeSlotLabel(currentTimeSlot)}</h4>
              <p className="text-xs text-gray-600 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            {currentMedications.length === 0 ? (
              <p className="text-sm text-gray-500 italic text-center py-4">
                Keine Medikamente für die aktuelle Zeit geplant
              </p>
            ) : (
              currentMedications.map((med) => {
                const todayLogs = getTodayLogs(med.id);
                const timeLog = todayLogs.find(log => log.scheduled_time === currentTimeSlot);
                const residentName = getResidentName(med.resident_id);
                
                return (
                  <div key={med.id} className="bg-white border rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id={`med-${med.id}-${currentTimeSlot}`}
                        checked={timeLog?.completed || false}
                        onCheckedChange={() => onMarkCompleted?.(med.id, currentTimeSlot)}
                        className="data-[state=checked]:bg-green-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium">{med.drug_name}</p>
                          <Badge variant="outline" className="text-xs">
                            {med.dosage}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">
                          Bewohner: <span className="font-medium">{residentName}</span>
                        </p>
                        <p className="text-xs text-gray-600">
                          Häufigkeit: {med.frequency}
                        </p>
                        {med.instructions && (
                          <p className="text-xs text-gray-500 mt-1">{med.instructions}</p>
                        )}
                      </div>
                      {med.stock_count && med.stock_count <= (med.reorder_level || 5) && (
                        <Badge variant="destructive" className="text-xs">
                          Wenig Vorrat: {med.stock_count}
                        </Badge>
                      )}
                    </div>
                    {timeLog?.completed && timeLog.actual_time && (
                      <p className="text-xs text-green-600">
                        ✓ Gegeben um {timeLog.actual_time}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* All time slots overview */}
          <div className="mt-6 pt-4 border-t">
            <h5 className="text-sm font-medium text-gray-700 mb-3">Tagesübersicht</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['morning', 'midday', 'evening', 'night'].map((slot) => {
                const slotMedications = getMedicationsForTimeSlot(slot);
                const isCurrent = slot === currentTimeSlot;
                
                return (
                  <div 
                    key={slot} 
                    className={`p-2 rounded border text-center ${
                      isCurrent ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 mb-1">
                      {getTimeSlotIcon(slot)}
                      <span className="text-xs font-medium">
                        {slot === 'morning' ? 'Morgen' : 
                         slot === 'midday' ? 'Mittag' : 
                         slot === 'evening' ? 'Abend' : 'Nacht'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      {slotMedications.length} Medikament{slotMedications.length !== 1 ? 'e' : ''}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
