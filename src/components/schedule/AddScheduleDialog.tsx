
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateSchedule } from '@/hooks/useSchedules';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

interface AddScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  residents: any[];
  initialDate?: Date;
  initialTime?: number;
  preSelectedResident?: string;
}

export function AddScheduleDialog({ 
  isOpen, 
  onClose, 
  residents, 
  initialDate, 
  initialTime,
  preSelectedResident 
}: AddScheduleDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    resident_id: preSelectedResident || '',
    event_type: 'medical' as const,
    start_time: '',
    end_time: '',
    recurring_pattern: 'none' as const,
    description: '',
    assigned_staff: '',
    color_code: '#3B82F6'
  });

  const createSchedule = useCreateSchedule();

  // Set initial date and time when provided
  useEffect(() => {
    if (initialDate && initialTime !== undefined) {
      const startDate = new Date(initialDate);
      startDate.setHours(initialTime, 0, 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setHours(initialTime + 1, 0, 0, 0);

      setFormData(prev => ({
        ...prev,
        start_time: startDate.toISOString().slice(0, 16),
        end_time: endDate.toISOString().slice(0, 16)
      }));
    }
  }, [initialDate, initialTime]);

  // Set pre-selected resident
  useEffect(() => {
    if (preSelectedResident) {
      setFormData(prev => ({
        ...prev,
        resident_id: preSelectedResident
      }));
    }
  }, [preSelectedResident]);

  const eventTypeColors = {
    medical: '#EF4444',
    therapy: '#3B82F6', 
    social: '#10B981',
    hygiene: '#8B5CF6',
    meal: '#F59E0B',
    rest: '#6B7280',
    custom: '#EC4899'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.resident_id || !formData.start_time || !formData.end_time) {
      toast({
        title: "Fehler",
        description: "Bitte füllen Sie alle Pflichtfelder aus.",
        variant: "destructive"
      });
      return;
    }

    try {
      await createSchedule.mutateAsync({
        ...formData,
        color_code: eventTypeColors[formData.event_type],
        completed: false
      });

      toast({
        title: "Termin erstellt",
        description: "Der Termin wurde erfolgreich hinzugefügt.",
      });

      // Reset form
      setFormData({
        title: '',
        resident_id: preSelectedResident || '',
        event_type: 'medical',
        start_time: '',
        end_time: '',
        recurring_pattern: 'none',
        description: '',
        assigned_staff: '',
        color_code: '#3B82F6'
      });

      onClose();
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Beim Erstellen des Termins ist ein Fehler aufgetreten.",
        variant: "destructive"
      });
    }
  };

  const handleEventTypeChange = (eventType: keyof typeof eventTypeColors) => {
    setFormData(prev => ({
      ...prev,
      event_type: eventType,
      color_code: eventTypeColors[eventType]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Neuen Termin hinzufügen</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Titel *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Terminbezeichnung"
              required
            />
          </div>

          <div>
            <Label htmlFor="resident">Bewohner *</Label>
            <Select
              value={formData.resident_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, resident_id: value }))}
              disabled={!!preSelectedResident}
            >
              <SelectTrigger>
                <SelectValue placeholder="Bewohner auswählen" />
              </SelectTrigger>
              <SelectContent>
                {residents.map(resident => (
                  <SelectItem key={resident.id} value={resident.id}>
                    {resident.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="event_type">Termintyp *</Label>
            <Select
              value={formData.event_type}
              onValueChange={handleEventTypeChange}
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
                <SelectItem value="rest">Ruhe</SelectItem>
                <SelectItem value="custom">Sonstige</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_time">Startzeit *</Label>
              <Input
                id="start_time"
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="end_time">Endzeit *</Label>
              <Input
                id="end_time"
                type="datetime-local"
                value={formData.end_time}
                onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                required
              />
            </div>
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
                <SelectItem value="none">Einmalig</SelectItem>
                <SelectItem value="daily">Täglich</SelectItem>
                <SelectItem value="weekly">Wöchentlich</SelectItem>
                <SelectItem value="monthly">Monatlich</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="assigned_staff">Zugewiesenes Personal</Label>
            <Input
              id="assigned_staff"
              value={formData.assigned_staff}
              onChange={(e) => setFormData(prev => ({ ...prev, assigned_staff: e.target.value }))}
              placeholder="Name des Personals"
            />
          </div>

          <div>
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Zusätzliche Informationen"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={createSchedule.isPending}>
              {createSchedule.isPending ? 'Erstellen...' : 'Termin erstellen'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
