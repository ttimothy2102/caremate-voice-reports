
import React from 'react';

interface RecordingTimerProps {
  isRecording: boolean;
  isProcessing: boolean;
  recordingTime: number;
}

export function RecordingTimer({ isRecording, isProcessing, recordingTime }: RecordingTimerProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
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
  );
}
