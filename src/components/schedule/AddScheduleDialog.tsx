
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateSchedule } from '@/hooks/useSchedules';
import { toast } from '@/components/ui/use-toast';

interface AddScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  residentId: string;
  residentName: string;
}

export function AddScheduleDialog({ isOpen, onClose, residentId, residentName }: AddScheduleDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    event_type: 'medical' as const,
    start_time: '',
    end_time: '',
    description: '',
    assigned_staff: '',
    recurring_pattern: 'none' as const,
    color_code: '#3B82F6'
  });

  const { mutate: createSchedule, isPending } = useCreateSchedule();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.start_time || !formData.end_time) {
      toast({
        title: "Fehler",
        description: "Bitte füllen Sie alle Pflichtfelder aus.",
        variant: "destructive"
      });
      return;
    }

    createSchedule({
      ...formData,
      resident_id: residentId,
      completed: false
    }, {
      onSuccess: () => {
        toast({
          title: "Termin erstellt",
          description: `Termin für ${residentName} wurde erfolgreich hinzugefügt.`,
        });
        onClose();
        setFormData({
          title: '',
          event_type: 'medical',
          start_time: '',
          end_time: '',
          description: '',
          assigned_staff: '',
          recurring_pattern: 'none',
          color_code: '#3B82F6'
        });
      },
      onError: () => {
        toast({
          title: "Fehler",
          description: "Termin konnte nicht erstellt werden.",
          variant: "destructive"
        });
      }
    });
  };

  const eventTypeColors = {
    medical: '#EF4444',
    therapy: '#3B82F6',
    social: '#10B981',
    hygiene: '#8B5CF6',
    meal: '#F97316',
    rest: '#6B7280',
    custom: '#EAB308'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Neuer Termin für {residentName}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
