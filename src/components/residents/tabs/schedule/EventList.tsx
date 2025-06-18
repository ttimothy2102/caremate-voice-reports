
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock } from 'lucide-react';
import { EventItem } from './EventItem';

interface EventListProps {
  events: any[];
  resident: any;
  onEventClick: (e: React.MouseEvent, schedule: any) => void;
  onDrop: (e: React.DragEvent, targetDate: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  previewEvent: any;
  popoverOpen: boolean;
  onPopoverChange: (open: boolean) => void;
}

export function EventList({ 
  events, 
  resident, 
  onEventClick, 
  onDrop, 
  onDragOver, 
  previewEvent, 
  popoverOpen, 
  onPopoverChange 
}: EventListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Termine der nächsten 14 Tage
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div 
            className="text-gray-500 text-center py-8 border-2 border-dashed border-gray-300 rounded-lg"
            onDrop={(e) => {
              const today = new Date().toISOString().split('T')[0];
              onDrop(e, today);
            }}
            onDragOver={onDragOver}
          >
            <p className="mb-2">Keine Termine in den nächsten 14 Tagen geplant.</p>
            <p className="text-sm">Ziehen Sie eine Schnellaktion hierher, um einen Termin zu erstellen.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events
              .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
              .map((schedule) => (
                <EventItem
                  key={schedule.id}
                  schedule={schedule}
                  resident={resident}
                  onEventClick={onEventClick}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  previewEvent={previewEvent}
                  popoverOpen={popoverOpen}
                  onPopoverChange={onPopoverChange}
                />
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
