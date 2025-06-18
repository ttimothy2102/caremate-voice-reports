
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus, Filter } from 'lucide-react';
import { useSchedules } from '@/hooks/useSchedules';
import { useResidents } from '@/hooks/useResidents';
import { format, startOfWeek, addDays, addWeeks, subWeeks } from 'date-fns';
import { de } from 'date-fns/locale';
import { AddScheduleDialog } from '@/components/schedule/AddScheduleDialog';

export function WeeklyCalendar() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedResident, setSelectedResident] = useState<string>('all');
  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  const { data: schedules = [] } = useSchedules();
  const { data: residents = [] } = useResidents();

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const filteredSchedules = schedules.filter(schedule => {
    const matchesResident = selectedResident === 'all' || schedule.resident_id === selectedResident;
    const matchesEventType = selectedEventType === 'all' || schedule.event_type === selectedEventType;
    return matchesResident && matchesEventType;
  });

  const getSchedulesForDay = (day: Date) => {
    return filteredSchedules.filter(schedule => {
      const scheduleDate = new Date(schedule.start_time);
      return format(scheduleDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    }).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  };

  const getEventTypeLabel = (eventType: string) => {
    const labels = {
      medical: 'Med',
      therapy: 'Ther',
      social: 'Soz',
      hygiene: 'Hyg',
      meal: 'Essen',
      rest: 'Ruhe',
      custom: 'Sonst'
    };
    return labels[eventType as keyof typeof labels] || eventType;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Terminübersicht</h2>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium min-w-[200px] text-center">
            {format(weekStart, 'd. MMM', { locale: de })} - {format(addDays(weekStart, 6), 'd. MMM yyyy', { locale: de })}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">Filter:</span>
          </div>
          
          <select 
            value={selectedResident}
            onChange={(e) => setSelectedResident(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm min-w-[120px]"
          >
            <option value="all">Alle Bewohner</option>
            {residents.map(resident => (
              <option key={resident.id} value={resident.id}>
                {resident.name}
              </option>
            ))}
          </select>

          <select 
            value={selectedEventType}
            onChange={(e) => setSelectedEventType(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm min-w-[120px]"
          >
            <option value="all">Alle Termine</option>
            <option value="medical">Medizinisch</option>
            <option value="therapy">Therapie</option>
            <option value="social">Sozial</option>
            <option value="hygiene">Hygiene</option>
            <option value="meal">Mahlzeit</option>
            <option value="rest">Ruhe</option>
            <option value="custom">Sonstige</option>
          </select>

          <Button size="sm" className="ml-auto" onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Termin hinzufügen
          </Button>
        </div>
      </Card>

      {/* Calendar Grid */}
      <Card className="p-4">
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, index) => (
            <div key={index} className="min-h-[400px] border-r last:border-r-0 pr-2">
              <div className="sticky top-0 bg-white pb-3 border-b mb-3">
                <h3 className="font-semibold text-gray-800 text-sm">
                  {format(day, 'EEEE', { locale: de })}
                </h3>
                <p className="text-xs text-gray-600">
                  {format(day, 'd. MMM', { locale: de })}
                </p>
              </div>
              
              <div className="space-y-1">
                {getSchedulesForDay(day).map((schedule) => {
                  const resident = residents.find(r => r.id === schedule.resident_id);
                  return (
                    <div
                      key={schedule.id}
                      className="p-2 rounded text-white text-xs cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: schedule.color_code }}
                    >
                      <div className="font-medium text-xs mb-1">
                        {format(new Date(schedule.start_time), 'HH:mm')}
                      </div>
                      <div className="font-semibold mb-1 leading-tight">
                        {schedule.title}
                      </div>
                      <div className="text-xs opacity-90 mb-1">
                        {resident?.name} (Zimmer {resident?.room})
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs opacity-75">
                          {getEventTypeLabel(schedule.event_type)}
                        </span>
                        {schedule.recurring_pattern !== 'none' && (
                          <span className="text-xs opacity-75">
                            🔄
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <AddScheduleDialog 
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        residents={residents}
      />
    </div>
  );
}
