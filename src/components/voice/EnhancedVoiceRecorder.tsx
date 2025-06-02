
import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCareReport } from '@/hooks/useCareReports';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EnhancedVoiceRecorderProps {
  onTranscriptionComplete: (report: any) => void;
  residentId?: string;
}

export function EnhancedVoiceRecorder({ onTranscriptionComplete, residentId }: EnhancedVoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [editableTranscript, setEditableTranscript] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { mutate: createCareReport } = useCreateCareReport();
  const { user } = useAuth();

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      setTranscript('');
      setEditableTranscript('');
      setIsEditing(false);

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
      startTimer();
      
      toast({
        title: "Aufnahme gestartet",
        description: "Sprechen Sie deutlich in Ihr Mikrofon",
      });
    } catch (error) {
      console.error('Fehler beim Zugriff auf das Mikrofon:', error);
      toast({
        title: "Mikrofon-Fehler",
        description: "Mikrofon konnte nicht zugegriffen werden. Bitte prüfen Sie die Berechtigungen.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
      stopTimer();
      
      toast({
        title: "Verarbeitung läuft",
        description: "Ihr Sprachnotiz wird transkribiert und analysiert...",
      });
    }
  };

  const processAudioWithAI = async (audioBlob: Blob) => {
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        
        const { data, error } = await supabase.functions.invoke('process-voice-note', {
          body: {
            audio: base64Audio.split(',')[1],
            residentId
          }
        });

        if (error) {
          throw new Error(error.message);
        }

        const transcriptText = data.transcript;
        setTranscript(transcriptText);
        setEditableTranscript(transcriptText);
        
        const structuredReport = {
          physical_condition: data.structured.physical_condition,
          mood: data.structured.mood,
          food_water_intake: data.structured.food_water_intake,
          medication_given: data.structured.medication_given,
          special_notes: data.structured.special_notes,
          voice_transcript: transcriptText
        };

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
          title: "Sprachnotiz verarbeitet",
          description: "Ihre Sprachnotiz wurde transkribiert und strukturiert.",
        });
      };
      
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Fehler bei der Audioverarbeitung:', error);
      setIsProcessing(false);
      toast({
        title: "Verarbeitungsfehler",
        description: "Sprachnotiz konnte nicht verarbeitet werden. Bitte versuchen Sie es erneut.",
        variant: "destructive"
      });
    }
  };

  const handleSaveEdit = () => {
    setTranscript(editableTranscript);
    setIsEditing(false);
    
    // Update the report with edited transcript
    const updatedReport = {
      physical_condition: "Bearbeitet",
      mood: "Bearbeitet", 
      food_water_intake: "Bearbeitet",
      medication_given: "Bearbeitet",
      special_notes: "Bearbeitet",
      voice_transcript: editableTranscript
    };
    
    onTranscriptionComplete(updatedReport);
    
    toast({
      title: "Transkription gespeichert",
      description: "Die bearbeitete Transkription wurde gespeichert.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Sprachtranskription</h2>
        <p className="text-gray-600 text-sm">Nehmen Sie Pflegeberichte mit KI-Unterstützung auf</p>
      </div>

      <div className="flex flex-col items-center gap-4">
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
            onClick={toggleRecording}
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

        <div className="text-center">
          {isRecording && (
            <div className="space-y-2">
              <p className="text-red-600 font-medium">Aufnahme läuft... Tippen zum Stoppen</p>
              <p className="text-lg font-mono text-red-500">{formatTime(recordingTime)}</p>
            </div>
          )}
          {isProcessing && (
            <p className="text-blue-600 font-medium">Verarbeitung mit KI...</p>
          )}
          {!isRecording && !isProcessing && (
            <p className="text-gray-500">Tippen zum Starten der Aufnahme</p>
          )}
        </div>
      </div>

      {transcript && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-blue-900">KI-Transkription:</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Abbrechen' : 'Bearbeiten'}
            </Button>
          </div>
          
          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={editableTranscript}
                onChange={(e) => setEditableTranscript(e.target.value)}
                className="min-h-[120px] text-blue-800"
                placeholder="Transkription bearbeiten..."
              />
              <Button
                onClick={handleSaveEdit}
                className="w-full"
              >
                Änderungen speichern
              </Button>
            </div>
          ) : (
            <p className="text-blue-800 text-sm leading-relaxed whitespace-pre-wrap">{transcript}</p>
          )}
        </Card>
      )}
    </div>
  );
}
