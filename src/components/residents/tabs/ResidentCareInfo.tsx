
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ColorCodedEditor } from "@/components/ui/color-coded-editor";
import { ExtendedResident } from '../ResidentsList';
import { Clipboard, AlertTriangle, Pill, FileText } from 'lucide-react';

interface ResidentCareInfoProps {
  resident: ExtendedResident;
  onUpdate: (updates: Partial<ExtendedResident>) => void;
}

export function ResidentCareInfo({ resident, onUpdate }: ResidentCareInfoProps) {
  const handleShiftNotesChange = (value: string, colorCode?: string) => {
    onUpdate({ 
      shift_notes: value,
      shift_notes_color: colorCode 
    });
  };

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
            <Clipboard className="w-5 h-5 text-blue-500" />
            Pflegesituation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="care_situation">Mobilität & Pflegebedarf</Label>
            <Textarea
              id="care_situation"
              value={resident.care_situation || ''}
              onChange={(e) => onUpdate({ care_situation: e.target.value })}
              placeholder="Beschreibung der Pflegesituation, Mobilität und besonderen Bedürfnisse..."
              rows={6}
            />
          </div>
          
          <div>
            <Label htmlFor="hygiene_data">Hygienedaten</Label>
            <Textarea
              id="hygiene_data"
              value={resident.hygiene_data || ''}
              onChange={(e) => onUpdate({ hygiene_data: e.target.value })}
              placeholder="Hygienemaßnahmen, Besonderheiten bei der Körperpflege..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-500" />
            Schichtübergabe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="shift_notes">Wichtige Informationen für den nächsten Dienst</Label>
            <ColorCodedEditor
              value={resident.shift_notes || ''}
              onChange={handleShiftNotesChange}
              placeholder="Wichtige Beobachtungen, Besonderheiten, Anweisungen für die nächste Schicht..."
              rows={10}
            />
          </div>
        </CardContent>
      </Card>

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
            Medikation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="medication_deviations">Abweichungen bei der Medikation</Label>
            <ColorCodedEditor
              value={resident.medication_deviations || ''}
              onChange={handleMedicationDeviationChange}
              placeholder="Dokumentation von Medikationsabweichungen..."
              rows={4}
              autoColorCode={true}
            />
          </div>
          
          <div>
            <Label htmlFor="emergency_medication">Bedarfsmedikation</Label>
            <Textarea
              id="emergency_medication"
              value={resident.emergency_medication || ''}
              onChange={(e) => onUpdate({ emergency_medication: e.target.value })}
              placeholder="Bedarfsmedikation und Anwendungshinweise..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
