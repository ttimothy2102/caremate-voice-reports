
import React, { useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Pill } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface DetectedMedication {
  name: string;
  confidence: number;
  time?: string;
  dosage?: string;
}

interface DetectedVital {
  type: string;
  value: string;
  unit?: string;
}

interface MedicationDetectorProps {
  detectedMedications: string[];
  detectedVitals: Record<string, any>;
  residentId?: string;
  onMedicationConfirmed: (medication: string) => void;
  onVitalConfirmed: (vital: DetectedVital) => void;
}

export function MedicationDetector({ 
  detectedMedications, 
  detectedVitals, 
  residentId,
  onMedicationConfirmed,
  onVitalConfirmed 
}: MedicationDetectorProps) {
  const [confirmedMeds, setConfirmedMeds] = React.useState<string[]>([]);
  const [confirmedVitals, setConfirmedVitals] = React.useState<string[]>([]);

  // Auto-detect common medication patterns
  const processMedications = (medications: string[]) => {
    return medications.map(med => ({
      name: med,
      confidence: 0.8, // We could implement actual confidence scoring
      matched: checkMedicationMatch(med)
    }));
  };

  // Check if detected medication matches known medications for this resident
  const checkMedicationMatch = (medicationName: string) => {
    // This would normally check against the resident's medication list
    const commonMedications = [
      'Aspirin', 'Metformin', 'Lisinopril', 'Ibuprofen', 
      'Paracetamol', 'Omeprazol', 'Simvastatin'
    ];
    
    return commonMedications.some(med => 
      med.toLowerCase().includes(medicationName.toLowerCase()) ||
      medicationName.toLowerCase().includes(med.toLowerCase())
    );
  };

  // Process detected vital signs
  const processVitals = (vitals: Record<string, any>) => {
    const processedVitals: DetectedVital[] = [];
    
    Object.entries(vitals).forEach(([key, value]) => {
      if (typeof value === 'string' && value !== 'Nicht erwähnt') {
        // Extract blood pressure
        const bpMatch = value.match(/(\d+)\/(\d+)/);
        if (bpMatch) {
          processedVitals.push({
            type: 'Blutdruck',
            value: `${bpMatch[1]}/${bpMatch[2]}`,
            unit: 'mmHg'
          });
        }
        
        // Extract pulse
        const pulseMatch = value.match(/Puls\s*:?\s*(\d+)/i);
        if (pulseMatch) {
          processedVitals.push({
            type: 'Puls',
            value: pulseMatch[1],
            unit: 'bpm'
          });
        }
        
        // Extract temperature
        const tempMatch = value.match(/Temperatur\s*:?\s*(\d+(?:,|\.)\d+)/i);
        if (tempMatch) {
          processedVitals.push({
            type: 'Temperatur',
            value: tempMatch[1].replace(',', '.'),
            unit: '°C'
          });
        }
      }
    });
    
    return processedVitals;
  };

  const processedMedications = processMedications(detectedMedications);
  const processedVitals = processVitals(detectedVitals);

  const handleMedicationConfirm = (medication: string) => {
    setConfirmedMeds(prev => [...prev, medication]);
    onMedicationConfirmed(medication);
    
    toast({
      title: "Medikament bestätigt",
      description: `${medication} wurde als verabreicht markiert`,
    });
  };

  const handleVitalConfirm = (vital: DetectedVital) => {
    const vitalKey = `${vital.type}-${vital.value}`;
    setConfirmedVitals(prev => [...prev, vitalKey]);
    onVitalConfirmed(vital);
    
    toast({
      title: "Vitalwert erfasst",
      description: `${vital.type}: ${vital.value} ${vital.unit || ''} wurde gespeichert`,
    });
  };

  if (processedMedications.length === 0 && processedVitals.length === 0) {
    return null;
  }

  return (
    <Card className="p-4 bg-green-50 border-green-200">
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle className="w-5 h-5 text-green-600" />
        <h3 className="font-medium text-green-800">Automatische Erkennung</h3>
      </div>

      {processedMedications.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
            <Pill className="w-4 h-4" />
            Erkannte Medikamente:
          </h4>
          <div className="space-y-2">
            {processedMedications.map((med, index) => (
              <div key={index} className="flex items-center justify-between bg-white rounded-md p-2 border">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{med.name}</span>
                  {med.matched && (
                    <Badge variant="outline" className="text-green-700 border-green-300">
                      Bekanntes Medikament
                    </Badge>
                  )}
                  {!med.matched && (
                    <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Unbekannt
                    </Badge>
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={() => handleMedicationConfirm(med.name)}
                  disabled={confirmedMeds.includes(med.name)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {confirmedMeds.includes(med.name) ? 'Bestätigt' : 'Bestätigen'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {processedVitals.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-green-700 mb-2">Erkannte Vitalwerte:</h4>
          <div className="space-y-2">
            {processedVitals.map((vital, index) => {
              const vitalKey = `${vital.type}-${vital.value}`;
              return (
                <div key={index} className="flex items-center justify-between bg-white rounded-md p-2 border">
                  <div>
                    <span className="font-medium">{vital.type}: </span>
                    <span>{vital.value} {vital.unit}</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleVitalConfirm(vital)}
                    disabled={confirmedVitals.includes(vitalKey)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {confirmedVitals.includes(vitalKey) ? 'Gespeichert' : 'Speichern'}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}
