
import React from 'react';
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Pill, AlertCircle, Plus } from 'lucide-react';
import { useMedications } from '@/hooks/useMedications';
import { useMedicationLogs } from '@/hooks/useMedicationLogs';

interface MedicationTrackerProps {
  residentId?: string;
  showAddButton?: boolean;
  onAddMedication?: () => void;
}

export function MedicationTracker({ residentId, showAddButton = true, onAddMedication }: MedicationTrackerProps) {
  const { data: medications = [], isLoading } = useMedications(residentId);
  const { data: medicationLogs = [] } = useMedicationLogs(residentId);

  const getTodayLogs = (medicationId: string) => {
    const today = new Date().toDateString();
    return medicationLogs.filter(log => 
      log.medication_id === medicationId && 
      new Date(log.scheduled_time).toDateString() === today
    );
  };

  const getNextDose = (medication: any) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Simple scheduling based on frequency
    const times = getScheduledTimes(medication.frequency);
    const nextTime = times.find(time => {
      const scheduleTime = new Date(today);
      const [hours, minutes] = time.split(':');
      scheduleTime.setHours(parseInt(hours), parseInt(minutes));
      return scheduleTime > now;
    });
    
    return nextTime || times[0]; // Return next dose or first dose of tomorrow
  };

  const getScheduledTimes = (frequency: string) => {
    switch (frequency.toLowerCase()) {
      case 'once daily':
        return ['08:00'];
      case 'twice daily':
        return ['08:00', '20:00'];
      case 'three times daily':
        return ['08:00', '14:00', '20:00'];
      case 'four times daily':
        return ['06:00', '12:00', '18:00', '22:00'];
      default:
        return ['08:00'];
    }
  };

  const getStockStatus = (stockCount: number, reorderLevel: number) => {
    if (stockCount <= reorderLevel) {
      return { status: 'critical', color: 'bg-red-100 text-red-800' };
    } else if (stockCount <= reorderLevel * 2) {
      return { status: 'warning', color: 'bg-yellow-100 text-yellow-800' };
    }
    return { status: 'good', color: 'bg-green-100 text-green-800' };
  };

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Pill className="w-5 h-5 text-blue-600" />
          Medication Schedule
        </h3>
        {showAddButton && (
          <Button size="sm" onClick={onAddMedication} className="bg-caremate-gradient">
            <Plus className="w-4 h-4 mr-2" />
            Add Medication
          </Button>
        )}
      </div>

      {medications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Pill className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No medications scheduled</p>
        </div>
      ) : (
        <div className="space-y-4">
          {medications.map((medication) => {
            const todayLogs = getTodayLogs(medication.id);
            const nextDose = getNextDose(medication);
            const stockStatus = getStockStatus(medication.stock_count || 0, medication.reorder_level || 5);
            const isCompleted = todayLogs.some(log => log.completed);

            return (
              <div key={medication.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-800">{medication.drug_name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {medication.dosage}
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${stockStatus.color}`}>
                        Stock: {medication.stock_count || 0}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {medication.frequency}
                      </span>
                      <span>Next: {nextDose}</span>
                    </div>

                    {medication.instructions && (
                      <p className="text-sm text-gray-600 mt-2">{medication.instructions}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {stockStatus.status === 'critical' && (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`med-${medication.id}`}
                        checked={isCompleted}
                        className="data-[state=checked]:bg-green-600"
                      />
                      <label 
                        htmlFor={`med-${medication.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Taken
                      </label>
                    </div>
                  </div>
                </div>

                {/* Scheduled times for today */}
                <div className="flex gap-2 flex-wrap">
                  {getScheduledTimes(medication.frequency).map((time, index) => {
                    const timeLog = todayLogs.find(log => 
                      new Date(log.scheduled_time).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) === time
                    );
                    
                    return (
                      <Badge 
                        key={index}
                        variant={timeLog?.completed ? "default" : "outline"}
                        className={`text-xs ${timeLog?.completed ? 'bg-green-600' : ''}`}
                      >
                        {time} {timeLog?.completed && '✓'}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
