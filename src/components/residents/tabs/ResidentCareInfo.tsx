
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ExtendedResident } from '../ResidentsList';
import { Clipboard, AlertTriangle, Pill, FileText } from 'lucide-react';

interface ResidentCareInfoProps {
  resident: ExtendedResident;
  onUpdate: (updates: Partial<ExtendedResident>) => void;
}

export function ResidentCareInfo({ resident, onUpdate }: ResidentCareInfoProps) {
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
              value={resident.care_situation}
              onChange={(e) => onUpdate({ care_situation: e.target.value })}
              placeholder="Beschreibung der Pflegesituation, Mobilität und besonderen Bedürfnisse..."
              rows={6}
            />
          </div>
          
          <div>
            <Label htmlFor="hygiene_data">Hygienedaten</Label>
            <Textarea
              id="hygiene_data"
              value={resident.hygiene_data}
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
            <Textarea
              id="shift_notes"
              value={resident.shift_notes}
              onChange={(e) => onUpdate({ shift_notes: e.target.value })}
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
            <Textarea
              id="care_deviations"
              value={resident.care_deviations}
              onChange={(e) => onUpdate({ care_deviations: e.target.value })}
              placeholder="Dokumentation von Abweichungen bei geplanten Pflegemaßnahmen..."
              rows={6}
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
            <Textarea
              id="medication_deviations"
              value={resident.medication_deviations}
              onChange={(e) => onUpdate({ medication_deviations: e.target.value })}
              placeholder="Dokumentation von Medikationsabweichungen..."
              rows={4}
            />
          </div>
          
          <div>
            <Label htmlFor="emergency_medication">Bedarfsmedikation</Label>
            <Textarea
              id="emergency_medication"
              value={resident.emergency_medication}
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
