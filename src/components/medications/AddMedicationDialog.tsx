
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Pill } from 'lucide-react';

interface AddMedicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  residentId: string;
  onSave: (medication: any) => void;
}

export function AddMedicationDialog({ 
  open, 
  onOpenChange, 
  residentId, 
  onSave 
}: AddMedicationDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    instructions: '',
    stockCount: 30,
    reorderLevel: 7,
    schedule: {
      morning: 0,
      midday: 0,
      evening: 0,
      night: 0
    },
    customTimes: [] as string[]
  });

  const [customTime, setCustomTime] = useState('');

  const handleScheduleChange = (timeSlot: keyof typeof formData.schedule, value: number) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [timeSlot]: Math.max(0, value)
      }
    }));
  };

  const addCustomTime = () => {
    if (customTime && !formData.customTimes.includes(customTime)) {
      setFormData(prev => ({
        ...prev,
        customTimes: [...prev.customTimes, customTime].sort()
      }));
      setCustomTime('');
    }
  };

  const removeCustomTime = (time: string) => {
    setFormData(prev => ({
      ...prev,
      customTimes: prev.customTimes.filter(t => t !== time)
    }));
  };

  const formatSchedule = () => {
    return `${formData.schedule.morning}-${formData.schedule.midday}-${formData.schedule.evening}-${formData.schedule.night}`;
  };

  const handleSave = () => {
    const medication = {
      id: Date.now().toString(),
      residentId,
      name: formData.name,
      dosage: formData.dosage,
      schedule: formData.schedule,
      instructions: formData.instructions,
      stockCount: formData.stockCount,
      reorderLevel: formData.reorderLevel,
      times: formData.customTimes,
      createdAt: new Date().toISOString()
    };
    
    onSave(medication);
    onOpenChange(false);
    
    // Reset form
    setFormData({
      name: '',
      dosage: '',
      instructions: '',
      stockCount: 30,
      reorderLevel: 7,
      schedule: { morning: 0, midday: 0, evening: 0, night: 0 },
      customTimes: []
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-blue-500" />
            Neues Medikament hinzufügen
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Grundinformationen</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="med-name">Medikamentenname *</Label>
                <Input
                  id="med-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="z.B. Aspirin 100mg"
                />
              </div>
              
              <div>
                <Label htmlFor="dosage">Dosierung *</Label>
                <Input
                  id="dosage"
                  value={formData.dosage}
                  onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                  placeholder="z.B. 1 Tablette"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="instructions">Einnahmehinweise</Label>
              <Textarea
                id="instructions"
                value={formData.instructions}
                onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                placeholder="z.B. Nach dem Frühstück einnehmen"
                rows={2}
              />
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Einnahmeplan</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { key: 'morning', label: 'Morgens', time: '08:00' },
                { key: 'midday', label: 'Mittags', time: '13:00' },
                { key: 'evening', label: 'Abends', time: '20:00' },
                { key: 'night', label: 'Nachts', time: '22:00' }
              ].map(timeSlot => (
                <div key={timeSlot.key} className="space-y-2">
                  <Label className="text-sm">{timeSlot.label} ({timeSlot.time})</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleScheduleChange(timeSlot.key as keyof typeof formData.schedule, formData.schedule[timeSlot.key as keyof typeof formData.schedule] - 1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-mono">
                      {formData.schedule[timeSlot.key as keyof typeof formData.schedule]}
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleScheduleChange(timeSlot.key as keyof typeof formData.schedule, formData.schedule[timeSlot.key as keyof typeof formData.schedule] + 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-3 rounded">
              <Label className="text-sm font-medium">Schema: {formatSchedule()}</Label>
              <p className="text-xs text-gray-600 mt-1">
                Format: Morgens-Mittags-Abends-Nachts
              </p>
            </div>
          </div>

          {/* Custom Times */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Individuelle Zeiten (optional)</h3>
            
            <div className="flex gap-2">
              <Input
                type="time"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                placeholder="Uhrzeit hinzufügen"
              />
              <Button onClick={addCustomTime} disabled={!customTime}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {formData.customTimes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.customTimes.map(time => (
                  <Badge key={time} variant="outline" className="flex items-center gap-1">
                    {time}
                    <button
                      onClick={() => removeCustomTime(time)}
                      className="ml-1 hover:text-red-500"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Stock Management */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Lagerbestand</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stock-count">Aktueller Bestand</Label>
                <Input
                  id="stock-count"
                  type="number"
                  value={formData.stockCount}
                  onChange={(e) => setFormData(prev => ({ ...prev, stockCount: parseInt(e.target.value) || 0 }))}
                />
              </div>
              
              <div>
                <Label htmlFor="reorder-level">Nachbestellgrenze</Label>
                <Input
                  id="reorder-level"
                  type="number"
                  value={formData.reorderLevel}
                  onChange={(e) => setFormData(prev => ({ ...prev, reorderLevel: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSave} disabled={!formData.name || !formData.dosage}>
              Medikament hinzufügen
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
