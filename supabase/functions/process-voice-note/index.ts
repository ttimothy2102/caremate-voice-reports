
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audio, residentId } = await req.json();
    
    // Convert base64 audio to blob for Whisper API
    const audioBuffer = Uint8Array.from(atob(audio), c => c.charCodeAt(0));
    const audioBlob = new Blob([audioBuffer], { type: 'audio/webm' });
    
    // Step 1: Transcribe audio using Whisper
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');

    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
      },
      body: formData,
    });

    if (!transcriptionResponse.ok) {
      throw new Error('Transcription failed');
    }

    const transcriptionData = await transcriptionResponse.json();
    const transcript = transcriptionData.text;

    // Step 2: Structure the transcript using GPT-4
    const structuringResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a healthcare assistant that structures care notes. Extract information from the transcript and format it as JSON with these exact fields:
            - physical_condition: Brief description of physical state
            - mood: Description of emotional/mental state  
            - food_water_intake: Information about eating and drinking
            - medication_given: Details about medications administered
            - special_notes: Any other important observations
            
            If information is not mentioned, use "Not mentioned" for that field.`
          },
          {
            role: 'user',
            content: `Please structure this care note transcript: "${transcript}"`
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!structuringResponse.ok) {
      throw new Error('Structuring failed');
    }

    const structuringData = await structuringResponse.json();
    const structured = JSON.parse(structuringData.choices[0].message.content);

    return new Response(JSON.stringify({
      transcript,
      structured
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in process-voice-note function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
