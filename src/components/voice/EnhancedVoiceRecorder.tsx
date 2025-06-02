
import React, { useState } from 'react';
import { VoiceRecorderButton } from './VoiceRecorderButton';
import { RecordingTimer } from './RecordingTimer';
import { TranscriptEditor } from './TranscriptEditor';
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
  const { mutate: createCareReport } = useCreateCareReport();
  const { user } = useAuth();
  
  const {
    isRecording,
    isProcessing,
    recordingTime,
    startRecording,
    stopRecording,
    processAudioWithAI
  } = useVoiceRecording();

  const toggleRecording = async () => {
    if (isRecording) {
      const audioBlob = await stopRecording();
      if (audioBlob) {
        try {
          const result = await processAudioWithAI(audioBlob, residentId) as any;
          setTranscript(result.transcript);
          
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
        }
      }
    } else {
      setTranscript('');
      await startRecording();
    }
  };

  const handleTranscriptUpdate = (updatedTranscript: string) => {
    setTranscript(updatedTranscript);
    
    const updatedReport = {
      physical_condition: "Bearbeitet",
      mood: "Bearbeitet", 
      food_water_intake: "Bearbeitet",
      medication_given: "Bearbeitet",
      special_notes: "Bearbeitet",
      voice_transcript: updatedTranscript
    };
    
    onTranscriptionComplete(updatedReport);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Sprachtranskription</h2>
        <p className="text-gray-600 text-sm">Nehmen Sie Pflegeberichte mit KI-Unterstützung auf</p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <VoiceRecorderButton
          isRecording={isRecording}
          isProcessing={isProcessing}
          onToggleRecording={toggleRecording}
        />

        <RecordingTimer
          isRecording={isRecording}
          isProcessing={isProcessing}
          recordingTime={recordingTime}
        />
      </div>

      <TranscriptEditor
        transcript={transcript}
        onTranscriptUpdate={handleTranscriptUpdate}
      />
    </div>
  );
}
