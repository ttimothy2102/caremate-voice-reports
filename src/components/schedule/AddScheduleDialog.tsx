
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateSchedule } from '@/hooks/useSchedules';
import { toast } from '@/hooks/use-toast';
import { Resident } from '@/hooks/useResidents';

interface AddScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  residents: Resident[];
}

const eventTypeColors = {
  medical: '#EF4444',
  therapy: '#3B82F6', 
  social: '#10B981',
  hygiene: '#8B5CF6',
  meal: '#F97316',
  rest: '#6B7280',
  custom: '#EAB308'
};

const colorOptions = [
  { value: '#EF4444', label: 'Rot (Medizinisch)', bg: 'bg-red-500' },
  { value: '#3B82F6', label: 'Blau (Therapie)', bg: 'bg-blue-500' },
  { value: '#10B981', label: 'Grün (Sozial)', bg: 'bg-green-500' },
  { value: '#8B5CF6', label: 'Lila (Hygiene)', bg: 'bg-purple-500' },
  { value: '#F97316', label: 'Orange (Mahlzeit)', bg: 'bg-orange-500' },
  { value: '#6B7280', label: 'Grau (Ruhe)', bg: 'bg-gray-500' },
  { value: '#EAB308', label: 'Gelb (Sonstige)', bg: 'bg-yellow-500' },
  { value: '#EC4899', label: 'Pink', bg: 'bg-pink-500' },
  { value: '#06B6D4', label: 'Cyan', bg: 'bg-cyan-500' },
  { value: '#84CC16', label: 'Lime', bg: 'bg-lime-500' }
];

