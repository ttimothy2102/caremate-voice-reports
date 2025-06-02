
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
      console.log('Starte Aufnahme...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      } else if (MediaRecorder.isTypeSupported('audio/wav')) {
        mimeType = 'audio/wav';
      }
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log('Audio chunk empfangen:', event.data.size, 'bytes');
        }
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
        console.log('Stoppe Aufnahme...');
        
        mediaRecorderRef.current.onstop = async () => {
          console.log('Aufnahme gestoppt, erstelle Audio Blob...');
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          console.log('Audio Blob erstellt:', audioBlob.size, 'bytes');
          
          // Stop all tracks
          if (mediaRecorderRef.current?.stream) {
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
          }
          
          resolve(audioBlob);
        };
        
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        setIsProcessing(true);
        stopTimer();
        
        toast({
          title: "Verarbeitung läuft",
          description: "Ihre Sprachnotiz wird transkribiert und analysiert...",
        });
      } else {
        resolve(null);
      }
    });
  };

  const processAudioWithAI = async (audioBlob: Blob, residentId?: string) => {
    try {
      console.log('Verarbeite Audio mit AI...');
      console.log('Audio Blob Größe:', audioBlob.size);
      
      if (audioBlob.size === 0) {
        throw new Error('Audio Blob ist leer');
      }
      
      const reader = new FileReader();
      
      return new Promise((resolve, reject) => {
        reader.onloadend = async () => {
          try {
            const base64Audio = reader.result as string;
            console.log('Base64 Audio Länge:', base64Audio.length);
            
            if (!base64Audio || base64Audio.length < 100) {
              throw new Error('Audio Daten sind zu kurz oder ungültig');
            }
            
            console.log('Sende Anfrage an Supabase Function...');
            const { data, error } = await supabase.functions.invoke('process-voice-note', {
              body: {
                audio: base64Audio.split(',')[1],
                residentId
              }
            });

            console.log('Antwort von Supabase Function:', { data, error });

            if (error) {
              console.error('Supabase Function Fehler:', error);
              throw new Error(error.message || 'Unbekannter Fehler bei der Verarbeitung');
            }

            if (!data || !data.transcript) {
              console.error('Keine gültigen Daten erhalten:', data);
              throw new Error('Keine Transkription erhalten');
            }

            const structuredReport = {
              physical_condition: data.structured?.physical_condition || "Nicht erwähnt",
              mood: data.structured?.mood || "Nicht erwähnt",
              food_water_intake: data.structured?.food_water_intake || "Nicht erwähnt",
              medication_given: data.structured?.medication_given || "Nicht erwähnt",
              special_notes: data.structured?.special_notes || "Nicht erwähnt",
              voice_transcript: data.transcript
            };

            setIsProcessing(false);
            
            toast({
              title: "Sprachnotiz verarbeitet",
              description: "Ihre Sprachnotiz wurde transkribiert und strukturiert.",
            });

            console.log('Verarbeitung erfolgreich:', { transcript: data.transcript, structuredReport });
            resolve({ transcript: data.transcript, structuredReport });
          } catch (error) {
            console.error('Fehler bei der Verarbeitung:', error);
            setIsProcessing(false);
            reject(error);
          }
        };
        
        reader.onerror = () => {
          console.error('FileReader Fehler');
          setIsProcessing(false);
          reject(new Error('Fehler beim Lesen der Audio-Datei'));
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
