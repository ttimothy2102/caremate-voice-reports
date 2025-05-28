
import React, { useState } from 'react';
import { MobileHeader } from "@/components/layout/MobileHeader";
import { VoiceRecorder } from "@/components/voice/VoiceRecorder";
import { GeneratedReport } from "@/components/reports/GeneratedReport";
import { useNavigate } from 'react-router-dom';

export function VoiceInput() {
  const navigate = useNavigate();
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  const handleTranscriptionComplete = (transcript: string) => {
    // Simulate AI processing
    setTimeout(() => {
      const mockReport = {
        physicalCondition: "Patient appears stable with normal mobility. Blood pressure recorded at 125/80 mmHg, pulse 76 bpm. No signs of distress observed.",
        mood: "Resident was in good spirits during the morning. Participated actively in conversation and showed positive engagement with activities.",
        foodWaterIntake: "Ate breakfast well, consuming approximately 80% of meal. Adequate fluid intake observed throughout the morning.",
        medicationGiven: "Morning medications administered as prescribed: Ibuprofen 20mg taken without difficulty.",
        specialNotes: "No concerns noted. Continue current care plan. Next assessment scheduled for this afternoon.",
        timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
      };
      setReportData(mockReport);
      setShowReport(true);
    }, 1500);
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
        title="Voice Documentation" 
        showBack 
        onBack={() => navigate('/mobile-home')} 
      />
      
      {!showReport ? (
        <VoiceRecorder onTranscriptionComplete={handleTranscriptionComplete} />
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
