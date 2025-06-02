
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, User, Calendar } from 'lucide-react';
import { useSchedules } from '@/hooks/useSchedules';
import { AddScheduleDialog } from './AddScheduleDialog';

interface PatientScheduleProps {
  residentId: string;
  residentName: string;
}

export function PatientSchedule({ residentId, residentName }: PatientScheduleProps) {
  const { data: schedules = [], isLoading } = useSchedules(residentId);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const getEventTypeColor = (eventType: string) => {
    const colors = {
      medical: 'bg-red-100 text-red-800',
      therapy: 'bg-blue-100 text-blue-800',
      social: 'bg-green-100 text-green-800',
      hygiene: 'bg-purple-100 text-purple-800',
      meal: 'bg-orange-100 text-orange-800',
      rest: 'bg-gray-100 text-gray-800',
      custom: 'bg-yellow-100 text-yellow-800'
    };
    return colors[eventType as keyof typeof colors] || colors.custom;
  };

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString('de-DE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString('de-DE', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-600 mt-2">Termine werden geladen...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          Terminplan für {residentName}
        </h3>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-caremate-gradient hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Termin hinzufügen
        </Button>
      </div>

      {schedules.length === 0 ? (
        <Card className="p-6 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">Keine Termine geplant</p>
          <Button 
            onClick={() => setShowAddDialog(true)}
            variant="outline"
          >
            Ersten Termin hinzufügen
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {schedules.map((schedule) => (
            <Card key={schedule.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{schedule.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{schedule.description}</p>
                </div>
                <Badge className={getEventTypeColor(schedule.event_type)}>
                  {schedule.event_type === 'medical' && 'Medizinisch'}
                  {schedule.event_type === 'therapy' && 'Therapie'}
                  {schedule.event_type === 'social' && 'Sozial'}
                  {schedule.event_type === 'hygiene' && 'Hygiene'}
                  {schedule.event_type === 'meal' && 'Mahlzeit'}
                  {schedule.event_type === 'rest' && 'Ruhe'}
                  {schedule.event_type === 'custom' && 'Sonstige'}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(schedule.start_time)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>Personal: {schedule.assigned_staff}</span>
                </div>
              </div>
              
              {schedule.recurring_pattern !== 'none' && (
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs">
                    Wiederholt: {schedule.recurring_pattern === 'daily' && 'Täglich'}
                    {schedule.recurring_pattern === 'weekly' && 'Wöchentlich'}
                    {schedule.recurring_pattern === 'monthly' && 'Monatlich'}
                  </Badge>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <AddScheduleDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        residentId={residentId}
        residentName={residentName}
      />
    </div>
  );
}
