
import { useState, useRef } from 'react';
import { toast } from '@/components/ui/use-toast';

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
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

  const startRecording = async (): Promise<boolean> => {
    try {
      console.log('Starting audio recording...');
      
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
      
      console.log('Using MIME type:', mimeType);
      
      const mediaRecorder = new MediaRecorder(stream, { 
        mimeType,
        audioBitsPerSecond: 128000
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log('Audio chunk received:', event.data.size, 'bytes');
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        toast({
          title: "Recording Error",
          description: "Error occurred during audio recording",
          variant: "destructive"
        });
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      startTimer();
      
      toast({
        title: "Recording Started",
        description: "Speak clearly into your microphone",
      });

      return true;
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
      return false;
    }
  };

  const stopRecording = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (mediaRecorderRef.current && isRecording) {
        console.log('Stopping recording...');
        
        mediaRecorderRef.current.onstop = async () => {
          console.log('Recording stopped, creating audio blob...');
          
          if (audioChunksRef.current.length === 0) {
            console.error('No audio chunks available');
            toast({
              title: "Recording Error",
              description: "No audio data recorded. Please try again.",
              variant: "destructive"
            });
            resolve(null);
            return;
          }
          
          const audioBlob = new Blob(audioChunksRef.current, { 
            type: mediaRecorderRef.current?.mimeType || 'audio/webm' 
          });
          console.log('Audio blob created:', audioBlob.size, 'bytes, Type:', audioBlob.type);
          
          // Stop all tracks
          if (mediaRecorderRef.current?.stream) {
            mediaRecorderRef.current.stream.getTracks().forEach(track => {
              track.stop();
              console.log('Audio track stopped');
            });
          }
          
          resolve(audioBlob);
        };
        
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        stopTimer();
      } else {
        resolve(null);
      }
    });
  };

  return {
    isRecording,
    recordingTime,
    startRecording,
    stopRecording
  };
}
