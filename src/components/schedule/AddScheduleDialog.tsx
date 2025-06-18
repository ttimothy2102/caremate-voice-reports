
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateSchedule } from '@/hooks/useSchedules';
import { format, addDays, addWeeks, addMonths, setHours, setMinutes } from 'date-fns';

interface AddScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  residents: any[];
  initialDate?: Date;
  initialTime?: number;
}

const colorOptions = [
  { value: '#3B82F6', label: 'Blau' },
  { value: '#EF4444', label: 'Rot' },
  { value: '#10B981', label: 'Grün' },
  { value: '#F59E0B', label: 'Orange' },
  { value: '#8B5CF6', label: 'Lila' },
  { value: '#EC4899', label: 'Pink' },
  { value: '#14B8A6', label: 'Türkis' },
  { value: '#F97316', label: 'Dunkelorange' }
];

export function AddScheduleDialog({ isOpen, onClose, residents, initialDate, initialTime }: AddScheduleDialogProps) {
  const [formData, setFormData] = useState({
    resident_id: '',
    title: '',
    event_type: 'medical' as const,
    start_time: '',
    end_time: '',
    recurring_pattern: 'none' as const,
    color_code: '#3B82F6',
    description: '',
    assigned_staff: '',
    completed: false
  });

  const createSchedule = useCreateSchedule();

  // Set initial date and time when dialog opens
  useEffect(() => {
    if (isOpen && initialDate && initialTime !== undefined) {
      const startDateTime = setMinutes(setHours(initialDate, initialTime), 0);
      const endDateTime = setMinutes(setHours(initialDate, initialTime + 1), 0);
      
      setFormData(prev => ({
        ...prev,
        start_time: format(startDateTime, "yyyy-MM-dd'T'HH:mm"),
        end_time: format(endDateTime, "yyyy-MM-dd'T'HH:mm")
      }));
    }
  }, [isOpen, initialDate, initialTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.resident_id || !formData.title || !formData.start_time || !formData.end_time) {
      return;
    }

    try {
      const baseSchedule = {
        ...formData,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString()
      };

      // Create the initial schedule
      await createSchedule.mutateAsync(baseSchedule);

      // If recurring, create additional schedules
      if (formData.recurring_pattern !== 'none') {
        const schedulesToCreate = [];
        const startDate = new Date(formData.start_time);
        const endDate = new Date(formData.end_time);

        for (let i = 1; i <= 12; i++) {
          let nextStartDate: Date;
          let nextEndDate: Date;

          switch (formData.recurring_pattern) {
            case 'daily':
              nextStartDate = addDays(startDate, i);
              nextEndDate = addDays(endDate, i);
              break;
            case 'weekly':
              nextStartDate = addWeeks(startDate, i);
              nextEndDate = addWeeks(endDate, i);
              break;
            case 'monthly':
              nextStartDate = addMonths(startDate, i);
              nextEndDate = addMonths(endDate, i);
              break;
            default:
              continue;
          }

          schedulesToCreate.push({
            ...baseSchedule,
            start_time: nextStartDate.toISOString(),
            end_time: nextEndDate.toISOString()
          });
        }

        // Create all recurring schedules
        for (const schedule of schedulesToCreate) {
          await createSchedule.mutateAsync(schedule);
        }
      }

      // Reset form and close dialog
      setFormData({
        resident_id: '',
        title: '',
        event_type: 'medical',
        start_time: '',
        end_time: '',
        recurring_pattern: 'none',
        color_code: '#3B82F6',
        description: '',
        assigned_staff: '',
        completed: false
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating schedule:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Neuen Termin hinzufügen</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="resident">Bewohner</Label>
            <Select value={formData.resident_id} onValueChange={(value) => setFormData({ ...formData, resident_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Bewohner auswählen" />
              </SelectTrigger>
              <SelectContent>
                {residents.map(resident => (
                  <SelectItem key={resident.id} value={resident.id}>
                    {resident.name} (Zimmer {resident.room})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Titel</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Terminbezeichnung"
              required
            />
          </div>

          <div>
            <Label htmlFor="event_type">Termintyp</Label>
            <Select value={formData.event_type} onValueChange={(value: any) => setFormData({ ...formData, event_type: value })}>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_time">Startzeit</Label>
              <Input
                id="start_time"
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="end_time">Endzeit</Label>
              <Input
                id="end_time"
                type="datetime-local"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="recurring">Wiederholung</Label>
            <Select value={formData.recurring_pattern} onValueChange={(value: any) => setFormData({ ...formData, recurring_pattern: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Keine Wiederholung</SelectItem>
                <SelectItem value="daily">Täglich</SelectItem>
                <SelectItem value="weekly">Wöchentlich</SelectItem>
                <SelectItem value="monthly">Monatlich</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="color">Farbe</Label>
            <div className="flex gap-2 flex-wrap mt-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    formData.color_code === color.value 
                      ? 'border-gray-800 scale-110' 
                      : 'border-gray-300 hover:border-gray-500'
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setFormData({ ...formData, color_code: color.value })}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="assigned_staff">Zuständiges Personal</Label>
            <Input
              id="assigned_staff"
              value={formData.assigned_staff}
              onChange={(e) => setFormData({ ...formData, assigned_staff: e.target.value })}
              placeholder="Name des zuständigen Personals"
            />
          </div>

          <div>
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Zusätzliche Informationen"
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={createSchedule.isPending}>
              {createSchedule.isPending ? 'Wird gespeichert...' : 'Termin speichern'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
