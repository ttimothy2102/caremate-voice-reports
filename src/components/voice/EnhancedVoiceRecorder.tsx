
import React, { useState, useRef } from 'react';
import { Mic, MicOff, Square, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCreateCareReport } from '@/hooks/useCareReports';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

interface EnhancedVoiceRecorderProps {
  onTranscriptionComplete: (report: any) => void;
  residentId?: string;
}

export function EnhancedVoiceRecorder({ onTranscriptionComplete, residentId }: EnhancedVoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { mutate: createCareReport } = useCreateCareReport();
  const { user } = useAuth();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudioWithAI(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const processAudioWithAI = async (audioBlob: Blob) => {
    try {
      // Convert audio to base64 for API call
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        
        // Call our Edge Function for speech-to-text and structuring
        const response = await fetch('/api/process-voice-note', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            audio: base64Audio.split(',')[1], // Remove data:audio/webm;base64, prefix
            residentId
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to process audio');
        }

        const result = await response.json();
        setTranscript(result.transcript);
        
        const structuredReport = {
          physical_condition: result.structured.physical_condition,
          mood: result.structured.mood,
          food_water_intake: result.structured.food_water_intake,
          medication_given: result.structured.medication_given,
          special_notes: result.structured.special_notes,
          voice_transcript: result.transcript
        };

        // Save to database if residentId is provided
        if (residentId && user) {
          createCareReport({
            resident_id: residentId,
            caregiver_id: user.id,
            ...structuredReport
          });
        }

        onTranscriptionComplete(structuredReport);
        setIsProcessing(false);
        
        toast({
          title: "Voice Note Processed",
          description: "Your voice note has been transcribed and structured.",
        });
      };
      
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Error processing audio:', error);
      setIsProcessing(false);
      toast({
        title: "Processing Error",
        description: "Failed to process voice note. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Enhanced Voice Documentation</h2>
        <p className="text-gray-600 text-sm">Record and automatically structure care reports with AI</p>
      </div>

      <div className="flex justify-center">
        <div className="relative">
          <Button
            size="lg"
            className={`w-20 h-20 rounded-full shadow-lg transition-all ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : isProcessing
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-caremate-gradient hover:opacity-90'
            }`}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            ) : isRecording ? (
              <Square className="w-8 h-8 text-white" />
            ) : (
              <Mic className="w-8 h-8 text-white" />
            )}
          </Button>
          
          {isRecording && (
            <div className="absolute -inset-2 border-4 border-red-300 rounded-full animate-ping opacity-75"></div>
          )}
        </div>
      </div>

      <div className="text-center">
        {isRecording && (
          <p className="text-red-600 font-medium">Recording... Tap to stop</p>
        )}
        {isProcessing && (
          <p className="text-blue-600 font-medium">Processing with AI...</p>
        )}
        {!isRecording && !isProcessing && (
          <p className="text-gray-500">Tap to start recording</p>
        )}
      </div>

      {transcript && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">AI Transcription:</h3>
          <p className="text-blue-800 text-sm leading-relaxed">{transcript}</p>
        </Card>
      )}
    </div>
  );
}
