
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExtendedResident } from '../ResidentsList';
import { Calendar, Plus, Clock, Repeat, GripVertical } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useSchedules, useUpdateSchedule } from '@/hooks/useSchedules';
import { useResidents } from '@/hooks/useResidents';
import { AddScheduleDialog } from '@/components/schedule/AddScheduleDialog';
import { format, setHours, setMinutes } from 'date-fns';
import { de } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { EventPreview } from '@/components/calendar/EventPreview';

interface ResidentScheduleProps {
  resident: ExtendedResident;
  onUpdate: (updates: Partial<ExtendedResident>) => void;
}

interface QuickAction {
  id: string;
  title: string;
  type: 'medical' | 'therapy' | 'social' | 'hygiene' | 'meal';
  defaultDuration: number; // in minutes
}

export function ResidentSchedule({ resident, onUpdate }: ResidentScheduleProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; hour: number } | null>(null);
  const [draggedAction, setDraggedAction] = useState<QuickAction | null>(null);
  const [previewEvent, setPreviewEvent] = useState<any>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  
  const { data: schedules = [] } = useSchedules();
  const { data: residents = [] } = useResidents();
  const updateSchedule = useUpdateSchedule();

  // Filter schedules for this specific resident
  const residentSchedules = schedules.filter(schedule => 
    schedule.resident_id === resident.id
  );

  const quickActions: QuickAction[] = [
    { id: '1', title: 'Arzttermin', type: 'medical', defaultDuration: 60 },
    { id: '2', title: 'Therapie', type: 'therapy', defaultDuration: 45 },
    { id: '3', title: 'Medikation', type: 'medical', defaultDuration: 15 },
    { id: '4', title: 'Aktivität', type: 'social', defaultDuration: 90 }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'medical': return 'bg-red-100 text-red-800';
      case 'therapy': return 'bg-blue-100 text-blue-800';
      case 'social': return 'bg-green-100 text-green-800';
      case 'hygiene': return 'bg-purple-100 text-purple-800';
      case 'meal': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeLabel = (eventType: string) => {
    const labels = {
      medical: 'Medizinisch',
      therapy: 'Therapie',
      social: 'Sozial',
      hygiene: 'Hygiene',
      meal: 'Mahlzeit',
      rest: 'Ruhe',
      custom: 'Sonstige'
    };
    return labels[eventType as keyof typeof labels] || eventType;
  };

  const getRecurringLabel = (recurring: string) => {
    switch (recurring) {
      case 'daily': return 'Täglich';
      case 'weekly': return 'Wöchentlich';
      case 'monthly': return 'Monatlich';
      default: return 'Einmalig';
    }
  };

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString('de-DE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateTime: string) => {
    return format(new Date(dateTime), 'EEEE, d. MMMM yyyy', { locale: de });
  };

  const handleQuickActionClick = (action: QuickAction) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    setSelectedSlot({ date: tomorrow, hour: 9 });
    setShowAddDialog(true);
  };

  const handleDragStart = (action: QuickAction) => {
    setDraggedAction(action);
  };

  const handleDragEnd = () => {
    setDraggedAction(null);
  };

  const handleDrop = (e: React.DragEvent, targetDate: string) => {
    e.preventDefault();
    if (draggedAction) {
      const date = new Date(targetDate);
      setSelectedSlot({ date, hour: 9 });
      setShowAddDialog(true);
      setDraggedAction(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleEventClick = (e: React.MouseEvent, schedule: any) => {
    e.stopPropagation();
    setPreviewEvent(schedule);
    setPopoverOpen(true);
  };

  // Get next 14 days
  const next14Days = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  const eventsInNext14Days = residentSchedules.filter(schedule => {
    const scheduleDate = new Date(schedule.start_time).toISOString().split('T')[0];
    return next14Days.includes(scheduleDate);
  });

  const handleDialogClose = () => {
    setShowAddDialog(false);
    setSelectedSlot(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Terminplan für {resident.name}
        </h3>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Termin hinzufügen
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Termine der nächsten 14 Tage
          </CardTitle>
        </CardHeader>
        <CardContent>
          {eventsInNext14Days.length === 0 ? (
            <div 
              className="text-gray-500 text-center py-8 border-2 border-dashed border-gray-300 rounded-lg"
              onDrop={(e) => {
                const today = new Date().toISOString().split('T')[0];
                handleDrop(e, today);
              }}
              onDragOver={handleDragOver}
            >
              <p className="mb-2">Keine Termine in den nächsten 14 Tagen geplant.</p>
              <p className="text-sm">Ziehen Sie eine Schnellaktion hierher, um einen Termin zu erstellen.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {eventsInNext14Days
                .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
                .map((schedule) => (
                <Popover key={schedule.id} open={popoverOpen && previewEvent?.id === schedule.id} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger asChild>
                    <div 
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={(e) => handleEventClick(e, schedule)}
                      onDrop={(e) => handleDrop(e, new Date(schedule.start_time).toISOString().split('T')[0])}
                      onDragOver={handleDragOver}
                    >
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: schedule.color_code }}
                        />
                        <div>
                          <div className="font-medium">{schedule.title}</div>
                          <div className="text-sm text-gray-600">
                            {formatDate(schedule.start_time)} um {formatTime(schedule.start_time)}
                          </div>
                          {schedule.description && (
                            <div className="text-xs text-gray-500">{schedule.description}</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge 
                          className="text-white text-xs"
                          style={{ backgroundColor: schedule.color_code }}
                        >
                          {getEventTypeLabel(schedule.event_type)}
                        </Badge>
                        {schedule.recurring_pattern !== 'none' && (
                          <Badge variant="outline" className="text-xs">
                            <Repeat className="w-3 h-3 mr-1" />
                            {getRecurringLabel(schedule.recurring_pattern)}
                          </Badge>
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
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Schnellaktionen</CardTitle>
          <p className="text-sm text-gray-600">Klicken Sie auf eine Aktion oder ziehen Sie sie in den Kalender</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {quickActions.map((action) => (
              <Button 
                key={action.id}
                variant="outline" 
                size="sm"
                className="cursor-grab active:cursor-grabbing"
                draggable
                onClick={() => handleQuickActionClick(action)}
                onDragStart={() => handleDragStart(action)}
                onDragEnd={handleDragEnd}
              >
                {action.title}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <AddScheduleDialog 
        isOpen={showAddDialog}
        onClose={handleDialogClose}
        residents={residents}
        initialDate={selectedSlot?.date}
        initialTime={selectedSlot?.hour}
        preSelectedResident={resident.id}
      />
    </div>
  );
}
