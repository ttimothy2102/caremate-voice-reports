
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ColorCodedEditor } from "@/components/ui/color-coded-editor";
import { AlertTriangle, Pill } from 'lucide-react';
import { ExtendedResident } from '@/components/residents/ResidentsList';

interface DeviationsSectionProps {
  resident: ExtendedResident;
  onUpdate: (updates: Partial<ExtendedResident>) => void;
}

export function DeviationsSection({ resident, onUpdate }: DeviationsSectionProps) {
  const handleCareDeviationChange = (value: string, colorCode?: string) => {
    onUpdate({ 
      care_deviations: value,
      care_deviations_color: colorCode 
    });
  };

  const handleMedicationDeviationChange = (value: string, colorCode?: string) => {
    onUpdate({ 
      medication_deviations: value,
      medication_deviations_color: colorCode 
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Abweichungen bei Maßnahmen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="care_deviations">Dokumentation von Abweichungen</Label>
            <ColorCodedEditor
              value={resident.care_deviations || ''}
              onChange={handleCareDeviationChange}
              placeholder="Dokumentation von Abweichungen bei geplanten Pflegemaßnahmen..."
              rows={6}
              autoColorCode={true}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Pill className="w-5 h-5 text-red-500" />
            Abweichungen bei der Medikation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="medication_deviations">Dokumentation von Medikationsabweichungen</Label>
            <ColorCodedEditor
              value={resident.medication_deviations || ''}
              onChange={handleMedicationDeviationChange}
              placeholder="Dokumentation von Medikationsabweichungen..."
              rows={6}
              autoColorCode={true}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
