
import React from 'react';
import { Card } from "@/components/ui/card";
import { Mic, Volume2 } from 'lucide-react';

interface LiveTranscriptionProps {
  isRecording: boolean;
  isProcessing: boolean;
  liveTranscript: string;
  recordingTime: number;
}

export function LiveTranscription({ isRecording, isProcessing, liveTranscript, recordingTime }: LiveTranscriptionProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isRecording && !isProcessing && !liveTranscript) {
    return null;
  }

  return (
    <Card className="p-4 bg-blue-50 border-blue-200">
      <div className="flex items-center gap-2 mb-3">
        {isRecording && (
          <>
            <Mic className="w-4 h-4 text-red-500 animate-pulse" />
            <span className="text-red-600 font-medium text-sm">
              Aufnahme läuft: {formatTime(recordingTime)}
            </span>
          </>
        )}
        {isProcessing && (
          <>
            <Volume2 className="w-4 h-4 text-blue-500 animate-pulse" />
            <span className="text-blue-600 font-medium text-sm">
              KI verarbeitet Audio...
            </span>
          </>
        )}
      </div>
      
      {liveTranscript && (
        <div className="bg-white rounded-md p-3 border">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Live Transkription:</h4>
          <p className="text-sm text-gray-800 leading-relaxed">{liveTranscript}</p>
        </div>
      )}
      
      {isRecording && (
        <div className="mt-3 text-xs text-gray-600">
          💡 Sprechen Sie deutlich und pausieren Sie kurz zwischen Sätzen für beste Ergebnisse
        </div>
      )}
    </Card>
  );
}
