
import React from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface VoiceRecorderButtonProps {
  isRecording: boolean;
  isProcessing: boolean;
  onToggleRecording: () => void;
}

export function VoiceRecorderButton({ isRecording, isProcessing, onToggleRecording }: VoiceRecorderButtonProps) {
  return (
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
        onClick={onToggleRecording}
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
  );
}
