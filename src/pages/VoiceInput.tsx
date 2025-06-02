
import React, { useState } from 'react';
import { MobileHeader } from "@/components/layout/MobileHeader";
import { EnhancedVoiceRecorder } from "@/components/voice/EnhancedVoiceRecorder";
import { GeneratedReport } from "@/components/reports/GeneratedReport";
import { useNavigate } from 'react-router-dom';

export function VoiceInput() {
  const navigate = useNavigate();
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  const handleTranscriptionComplete = (structuredReport: any) => {
    setReportData({
      physicalCondition: structuredReport.physical_condition,
      mood: structuredReport.mood,
      foodWaterIntake: structuredReport.food_water_intake,
      medicationGiven: structuredReport.medication_given,
      specialNotes: structuredReport.special_notes,
      timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
    });
    setShowReport(true);
  };

  const handleEdit = () => {
    setShowReport(false);
  };

  const handleApprove = () => {
    navigate('/mobile-home');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader 
        title="AI Voice Documentation" 
        showBack 
        onBack={() => navigate('/mobile-home')} 
      />
      
      {!showReport ? (
        <EnhancedVoiceRecorder onTranscriptionComplete={handleTranscriptionComplete} />
      ) : (
        <GeneratedReport 
          reportData={reportData}
          onEdit={handleEdit}
          onApprove={handleApprove}
        />
      )}
    </div>
  );
}
