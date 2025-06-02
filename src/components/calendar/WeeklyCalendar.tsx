
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus, Filter } from 'lucide-react';
import { useSchedules } from '@/hooks/useSchedules';
import { useResidents } from '@/hooks/useResidents';
import { format, startOfWeek, addDays, addWeeks, subWeeks } from 'date-fns';
import { de } from 'date-fns/locale';

const eventTypeColors = {
  medical: 'bg-red-100 text-red-800 border-red-300',
  therapy: 'bg-blue-100 text-blue-800 border-blue-300',
  social: 'bg-green-100 text-green-800 border-green-300',
  hygiene: 'bg-purple-100 text-purple-800 border-purple-300',
  meal: 'bg-orange-100 text-orange-800 border-orange-300',
  rest: 'bg-gray-100 text-gray-800 border-gray-300',
  custom: 'bg-yellow-100 text-yellow-800 border-yellow-300'
};

export function WeeklyCalendar() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedResident, setSelectedResident] = useState<string>('all');
  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  
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
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Wöchentlicher Terminplan</h2>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium">
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
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">Filter:</span>
          </div>
          
          <select 
            value={selectedResident}
            onChange={(e) => setSelectedResident(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm"
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
            className="px-3 py-1 border rounded-md text-sm"
          >
            <option value="all">Alle Termine</option>
            <option value="medical">Medizinische Termine</option>
            <option value="therapy">Therapie-Termine</option>
            <option value="social">Soziale Aktivitäten</option>
            <option value="hygiene">Hygiene-Termine</option>
            <option value="meal">Mahlzeiten</option>
            <option value="rest">Ruhezeiten</option>
            <option value="custom">Sonstige Termine</option>
          </select>

          <Button size="sm" className="ml-auto">
            <Plus className="w-4 h-4 mr-2" />
            Termin hinzufügen
          </Button>
        </div>
      </Card>

      {/* Calendar Grid */}
      <Card className="p-4">
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day, index) => (
            <div key={index} className="min-h-[300px]">
              <div className="sticky top-0 bg-white pb-2 border-b mb-3">
                <h3 className="font-medium text-gray-800">
                  {format(day, 'EEEE', { locale: de })}
                </h3>
                <p className="text-sm text-gray-600">
                  {format(day, 'd. MMM', { locale: de })}
                </p>
              </div>
              
              <div className="space-y-2">
                {getSchedulesForDay(day).map((schedule) => (
                  <div
                    key={schedule.id}
                    className="p-2 rounded-lg border cursor-pointer hover:shadow-sm transition-shadow"
                    style={{ backgroundColor: schedule.color_code + '20', borderColor: schedule.color_code }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">
                        {format(new Date(schedule.start_time), 'HH:mm')}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${eventTypeColors[schedule.event_type as keyof typeof eventTypeColors]}`}
                      >
                        {schedule.event_type === 'medical' && 'Medizinisch'}
                        {schedule.event_type === 'therapy' && 'Therapie'}
                        {schedule.event_type === 'social' && 'Sozial'}
                        {schedule.event_type === 'hygiene' && 'Hygiene'}
                        {schedule.event_type === 'meal' && 'Mahlzeit'}
                        {schedule.event_type === 'rest' && 'Ruhe'}
                        {schedule.event_type === 'custom' && 'Sonstige'}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-gray-800 mb-1">
                      {schedule.title}
                    </p>
                    <p className="text-xs text-gray-600">
                      {residents.find(r => r.id === schedule.resident_id)?.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
