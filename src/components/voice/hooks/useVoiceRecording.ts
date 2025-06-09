
import { useState, useRef } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useVoiceRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');
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
      setLiveTranscript('');
      
      // Request high-quality audio with standard constraints
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 48000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      // Use the best available audio format
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/mp4';
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = 'audio/wav';
          }
        }
      }
      
      console.log('Verwendeter MIME Type:', mimeType);
      
      const mediaRecorder = new MediaRecorder(stream, { 
        mimeType,
        audioBitsPerSecond: 128000
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log('Audio chunk empfangen:', event.data.size, 'bytes');
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder Fehler:', event);
        toast({
          title: "Aufnahme-Fehler",
          description: "Fehler bei der Audioaufnahme aufgetreten",
          variant: "destructive"
        });
      };

      // Record in smaller chunks for better quality
      mediaRecorder.start(100);
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
          
          if (audioChunksRef.current.length === 0) {
            console.error('Keine Audio-Chunks verfügbar');
            toast({
              title: "Aufnahme-Fehler",
              description: "Keine Audiodaten aufgenommen. Bitte versuchen Sie es erneut.",
              variant: "destructive"
            });
            resolve(null);
            return;
          }
          
          const audioBlob = new Blob(audioChunksRef.current, { 
            type: mediaRecorderRef.current?.mimeType || 'audio/webm' 
          });
          console.log('Audio Blob erstellt:', audioBlob.size, 'bytes, Type:', audioBlob.type);
          
          // Stop all tracks
          if (mediaRecorderRef.current?.stream) {
            mediaRecorderRef.current.stream.getTracks().forEach(track => {
              track.stop();
              console.log('Audio track gestoppt');
            });
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
      console.log('Audio Blob Details:', {
        size: audioBlob.size,
        type: audioBlob.type
      });
      
      if (audioBlob.size === 0) {
        throw new Error('Audio Blob ist leer');
      }
      
      // Minimum size check (1KB for meaningful audio)
      if (audioBlob.size < 1024) {
        throw new Error('Audio zu kurz - bitte sprechen Sie länger');
      }
      
      const reader = new FileReader();
      
      return new Promise((resolve, reject) => {
        reader.onloadend = async () => {
          try {
            const result = reader.result as string;
            
            if (!result || !result.includes(',')) {
              throw new Error('Ungültiges Audio-Format');
            }
            
            const base64Audio = result.split(',')[1];
            console.log('Base64 Audio Länge:', base64Audio.length);
            
            if (!base64Audio || base64Audio.length < 100) {
              throw new Error('Audio Daten sind zu kurz oder ungültig');
            }
            
            console.log('Sende Anfrage an Supabase Function...');
            const { data, error } = await supabase.functions.invoke('process-voice-note', {
              body: {
                audio: base64Audio,
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
              vital_signs: data.structured?.vital_signs || "Nicht erwähnt",
              detected_medications: data.structured?.detected_medications || [],
              detected_vitals: data.structured?.detected_vitals || {},
              voice_transcript: data.transcript
            };

            setIsProcessing(false);
            
            toast({
              title: "Sprachnotiz verarbeitet",
              description: `Transkription: "${data.transcript.substring(0, 50)}${data.transcript.length > 50 ? '...' : ''}"`,
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
        description: error instanceof Error ? error.message : "Unbekannter Fehler aufgetreten",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    isRecording,
    isProcessing,
    recordingTime,
    liveTranscript,
    startRecording,
    stopRecording,
    processAudioWithAI
  };
}
