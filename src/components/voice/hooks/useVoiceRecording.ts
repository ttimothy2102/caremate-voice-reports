
import { useState } from 'react';
import { useAudioRecorder } from './useAudioRecorder';
import { useAudioProcessor } from './useAudioProcessor';

export function useVoiceRecording() {
  const [liveTranscript, setLiveTranscript] = useState('');
  const { isRecording, recordingTime, startRecording, stopRecording } = useAudioRecorder();
  const { isProcessing, processAudio } = useAudioProcessor();

  const startVoiceRecording = async () => {
    setLiveTranscript('');
    return await startRecording();
  };

  const stopVoiceRecording = async () => {
    const audioBlob = await stopRecording();
    return audioBlob;
  };

  const processAudioWithAI = async (audioBlob: Blob, residentId?: string) => {
    return await processAudio(audioBlob, residentId);
  };

  return {
    isRecording,
    isProcessing,
    recordingTime,
    liveTranscript,
    startRecording: startVoiceRecording,
    stopRecording: stopVoiceRecording,
    processAudioWithAI
  };
}
