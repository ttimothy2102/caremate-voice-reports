
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Check, Save } from 'lucide-react';

interface ReportData {
  physicalCondition: string;
  mood: string;
  foodWaterIntake: string;
  medicationGiven: string;
  specialNotes: string;
  timestamp: string;
}

interface GeneratedReportProps {
  reportData: ReportData;
  onEdit: () => void;
  onApprove: () => void;
}

export function GeneratedReport({ reportData, onEdit, onApprove }: GeneratedReportProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState(reportData);

  const handleSaveEdit = () => {
    setIsEditing(false);
    // Here you could update the report data in the database
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Generierter Pflegebericht</h2>
        <p className="text-gray-600 text-sm">KI-strukturiert aus Ihrer Sprachnotiz</p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Erstellt um {editableData.timestamp}</span>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-800">Körperlicher Zustand</h3>
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
            </div>
            {isEditing ? (
              <Textarea
                value={editableData.physicalCondition}
                onChange={(e) => setEditableData(prev => ({ ...prev, physicalCondition: e.target.value }))}
                className="bg-gray-50"
              />
            ) : (
              <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">{editableData.physicalCondition}</p>
            )}
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Stimmung & Verhalten</h3>
            {isEditing ? (
              <Textarea
                value={editableData.mood}
                onChange={(e) => setEditableData(prev => ({ ...prev, mood: e.target.value }))}
                className="bg-gray-50"
              />
            ) : (
              <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">{editableData.mood}</p>
            )}
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Nahrungs- & Flüssigkeitsaufnahme</h3>
            {isEditing ? (
              <Textarea
                value={editableData.foodWaterIntake}
                onChange={(e) => setEditableData(prev => ({ ...prev, foodWaterIntake: e.target.value }))}
                className="bg-gray-50"
              />
            ) : (
              <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">{editableData.foodWaterIntake}</p>
            )}
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Medikation</h3>
            {isEditing ? (
              <Textarea
                value={editableData.medicationGiven}
                onChange={(e) => setEditableData(prev => ({ ...prev, medicationGiven: e.target.value }))}
                className="bg-gray-50"
              />
            ) : (
              <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">{editableData.medicationGiven}</p>
            )}
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Besondere Notizen</h3>
            {isEditing ? (
              <Textarea
                value={editableData.specialNotes}
                onChange={(e) => setEditableData(prev => ({ ...prev, specialNotes: e.target.value }))}
                className="bg-gray-50"
              />
            ) : (
              <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">{editableData.specialNotes}</p>
            )}
          </div>
        </div>
      </Card>

      <div className="flex gap-3">
        {isEditing ? (
          <>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setIsEditing(false)}
            >
              Abbrechen
            </Button>
            <Button 
              className="flex-1 bg-caremate-gradient hover:opacity-90"
              onClick={handleSaveEdit}
            >
              <Save className="w-4 h-4 mr-2" />
              Änderungen speichern
            </Button>
          </>
        ) : (
          <>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={onEdit}
            >
              <Edit className="w-4 h-4 mr-2" />
              Bericht bearbeiten
            </Button>
            <Button 
              className="flex-1 bg-caremate-gradient hover:opacity-90"
              onClick={onApprove}
            >
              <Check className="w-4 h-4 mr-2" />
              Genehmigen & Speichern
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
