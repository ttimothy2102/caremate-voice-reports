
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { GripVertical, Repeat } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { EventPreview } from '@/components/calendar/EventPreview';
import { formatDate, formatTime, getEventTypeLabel, getRecurringLabel } from './utils';

interface EventItemProps {
  schedule: any;
  resident: any;
  onEventClick: (e: React.MouseEvent, schedule: any) => void;
  onDrop: (e: React.DragEvent, targetDate: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  previewEvent: any;
  popoverOpen: boolean;
  onPopoverChange: (open: boolean) => void;
}

export function EventItem({ 
  schedule, 
  resident, 
  onEventClick, 
  onDrop, 
  onDragOver, 
  previewEvent, 
  popoverOpen, 
  onPopoverChange 
}: EventItemProps) {
  return (
    <Popover open={popoverOpen && previewEvent?.id === schedule.id} onOpenChange={onPopoverChange}>
      <PopoverTrigger asChild>
        <div 
          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
          onClick={(e) => onEventClick(e, schedule)}
          onDrop={(e) => onDrop(e, new Date(schedule.start_time).toISOString().split('T')[0])}
          onDragOver={onDragOver}
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
          onClose={() => onPopoverChange(false)}
        />
      </PopoverContent>
    </Popover>
  );
}
