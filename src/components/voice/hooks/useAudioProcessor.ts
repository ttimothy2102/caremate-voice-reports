
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProcessedAudio {
  transcript: string;
  structuredReport: {
    physical_condition: string;
    mood: string;
    food_water_intake: string;
    medication_given: string;
    special_notes: string;
    vital_signs: string;
    detected_medications: string[];
    detected_vitals: Record<string, any>;
    voice_transcript: string;
  };
}

export function useAudioProcessor() {
  const [isProcessing, setIsProcessing] = useState(false);

  const processAudio = async (audioBlob: Blob, residentId?: string): Promise<ProcessedAudio | null> => {
    try {
      console.log('Processing audio with AI...');
      setIsProcessing(true);
      
      // Validate audio blob
      if (audioBlob.size === 0) {
        throw new Error('Audio blob is empty');
      }
      
      if (audioBlob.size < 1024) {
        throw new Error('Audio too short - please speak longer');
      }
      
      // Convert to base64
      const base64Audio = await convertBlobToBase64(audioBlob);
      
      if (!base64Audio || base64Audio.length < 100) {
        throw new Error('Audio data is too short or invalid');
      }
      
      console.log('Sending request to Supabase function...');
      const { data, error } = await supabase.functions.invoke('process-voice-note', {
        body: {
          audio: base64Audio,
          residentId
        }
      });

      console.log('Response from Supabase function:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Unknown processing error');
      }

      if (!data || !data.transcript) {
        console.error('No valid data received:', data);
        throw new Error('No transcription received');
      }

      const structuredReport = {
        physical_condition: data.structured?.physical_condition || "Not mentioned",
        mood: data.structured?.mood || "Not mentioned",
        food_water_intake: data.structured?.food_water_intake || "Not mentioned",
        medication_given: data.structured?.medication_given || "Not mentioned",
        special_notes: data.structured?.special_notes || "Not mentioned",
        vital_signs: data.structured?.vital_signs || "Not mentioned",
        detected_medications: data.structured?.detected_medications || [],
        detected_vitals: data.structured?.detected_vitals || {},
        voice_transcript: data.transcript
      };

      toast({
        title: "Voice Note Processed",
        description: `Transcription: "${data.transcript.substring(0, 50)}${data.transcript.length > 50 ? '...' : ''}"`,
      });

      console.log('Processing successful:', { transcript: data.transcript, structuredReport });
      return { transcript: data.transcript, structuredReport };

    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: "Processing Error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const convertBlobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const result = reader.result as string;
        if (!result || !result.includes(',')) {
          reject(new Error('Invalid audio format'));
          return;
        }
        resolve(result.split(',')[1]);
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading audio file'));
      };
      
      reader.readAsDataURL(blob);
    });
  };

  return {
    isProcessing,
    processAudio
  };
}
