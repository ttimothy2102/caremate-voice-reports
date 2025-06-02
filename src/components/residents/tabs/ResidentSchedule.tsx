
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExtendedResident } from '../ResidentsList';
import { Calendar, Plus, Clock, Repeat, DragHandleDots1Icon } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface ResidentScheduleProps {
  resident: ExtendedResident;
  onUpdate: (updates: Partial<ExtendedResident>) => void;
}

interface ScheduleEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'medical' | 'therapy' | 'social' | 'hygiene' | 'meal';
  recurring: 'none' | 'daily' | 'weekly' | 'monthly';
  description: string;
}

export function ResidentSchedule({ resident, onUpdate }: ResidentScheduleProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<ScheduleEvent>>({
    title: '',
    date: '',
    time: '',
    type: 'medical',
    recurring: 'none',
    description: ''
  });

  // Mock events for demonstration
  const [events, setEvents] = useState<ScheduleEvent[]>([
    {
      id: '1',
      title: 'Arztbesuch Dr. Müller',
      date: '2025-06-03',
      time: '10:00',
      type: 'medical',
      recurring: 'monthly',
      description: 'Routineuntersuchung'
    },
    {
      id: '2',
      title: 'Physiotherapie',
      date: '2025-06-04',
      time: '14:00',
      type: 'therapy',
      recurring: 'weekly',
      description: 'Bewegungstherapie'
    },
    {
      id: '3',
      title: 'Gruppensingen',
      date: '2025-06-05',
      time: '15:30',
      type: 'social',
      recurring: 'weekly',
      description: 'Soziale Aktivität'
    }
  ]);

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

  const getRecurringLabel = (recurring: string) => {
    switch (recurring) {
      case 'daily': return 'Täglich';
      case 'weekly': return 'Wöchentlich';
      case 'monthly': return 'Monatlich';
      default: return 'Einmalig';
    }
  };

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.time) {
      const event: ScheduleEvent = {
        id: Date.now().toString(),
        title: newEvent.title!,
        date: newEvent.date!,
        time: newEvent.time!,
        type: newEvent.type as any,
        recurring: newEvent.recurring as any,
        description: newEvent.description || ''
      };
      
      setEvents([...events, event]);
      setNewEvent({
        title: '',
        date: '',
        time: '',
        type: 'medical',
        recurring: 'none',
        description: ''
      });
      setShowAddForm(false);
    }
  };

  // Get next 14 days
  const next14Days = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  const eventsInNext14Days = events.filter(event => 
    next14Days.includes(event.date)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Terminplan für {resident.name}
        </h3>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Termin hinzufügen
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Neuen Termin hinzufügen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event-title">Titel</Label>
                <Input
                  id="event-title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Terminbezeichnung"
                />
              </div>
              
              <div>
                <Label htmlFor="event-type">Typ</Label>
                <Select
                  value={newEvent.type}
                  onValueChange={(value) => setNewEvent({ ...newEvent, type: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medical">Medizinisch</SelectItem>
                    <SelectItem value="therapy">Therapie</SelectItem>
                    <SelectItem value="social">Soziale Aktivität</SelectItem>
                    <SelectItem value="hygiene">Hygiene</SelectItem>
                    <SelectItem value="meal">Mahlzeit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="event-date">Datum</Label>
                <Input
                  id="event-date"
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="event-time">Uhrzeit</Label>
                <Input
                  id="event-time"
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="event-recurring">Wiederholung</Label>
                <Select
                  value={newEvent.recurring}
                  onValueChange={(value) => setNewEvent({ ...newEvent, recurring: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Einmalig</SelectItem>
                    <SelectItem value="daily">Täglich</SelectItem>
                    <SelectItem value="weekly">Wöchentlich</SelectItem>
                    <SelectItem value="monthly">Monatlich</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="event-description">Beschreibung</Label>
              <Input
                id="event-description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Zusätzliche Informationen"
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleAddEvent}>
                Termin speichern
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Abbrechen
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Termine der nächsten 14 Tage
          </CardTitle>
        </CardHeader>
        <CardContent>
          {eventsInNext14Days.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Keine Termine in den nächsten 14 Tagen geplant.
            </p>
          ) : (
            <div className="space-y-3">
              {eventsInNext14Days
                .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime())
                .map((event) => (
                <div 
                  key={event.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-grab"
                  draggable
                >
                  <div className="flex items-center gap-3">
                    <DragHandleDots1Icon className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(event.date).toLocaleDateString('de-DE')} um {event.time}
                      </div>
                      {event.description && (
                        <div className="text-xs text-gray-500">{event.description}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getEventTypeColor(event.type)}>
                      {event.type}
                    </Badge>
                    {event.recurring !== 'none' && (
                      <Badge variant="outline" className="text-xs">
                        <Repeat className="w-3 h-3 mr-1" />
                        {getRecurringLabel(event.recurring)}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Schnellaktionen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button variant="outline" size="sm">
              Arzttermin
            </Button>
            <Button variant="outline" size="sm">
              Therapie
            </Button>
            <Button variant="outline" size="sm">
              Medikation
            </Button>
            <Button variant="outline" size="sm">
              Aktivität
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
