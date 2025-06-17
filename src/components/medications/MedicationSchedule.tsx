
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Sunrise, Sun, CloudSun, Moon, Clock } from 'lucide-react';
import { useMedications } from '@/hooks/useMedications';
import { useMedicationLogs, useCreateMedicationLog } from '@/hooks/useMedicationLogs';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

interface MedicationScheduleProps {
  residentId?: string;
  onMarkCompleted?: (medicationId: string, timeSlot: string) => void;
}

export function MedicationSchedule({ residentId, onMarkCompleted }: MedicationScheduleProps) {
  const { user } = useAuth();
  const { data: medications = [] } = useMedications(residentId);
  const { data: todayLogs = [] } = useMedicationLogs(undefined, new Date().toDateString());
  const createLogMutation = useCreateMedicationLog();

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
      // Parse frequency to determine if medication should be given at this time
      // This is a simple implementation - you might want to make this more sophisticated
      const frequency = med.frequency.toLowerCase();
      
      switch (timeSlot) {
        case 'morning': 
          return frequency.includes('morning') || frequency.includes('daily') || frequency.includes('morgens');
        case 'midday': 
          return frequency.includes('midday') || frequency.includes('mittag');
        case 'evening': 
          return frequency.includes('evening') || frequency.includes('abend');
        case 'night': 
          return frequency.includes('night') || frequency.includes('nacht');
        default: 
          return false;
      }
    });
  };

  const isCompleted = (medicationId: string, timeSlot: string) => {
    return todayLogs.some(log => 
      log.medication_id === medicationId && 
      log.completed &&
      log.scheduled_time.includes(timeSlot)
    );
  };

  const handleMarkCompleted = async (medicationId: string, timeSlot: string) => {
    if (!user) return;

    try {
      const now = new Date();
      const scheduledTime = new Date();
      
      // Set scheduled time based on time slot
      switch (timeSlot) {
        case 'morning': scheduledTime.setHours(8, 0, 0, 0); break;
        case 'midday': scheduledTime.setHours(13, 0, 0, 0); break;
        case 'evening': scheduledTime.setHours(20, 0, 0, 0); break;
        case 'night': scheduledTime.setHours(22, 0, 0, 0); break;
      }

      await createLogMutation.mutateAsync({
        medication_id: medicationId,
        administered_by: user.id,
        scheduled_time: scheduledTime.toISOString(),
        actual_time: now.toISOString(),
        completed: true,
        notes: `Administered during ${timeSlot} time slot`
      });

      toast({
        title: "Medication Logged",
        description: "Medication administration has been recorded.",
      });

      onMarkCompleted?.(medicationId, timeSlot);
    } catch (error) {
      console.error('Error logging medication:', error);
      toast({
        title: "Error",
        description: "Failed to log medication administration.",
        variant: "destructive"
      });
    }
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
                const completed = isCompleted(med.id, currentTimeSlot);
                
                return (
                  <div key={med.id} className="bg-white border rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        id={`med-${med.id}-${currentTimeSlot}`}
                        checked={completed}
                        onCheckedChange={() => handleMarkCompleted(med.id, currentTimeSlot)}
                        className="data-[state=checked]:bg-green-600"
                        disabled={completed}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`text-sm font-medium ${completed ? 'line-through text-gray-500' : ''}`}>
                            {med.drug_name}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {med.dosage}
                          </Badge>
                          {completed && (
                            <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                              Verabreicht
                            </Badge>
                          )}
                        </div>
                        {med.instructions && (
                          <p className="text-xs text-gray-500 mt-1">{med.instructions}</p>
                        )}
                      </div>
                      {med.stock_count <= med.reorder_level && (
                        <Badge variant="destructive" className="text-xs">
                          Wenig Vorrat: {med.stock_count}
                        </Badge>
                      )}
                    </div>
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
