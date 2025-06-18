
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pill, Clock, AlertTriangle } from 'lucide-react';
import { MedicationDetailsModal } from './MedicationDetailsModal';

export function MedicationOverview() {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'current' | 'overdue'>('current');

  const getCurrentTimeSlot = () => {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'midday';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  };

  const getTimeSlotLabel = (slot: string) => {
    switch (slot) {
      case 'morning': return 'Morgens';
      case 'midday': return 'Mittags';
      case 'evening': return 'Abends';
      case 'night': return 'Nachts';
      default: return slot;
    }
  };

  const currentTimeSlot = getCurrentTimeSlot();
  const currentMedicationCount = 8; // Mock data - in real app, calculate from actual medications
  const overdueCount = 2; // Mock data

  // Mock data for current medications
  const currentMedications = [
    {
      id: '1',
      drugName: 'Aspirin',
      dosage: '100mg',
      residentName: 'Maria Schmidt',
      residentRoom: '101',
      scheduledTime: '08:00',
      isOverdue: false,
      instructions: 'Mit dem Essen einnehmen'
    },
    {
      id: '2',
      drugName: 'Metformin',
      dosage: '500mg',
      residentName: 'Hans Müller',
      residentRoom: '102',
      scheduledTime: '08:30',
      isOverdue: false
    },
    // Add more mock data as needed
  ];

  // Mock data for overdue medications
  const overdueMedications = [
    {
      id: '3',
      drugName: 'Insulin',
      dosage: '10 Einheiten',
      residentName: 'Anna Weber',
      residentRoom: '103',
      scheduledTime: '07:00',
      isOverdue: true,
      instructions: 'Vor dem Frühstück'
    },
    {
      id: '4',
      drugName: 'Blutdrucktablette',
      dosage: '5mg',
      residentName: 'Peter Klein',
      residentRoom: '104',
      scheduledTime: '06:30',
      isOverdue: true
    }
  ];

  const handleCurrentClick = () => {
    setModalType('current');
    setShowModal(true);
  };

  const handleOverdueClick = () => {
    setModalType('overdue');
    setShowModal(true);
  };

  const getModalTitle = () => {
    if (modalType === 'current') {
      return `Aktuelle Medikamentengabe - ${getTimeSlotLabel(currentTimeSlot)}`;
    }
    return 'Überfällige Medikamente';
  };

  const getModalMedications = () => {
    return modalType === 'current' ? currentMedications : overdueMedications;
  };

  return (
    <>
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Aktuelle Medikamentengabe</h3>
          </div>
          <Badge variant="outline" className="text-xs">
            {getTimeSlotLabel(currentTimeSlot)}
          </Badge>
        </div>

        <div className="space-y-3">
          <div 
            className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
            onClick={handleCurrentClick}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Jetzt fällig</span>
            </div>
            <span className="text-lg font-bold text-blue-600">{currentMedicationCount}</span>
          </div>

          {overdueCount > 0 && (
            <div 
              className="flex items-center justify-between cursor-pointer hover:bg-red-50 p-2 rounded transition-colors"
              onClick={handleOverdueClick}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-600">Überfällig</span>
              </div>
              <span className="text-lg font-bold text-red-600">{overdueCount}</span>
            </div>
          )}

          <div className="pt-2 border-t">
            <p className="text-xs text-gray-500">
              Nächste Medikamentengabe: {currentTimeSlot === 'night' ? 'Morgen 08:00' : 
              currentTimeSlot === 'morning' ? 'Mittag 12:00' :
              currentTimeSlot === 'midday' ? 'Abend 18:00' : 'Nacht 22:00'}
            </p>
          </div>
        </div>
      </Card>

      <MedicationDetailsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={getModalTitle()}
        medications={getModalMedications()}
        showOverdueDetails={modalType === 'overdue'}
      />
    </>
  );
}
