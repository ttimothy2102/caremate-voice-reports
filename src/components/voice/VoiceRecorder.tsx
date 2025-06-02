
import React, { useState, useRef } from 'react';
import { Mic, MicOff, Square } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCreateCareReport } from '@/hooks/useCareReports';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

interface VoiceRecorderProps {
  onTranscriptionComplete: (text: string) => void;
  residentId?: string;
}

export function VoiceRecorder({ onTranscriptionComplete, residentId }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { mutate: createCareReport } = useCreateCareReport();
  const { user } = useAuth();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        simulateTranscription();
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
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

  const simulateTranscription = () => {
    // Simulate AI transcription delay
    setTimeout(() => {
      const mockTranscript = "Anna had a good morning. She ate breakfast well and took her medication. She seemed in good spirits and participated in the morning activities. Blood pressure was 125/80, pulse 76 bpm. No concerns noted.";
      setTranscript(mockTranscript);
      setIsProcessing(false);
      onTranscriptionComplete(mockTranscript);
      
      // Save to database if residentId is provided
      if (residentId && user) {
        createCareReport({
          resident_id: residentId,
          caregiver_id: user.id,
          voice_transcript: mockTranscript,
          physical_condition: "Good",
          mood: "Good spirits",
          food_water_intake: "Ate breakfast well",
          medication_given: "Taken as prescribed",
          special_notes: "No concerns noted"
        });
        
        toast({
          title: "Care Report Saved",
          description: "Voice recording has been processed and saved.",
        });
      }
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Voice Documentation</h2>
        <p className="text-gray-600 text-sm">Describe the resident's state in your own words</p>
      </div>

      <div className="flex justify-center">
        <div className="relative">
          <Button
            size="lg"
            className={`w-20 h-20 rounded-full shadow-lg transition-all ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse-slow' 
                : 'bg-caremate-gradient hover:opacity-90'
            }`}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
          >
            {isRecording ? (
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
          <p className="text-blue-600 font-medium">Processing your voice...</p>
        )}
        {!isRecording && !isProcessing && (
          <p className="text-gray-500">Tap to start recording</p>
        )}
      </div>

      {transcript && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">Transcription:</h3>
          <p className="text-blue-800 text-sm leading-relaxed">{transcript}</p>
        </Card>
      )}
    </div>
  );
}
