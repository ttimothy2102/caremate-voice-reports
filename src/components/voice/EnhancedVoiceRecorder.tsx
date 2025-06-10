
import React, { useState } from 'react';
import { VoiceRecorderButton } from './VoiceRecorderButton';
import { RecordingTimer } from './RecordingTimer';
import { TranscriptEditor } from './TranscriptEditor';
import { LiveTranscription } from './LiveTranscription';
import { MedicationDetector } from './MedicationDetector';
import { useVoiceRecording } from './hooks/useVoiceRecording';
import { useCreateCareReport } from '@/hooks/useCareReports';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

interface EnhancedVoiceRecorderProps {
  onTranscriptionComplete: (report: any) => void;
  residentId?: string;
}

export function EnhancedVoiceRecorder({ onTranscriptionComplete, residentId }: EnhancedVoiceRecorderProps) {
  const [transcript, setTranscript] = useState('');
  const [detectedMedications, setDetectedMedications] = useState<string[]>([]);
  const [detectedVitals, setDetectedVitals] = useState<Record<string, any>>({});
  const { mutate: createCareReport } = useCreateCareReport();
  const { user } = useAuth();
  
  const {
    isRecording,
    isProcessing,
    recordingTime,
    liveTranscript,
    startRecording,
    stopRecording,
    processAudioWithAI
  } = useVoiceRecording();

  const handleToggleRecording = async () => {
    if (isRecording) {
      await handleStopRecording();
    } else {
      await handleStartRecording();
    }
  };

  const handleStartRecording = async () => {
    setTranscript('');
    setDetectedMedications([]);
    setDetectedVitals({});
    await startRecording();
  };

  const handleStopRecording = async () => {
    const audioBlob = await stopRecording();
    if (!audioBlob) return;

    try {
      const result = await processAudioWithAI(audioBlob, residentId) as any;
      
      setTranscript(result.transcript);
      setDetectedMedications(result.structuredReport.detected_medications || []);
      setDetectedVitals(result.structuredReport.detected_vitals || {});
      
      if (residentId && user) {
        createCareReport({
          resident_id: residentId,
          caregiver_id: user.id,
          ...result.structuredReport
        });
      }

      onTranscriptionComplete(result.structuredReport);
    } catch (error) {
      console.error('Processing failed:', error);
      toast({
        title: "Processing Error",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    }
  };

  const handleTranscriptUpdate = (updatedTranscript: string) => {
    setTranscript(updatedTranscript);
    
    const updatedReport = {
      physical_condition: "Edited",
      mood: "Edited", 
      food_water_intake: "Edited",
      medication_given: "Edited",
      special_notes: "Edited",
      voice_transcript: updatedTranscript
    };
    
    onTranscriptionComplete(updatedReport);
  };

  const handleMedicationConfirmed = (medication: string) => {
    console.log('Medication confirmed:', medication);
    // Integration with medication system would go here
  };

  const handleVitalConfirmed = (vital: any) => {
    console.log('Vital sign confirmed:', vital);
    // Integration with vital signs system would go here
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Voice Transcription</h2>
        <p className="text-gray-600 text-sm">Record care reports with AI assistance</p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <VoiceRecorderButton
          isRecording={isRecording}
          isProcessing={isProcessing}
          onToggleRecording={handleToggleRecording}
        />

        <RecordingTimer
          isRecording={isRecording}
          isProcessing={isProcessing}
          recordingTime={recordingTime}
        />
      </div>

      <LiveTranscription
        isRecording={isRecording}
        isProcessing={isProcessing}
        liveTranscript={liveTranscript}
        recordingTime={recordingTime}
      />

      <MedicationDetector
        detectedMedications={detectedMedications}
        detectedVitals={detectedVitals}
        residentId={residentId}
        onMedicationConfirmed={handleMedicationConfirmed}
        onVitalConfirmed={handleVitalConfirmed}
      />

      <TranscriptEditor
        transcript={transcript}
        onTranscriptUpdate={handleTranscriptUpdate}
      />
    </div>
  );
}
