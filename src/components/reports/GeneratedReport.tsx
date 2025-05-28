
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Edit, Check } from 'lucide-react';

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
  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Generated Care Report</h2>
        <p className="text-gray-600 text-sm">AI-structured from your voice note</p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Generated at {reportData.timestamp}</span>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Physical Condition</h3>
            <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">{reportData.physicalCondition}</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Mood & Behavior</h3>
            <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">{reportData.mood}</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Food & Water Intake</h3>
            <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">{reportData.foodWaterIntake}</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Medication</h3>
            <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">{reportData.medicationGiven}</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Special Notes</h3>
            <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">{reportData.specialNotes}</p>
          </div>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={onEdit}
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Report
        </Button>
        <Button 
          className="flex-1 bg-caremate-gradient hover:opacity-90"
          onClick={onApprove}
        >
          <Check className="w-4 h-4 mr-2" />
          Approve & Save
        </Button>
      </div>
    </div>
  );
}