export function AddScheduleDialog({ isOpen, onClose, residents }: AddScheduleDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    event_type: 'medical' as const,
    start_time: '',
    end_time: '',
    description: '',
    assigned_staff: '',
    recurring_pattern: 'none' as const,
    color_code: '#EF4444'
  });

  const [residentSearch, setResidentSearch] = useState('');
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { mutate: createSchedule, isPending } = useCreateSchedule();

  const filteredResidents = residents.filter(resident =>
    resident.name.toLowerCase().includes(residentSearch.toLowerCase())
  );

  const handleResidentSelect = (resident: Resident) => {
    setSelectedResident(resident);
    setResidentSearch(resident.name);
    setShowSuggestions(false);
  };

  const generateRecurringEvents = (baseEvent: any) => {
    const events = [baseEvent];
    
    if (formData.recurring_pattern === 'none') {
      return events;
    }

    const startDate = new Date(formData.start_time);
    const endDate = new Date(formData.end_time);
    
    // Generate next 12 occurrences for recurring events
    for (let i = 1; i <= 12; i++) {
      const nextStart = new Date(startDate);
      const nextEnd = new Date(endDate);
      
      switch (formData.recurring_pattern) {
        case 'daily':
          nextStart.setDate(startDate.getDate() + i);
          nextEnd.setDate(endDate.getDate() + i);
          break;
        case 'weekly':
          nextStart.setDate(startDate.getDate() + (i * 7));
          nextEnd.setDate(endDate.getDate() + (i * 7));
          break;
        case 'monthly':
          nextStart.setMonth(startDate.getMonth() + i);
          nextEnd.setMonth(endDate.getMonth() + i);
          break;
      }
      
      events.push({
        ...baseEvent,
        start_time: nextStart.toISOString(),
        end_time: nextEnd.toISOString()
      });
    }
    
    return events;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.start_time || !formData.end_time || !selectedResident) {
      toast({
        title: "Fehler",
        description: "Bitte füllen Sie alle Pflichtfelder aus und wählen Sie einen Bewohner.",
        variant: "destructive"
      });
      return;
    }

    const startTime = new Date(formData.start_time).toISOString();
    const endTime = new Date(formData.end_time).toISOString();

    const baseEvent = {
      ...formData,
      start_time: startTime,
      end_time: endTime,
      resident_id: selectedResident.id,
      completed: false
    };

    const eventsToCreate = generateRecurringEvents(baseEvent);
    
    // Create all events
    let completedCount = 0;
    eventsToCreate.forEach((event, index) => {
      createSchedule(event, {
        onSuccess: () => {
          completedCount++;
          if (completedCount === eventsToCreate.length) {
            const eventCount = eventsToCreate.length;
            const message = eventCount > 1 
              ? `${eventCount} wiederkehrende Termine für ${selectedResident.name} wurden erfolgreich erstellt.`
              : `Termin für ${selectedResident.name} wurde erfolgreich hinzugefügt.`;
            
            toast({
              title: "Termine erstellt",
              description: message,
            });
            onClose();
            // Reset form
            setFormData({
              title: '',
              event_type: 'medical',
              start_time: '',
              end_time: '',
              description: '',
              assigned_staff: '',
              recurring_pattern: 'none',
              color_code: '#EF4444'
            });
            setResidentSearch('');
            setSelectedResident(null);
          }
        },
        onError: (error) => {
          console.error('Error creating schedule:', error);
          toast({
            title: "Fehler",
            description: `Termin ${index + 1} konnte nicht erstellt werden.`,
            variant: "destructive"
          });
        }
      });
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Neuen Termin hinzufügen</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Label htmlFor="resident">Bewohner *</Label>
            <Input
              id="resident"
              value={residentSearch}
              onChange={(e) => {
                setResidentSearch(e.target.value);
                setShowSuggestions(true);
                setSelectedResident(null);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Bewohner suchen..."
            />
            {showSuggestions && residentSearch && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                {filteredResidents.length > 0 ? (
                  filteredResidents.map((resident) => (
                    <div
                      key={resident.id}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100 border-b last:border-b-0"
                      onClick={() => handleResidentSelect(resident)}
                    >
                      <div className="font-medium">{resident.name}</div>
                      <div className="text-sm text-gray-500">Zimmer: {resident.room}</div>
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-gray-500">Keine Bewohner gefunden</div>
                )}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="title">Titel *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="z.B. Medikamentengabe"
            />
          </div>

          <div>
            <Label htmlFor="event_type">Typ *</Label>
            <Select 
              value={formData.event_type} 
              onValueChange={(value) => setFormData(prev => ({ 
                ...prev, 
                event_type: value as any,
                color_code: eventTypeColors[value as keyof typeof eventTypeColors]
              }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="medical">Medizinisch</SelectItem>
                <SelectItem value="therapy">Therapie</SelectItem>
                <SelectItem value="social">Sozial</SelectItem>
                <SelectItem value="hygiene">Hygiene</SelectItem>
                <SelectItem value="meal">Mahlzeit</SelectItem>
                <SelectItem value="rest">Ruhe</SelectItem>
                <SelectItem value="custom">Sonstige</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="color">Farbe</Label>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 transition-all ${color.bg} ${
                    formData.color_code === color.value ? 'border-gray-800 scale-110' : 'border-gray-300'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, color_code: color.value }))}
                  title={color.label}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Ausgewählt: {colorOptions.find(c => c.value === formData.color_code)?.label}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="start_time">Startzeit *</Label>
              <Input
                id="start_time"
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="end_time">Endzeit *</Label>
              <Input
                id="end_time"
                type="datetime-local"
                value={formData.end_time}
                onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="assigned_staff">Zugewiesenes Personal</Label>
            <Input
              id="assigned_staff"
              value={formData.assigned_staff}
              onChange={(e) => setFormData(prev => ({ ...prev, assigned_staff: e.target.value }))}
              placeholder="Name des Pflegepersonals"
            />
          </div>

          <div>
            <Label htmlFor="recurring_pattern">Wiederholung</Label>
            <Select 
              value={formData.recurring_pattern} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, recurring_pattern: value as any }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Keine</SelectItem>
                <SelectItem value="daily">Täglich</SelectItem>
                <SelectItem value="weekly">Wöchentlich</SelectItem>
                <SelectItem value="monthly">Monatlich</SelectItem>
              </SelectContent>
            </Select>
            {formData.recurring_pattern !== 'none' && (
              <p className="text-xs text-gray-500 mt-1">
                Es werden automatisch 12 weitere Termine erstellt
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Zusätzliche Details..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Abbrechen
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? 'Erstellen...' : 'Termin erstellen'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
