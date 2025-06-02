
import { useState, useRef } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useVoiceRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        return audioBlob;
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

  const stopRecording = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          resolve(audioBlob);
        };
        
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        setIsProcessing(true);
        stopTimer();
        
        toast({
          title: "Verarbeitung läuft",
          description: "Ihr Sprachnotiz wird transkribiert und analysiert...",
        });
      } else {
        resolve(null);
      }
    });
  };

  const processAudioWithAI = async (audioBlob: Blob, residentId?: string) => {
    try {
      const reader = new FileReader();
      
      return new Promise((resolve, reject) => {
        reader.onloadend = async () => {
          try {
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

            const structuredReport = {
              physical_condition: data.structured.physical_condition,
              mood: data.structured.mood,
              food_water_intake: data.structured.food_water_intake,
              medication_given: data.structured.medication_given,
              special_notes: data.structured.special_notes,
              voice_transcript: data.transcript
            };

            setIsProcessing(false);
            
            toast({
              title: "Sprachnotiz verarbeitet",
              description: "Ihre Sprachnotiz wurde transkribiert und strukturiert.",
            });

            resolve({ transcript: data.transcript, structuredReport });
          } catch (error) {
            reject(error);
          }
        };
        
        reader.readAsDataURL(audioBlob);
      });
    } catch (error) {
      console.error('Fehler bei der Audioverarbeitung:', error);
      setIsProcessing(false);
      toast({
        title: "Verarbeitungsfehler",
        description: "Sprachnotiz konnte nicht verarbeitet werden. Bitte versuchen Sie es erneut.",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    isRecording,
    isProcessing,
    recordingTime,
    startRecording,
    stopRecording,
    processAudioWithAI
  };
}
