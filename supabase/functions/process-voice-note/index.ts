
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
    console.log('Process-voice-note function aufgerufen');
    
    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY nicht gesetzt');
      throw new Error('OpenAI API Key nicht konfiguriert');
    }

    const { audio, residentId } = await req.json();
    console.log('Request erhalten:', { 
      audioLength: audio?.length || 0, 
      residentId 
    });
    
    if (!audio) {
      throw new Error('Keine Audio-Daten empfangen');
    }
    
    // Convert base64 audio to blob for Whisper API
    console.log('Konvertiere Base64 zu Binary...');
    const audioBuffer = Uint8Array.from(atob(audio), c => c.charCodeAt(0));
    const audioBlob = new Blob([audioBuffer], { type: 'audio/webm' });
    console.log('Audio Blob Größe:', audioBlob.size);
    
    if (audioBlob.size === 0) {
      throw new Error('Audio Blob ist leer');
    }
    
    // Step 1: Transcribe audio using Whisper
    console.log('Sende an Whisper API...');
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', 'de'); // Deutsch statt Englisch

    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
      },
      body: formData,
    });

    console.log('Whisper API Response Status:', transcriptionResponse.status);

    if (!transcriptionResponse.ok) {
      const errorText = await transcriptionResponse.text();
      console.error('Whisper API Fehler:', errorText);
      throw new Error(`Transkription fehlgeschlagen: ${errorText}`);
    }

    const transcriptionData = await transcriptionResponse.json();
    const transcript = transcriptionData.text;
    console.log('Transkript erhalten:', transcript);

    if (!transcript || transcript.trim().length === 0) {
      throw new Error('Leere Transkription erhalten');
    }

    // Step 2: Structure the transcript using GPT-4
    console.log('Strukturiere Transkript mit GPT-4...');
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
            content: `Du bist ein Pflegeassistent, der Pflegenotizen strukturiert. Extrahiere Informationen aus dem Transkript und formatiere sie als JSON mit diesen exakten Feldern:
            - physical_condition: Kurze Beschreibung des körperlichen Zustands
            - mood: Beschreibung des emotionalen/mentalen Zustands  
            - food_water_intake: Informationen über Essen und Trinken
            - medication_given: Details über verabreichte Medikamente
            - special_notes: Andere wichtige Beobachtungen
            
            Wenn Informationen nicht erwähnt werden, verwende "Nicht erwähnt" für dieses Feld. Antworte nur auf Deutsch.`
          },
          {
            role: 'user',
            content: `Bitte strukturiere diese Pflegenotiz: "${transcript}"`
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    console.log('GPT-4 Response Status:', structuringResponse.status);

    if (!structuringResponse.ok) {
      const errorText = await structuringResponse.text();
      console.error('GPT-4 API Fehler:', errorText);
      throw new Error(`Strukturierung fehlgeschlagen: ${errorText}`);
    }

    const structuringData = await structuringResponse.json();
    console.log('GPT-4 Antwort:', structuringData);
    
    const structured = JSON.parse(structuringData.choices[0].message.content);
    console.log('Strukturierte Daten:', structured);

    const result = {
      transcript,
      structured
    };

    console.log('Erfolgreich verarbeitet:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Fehler in process-voice-note function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.toString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
