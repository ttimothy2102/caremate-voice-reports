
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Pill, Activity } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

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

  const processMedications = (medications: string[]) => {
    return medications.map(med => ({
      name: med,
      confidence: 0.8,
      matched: checkMedicationMatch(med)
    }));
  };

  const checkMedicationMatch = (medicationName: string) => {
    const commonMedications = [
      'Aspirin', 'Metformin', 'Lisinopril', 'Ibuprofen', 
      'Paracetamol', 'Omeprazol', 'Simvastatin'
    ];
    
    return commonMedications.some(med => 
      med.toLowerCase().includes(medicationName.toLowerCase()) ||
      medicationName.toLowerCase().includes(med.toLowerCase())
    );
  };

  const processVitals = (vitals: Record<string, any>): DetectedVital[] => {
    const processedVitals: DetectedVital[] = [];
    
    Object.entries(vitals).forEach(([key, value]) => {
      if (typeof value === 'string' && value !== 'Not mentioned') {
        // Extract blood pressure
        const bpMatch = value.match(/(\d+)\/(\d+)/);
        if (bpMatch) {
          processedVitals.push({
            type: 'Blood Pressure',
            value: `${bpMatch[1]}/${bpMatch[2]}`,
            unit: 'mmHg'
          });
        }
        
        // Extract pulse
        const pulseMatch = value.match(/Pulse\s*:?\s*(\d+)/i);
        if (pulseMatch) {
          processedVitals.push({
            type: 'Pulse',
            value: pulseMatch[1],
            unit: 'bpm'
          });
        }
        
        // Extract temperature
        const tempMatch = value.match(/Temperature\s*:?\s*(\d+(?:,|\.)\d+)/i);
        if (tempMatch) {
          processedVitals.push({
            type: 'Temperature',
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
      title: "Medication Confirmed",
      description: `${medication} has been marked as administered`,
    });
  };

  const handleVitalConfirm = (vital: DetectedVital) => {
    const vitalKey = `${vital.type}-${vital.value}`;
    setConfirmedVitals(prev => [...prev, vitalKey]);
    onVitalConfirmed(vital);
    
    toast({
      title: "Vital Sign Recorded",
      description: `${vital.type}: ${vital.value} ${vital.unit || ''} has been saved`,
    });
  };

  if (processedMedications.length === 0 && processedVitals.length === 0) {
    return null;
  }

  return (
    <Card className="p-4 bg-green-50 border-green-200">
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle className="w-5 h-5 text-green-600" />
        <h3 className="font-medium text-green-800">AI Detection Results</h3>
      </div>

      {processedMedications.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
            <Pill className="w-4 h-4" />
            Detected Medications:
          </h4>
          <div className="space-y-2">
            {processedMedications.map((med, index) => (
              <div key={index} className="flex items-center justify-between bg-white rounded-md p-2 border">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{med.name}</span>
                  {med.matched ? (
                    <Badge variant="outline" className="text-green-700 border-green-300">
                      Known Medication
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Unknown
                    </Badge>
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={() => handleMedicationConfirm(med.name)}
                  disabled={confirmedMeds.includes(med.name)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {confirmedMeds.includes(med.name) ? 'Confirmed' : 'Confirm'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {processedVitals.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
            <Activity className="w-4 h-4" />
            Detected Vital Signs:
          </h4>
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
                    {confirmedVitals.includes(vitalKey) ? 'Saved' : 'Save'}
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
