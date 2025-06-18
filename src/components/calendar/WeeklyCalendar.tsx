
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronLeft, ChevronRight, Plus, Filter } from 'lucide-react';
import { useSchedules, useUpdateSchedule } from '@/hooks/useSchedules';
import { useResidents } from '@/hooks/useResidents';
import { format, startOfWeek, addDays, addWeeks, subWeeks, setHours, setMinutes } from 'date-fns';
import { de } from 'date-fns/locale';
import { AddScheduleDialog } from '@/components/schedule/AddScheduleDialog';
import { EventPreview } from './EventPreview';

export function WeeklyCalendar() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedResident, setSelectedResident] = useState<string>('all');
  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; hour: number } | null>(null);
  const [draggedEvent, setDraggedEvent] = useState<any>(null);
  const [previewEvent, setPreviewEvent] = useState<any>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  
  const { data: schedules = [] } = useSchedules();
  const { data: residents = [] } = useResidents();
  const updateSchedule = useUpdateSchedule();

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const filteredSchedules = schedules.filter(schedule => {
    const matchesResident = selectedResident === 'all' || schedule.resident_id === selectedResident;
    const matchesEventType = selectedEventType === 'all' || schedule.event_type === selectedEventType;
    return matchesResident && matchesEventType;
  });

  const getSchedulesForDayAndHour = (day: Date, hour: number) => {
    return filteredSchedules.filter(schedule => {
      const scheduleDate = new Date(schedule.start_time);
      const scheduleHour = scheduleDate.getHours();
      return format(scheduleDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd') && scheduleHour === hour;
    });
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

  const handleDoubleClick = (day: Date, hour: number) => {
    setSelectedSlot({ date: day, hour });
    setShowAddDialog(true);
  };

  const handleEventClick = (e: React.MouseEvent, schedule: any) => {
    e.stopPropagation();
    setPreviewEvent(schedule);
    setPopoverOpen(true);
  };

  const handleDragStart = (e: React.DragEvent, schedule: any) => {
    setDraggedEvent(schedule);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, day: Date, hour: number) => {
    e.preventDefault();
    
    if (!draggedEvent) return;

    const newStartTime = setMinutes(setHours(day, hour), 0);
    const originalStartTime = new Date(draggedEvent.start_time);
    const originalEndTime = new Date(draggedEvent.end_time);
    const duration = originalEndTime.getTime() - originalStartTime.getTime();
    const newEndTime = new Date(newStartTime.getTime() + duration);

    try {
      await updateSchedule.mutateAsync({
        id: draggedEvent.id,
        start_time: newStartTime.toISOString(),
        end_time: newEndTime.toISOString()
      });
    } catch (error) {
      console.error('Error updating schedule:', error);
    }

    setDraggedEvent(null);
  };

  const handleDialogClose = () => {
    setShowAddDialog(false);
    setSelectedSlot(null);
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
      <Card className="overflow-hidden">
        <div className="grid grid-cols-8 text-xs border-collapse">
          {/* Time column header */}
          <div className="font-semibold text-center p-3 border-b border-r bg-gray-50">Zeit</div>
          
          {/* Day headers */}
          {weekDays.map((day, index) => (
            <div key={index} className="font-semibold text-center p-3 border-b border-r last:border-r-0 bg-gray-50">
              <div className="text-sm">{format(day, 'EEEE', { locale: de })}</div>
              <div className="text-xs text-gray-600">{format(day, 'd. MMM', { locale: de })}</div>
            </div>
          ))}

          {/* Time slots and events */}
          {hours.map(hour => (
            <React.Fragment key={hour}>
              {/* Time label */}
              <div className="text-center py-3 px-2 border-r border-b text-xs font-medium text-gray-600 bg-gray-50 min-h-[60px] flex items-center justify-center">
                {hour.toString().padStart(2, '0')}:00
              </div>
              
              {/* Day columns for this hour */}
              {weekDays.map((day, dayIndex) => {
                const scheduleEvents = getSchedulesForDayAndHour(day, hour);
                return (
                  <div
                    key={`${hour}-${dayIndex}`}
                    className="min-h-[60px] border-b border-r last:border-r-0 hover:bg-blue-50 transition-colors cursor-pointer relative p-1"
                    onDoubleClick={() => handleDoubleClick(day, hour)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, day, hour)}
                  >
                    {scheduleEvents.map((schedule) => {
                      const resident = residents.find(r => r.id === schedule.resident_id);
                      return (
                        <Popover key={schedule.id} open={popoverOpen && previewEvent?.id === schedule.id} onOpenChange={setPopoverOpen}>
                          <PopoverTrigger asChild>
                            <div
                              draggable
                              onDragStart={(e) => handleDragStart(e, schedule)}
                              onClick={(e) => handleEventClick(e, schedule)}
                              className="w-full h-full rounded-md text-white text-xs cursor-pointer hover:opacity-90 transition-all overflow-hidden p-2 border border-white/20"
                              style={{ backgroundColor: schedule.color_code }}
                            >
                              <div className="font-medium truncate text-xs leading-tight">
                                {schedule.title}
                              </div>
                              <div className="text-xs opacity-90 truncate mt-0.5">
                                {resident?.name}
                              </div>
                              <div className="flex items-center justify-between mt-1">
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
                          </PopoverTrigger>
                          <PopoverContent side="right" className="p-0 border-0 shadow-lg">
                            <EventPreview 
                              schedule={schedule}
                              resident={resident}
                              onClose={() => setPopoverOpen(false)}
                            />
                          </PopoverContent>
                        </Popover>
                      );
                    })}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </Card>

      <AddScheduleDialog 
        isOpen={showAddDialog}
        onClose={handleDialogClose}
        residents={residents}
        initialDate={selectedSlot?.date}
        initialTime={selectedSlot?.hour}
      />
    </div>
  );
}
