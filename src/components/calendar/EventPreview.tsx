
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, Calendar, Repeat, X } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface EventPreviewProps {
  schedule: any;
  resident: any;
  onClose: () => void;
}

export function EventPreview({ schedule, resident, onClose }: EventPreviewProps) {
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

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString('de-DE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateTime: string) => {
    return format(new Date(dateTime), 'EEEE, d. MMMM yyyy', { locale: de });
  };

  return (
    <Card className="w-80 p-4 shadow-lg border-0 bg-white">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: schedule.color_code }}
          />
          <h3 className="font-semibold text-gray-800">{schedule.title}</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0 hover:bg-gray-100"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(schedule.start_time)}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}</span>
        </div>

        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>{resident?.name}</span>
        </div>

        {schedule.assigned_staff && (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>Personal: {schedule.assigned_staff}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Badge 
            className="text-white text-xs"
            style={{ backgroundColor: schedule.color_code }}
          >
            {getEventTypeLabel(schedule.event_type)}
          </Badge>
          {schedule.recurring_pattern !== 'none' && (
            <div className="flex items-center gap-1">
              <Repeat className="w-4 h-4" />
              <span className="text-xs">
                {schedule.recurring_pattern === 'daily' && 'Täglich'}
                {schedule.recurring_pattern === 'weekly' && 'Wöchentlich'}
                {schedule.recurring_pattern === 'monthly' && 'Monatlich'}
              </span>
            </div>
          )}
        </div>

        {schedule.description && (
          <div className="mt-3 pt-2 border-t">
            <p className="text-sm text-gray-700">{schedule.description}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
