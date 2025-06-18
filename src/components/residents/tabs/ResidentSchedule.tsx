
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ExtendedResident } from '../ResidentsList';
import { Calendar, Plus } from 'lucide-react';
import { useSchedules } from '@/hooks/useSchedules';
import { useResidents } from '@/hooks/useResidents';
import { AddScheduleDialog } from '@/components/schedule/AddScheduleDialog';
import { QuickActions } from './schedule/QuickActions';
import { EventList } from './schedule/EventList';
import { QuickAction, ScheduleSlot } from './schedule/types';

interface ResidentScheduleProps {
  resident: ExtendedResident;
  onUpdate: (updates: Partial<ExtendedResident>) => void;
}

export function ResidentSchedule({ resident, onUpdate }: ResidentScheduleProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<ScheduleSlot | null>(null);
  const [draggedAction, setDraggedAction] = useState<QuickAction | null>(null);
  const [previewEvent, setPreviewEvent] = useState<any>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  
  const { data: schedules = [] } = useSchedules();
  const { data: residents = [] } = useResidents();

  // Filter schedules for this specific resident
  const residentSchedules = schedules.filter(schedule => 
    schedule.resident_id === resident.id
  );

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

      <EventList
        events={eventsInNext14Days}
        resident={resident}
        onEventClick={handleEventClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        previewEvent={previewEvent}
        popoverOpen={popoverOpen}
        onPopoverChange={setPopoverOpen}
      />

      <QuickActions
        onQuickActionClick={handleQuickActionClick}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />

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
