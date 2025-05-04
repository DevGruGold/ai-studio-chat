
import { useState, useEffect, useCallback, useRef } from "react";
import { playCharacterAudio } from "@/services/elevenlabs-service";
import { Character, Message } from "@/types/podcast";

interface UseAudioPlayerProps {
  messages: Message[];
  characters: Character[];
  currentTime: number;
  isPlaying: boolean;
}

interface AudioPlayerState {
  currentSpeaker: string | null;
  currentMessage: Message | null;
  audioElement: HTMLAudioElement | null;
  isAudioPlaying: boolean;
  messageQueue: Message[];
}

export const useAudioPlayer = ({
  messages,
  characters,
  currentTime,
  isPlaying
}: UseAudioPlayerProps) => {
  const [state, setState] = useState<AudioPlayerState>({
    currentSpeaker: null,
    currentMessage: null,
    audioElement: null,
    isAudioPlaying: false,
    messageQueue: []
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pendingPlayRef = useRef<boolean>(false);
  
  // Sort and filter messages based on current time
  useEffect(() => {
    if (!isPlaying) return;
    
    // Find messages near the current time
    const currentMessages = messages.filter(
      msg => Math.abs(msg.timestamp - currentTime) < 10
    );
    
    // If we have messages and they're different from what we're currently processing
    if (
      currentMessages.length > 0 && 
      (!state.currentMessage || currentMessages[0].id !== state.currentMessage.id)
    ) {
      setState(prev => ({
        ...prev,
        messageQueue: [...currentMessages]
      }));
    }
  }, [messages, currentTime, isPlaying, state.currentMessage]);
  
  // Process message queue
  const playNextMessage = useCallback(async () => {
    if (state.messageQueue.length === 0 || state.isAudioPlaying) {
      return;
    }
    
    const nextMessage = state.messageQueue[0];
    const character = characters.find(c => c.id === nextMessage.characterId);
    
    if (!character || !character.voiceId) {
      console.warn("Character or voice ID not found", nextMessage.characterId);
      // Remove this message from queue
      setState(prev => ({
        ...prev,
        messageQueue: prev.messageQueue.slice(1)
      }));
      return;
    }
    
    // Set as current speaker
    setState(prev => ({
      ...prev,
      currentSpeaker: nextMessage.characterId,
      currentMessage: nextMessage,
      isAudioPlaying: true,
      messageQueue: prev.messageQueue.slice(1)
    }));
    
    // Generate audio
    const audio = await playCharacterAudio(nextMessage.text, character.voiceId);
    
    if (!audio) {
      setState(prev => ({
        ...prev,
        isAudioPlaying: false
      }));
      return;
    }
    
    // Store audio reference
    audioRef.current = audio;
    
    // Update state with audio element
    setState(prev => ({
      ...prev,
      audioElement: audio
    }));
    
    // Handle audio completion
    audio.onended = () => {
      setState(prev => ({
        ...prev,
        isAudioPlaying: false,
        currentSpeaker: null,
        currentMessage: null,
        audioElement: null
      }));
      audioRef.current = null;
      
      // Process next message if available
      setTimeout(() => {
        if (pendingPlayRef.current) {
          pendingPlayRef.current = false;
          playNextMessage();
        }
      }, 500);
    };
    
    // Play audio
    try {
      await audio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
      setState(prev => ({
        ...prev,
        isAudioPlaying: false
      }));
    }
  }, [state.messageQueue, state.isAudioPlaying, characters]);
  
  // Trigger playing of next message when queue changes
  useEffect(() => {
    if (state.messageQueue.length > 0 && !state.isAudioPlaying) {
      playNextMessage();
    } else if (state.messageQueue.length > 0) {
      pendingPlayRef.current = true;
    }
  }, [state.messageQueue, state.isAudioPlaying, playNextMessage]);
  
  // Clean up audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null;
      }
    };
  }, []);
  
  // Pause audio when podcast playback is paused
  useEffect(() => {
    if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
      setState(prev => ({
        ...prev,
        isAudioPlaying: false
      }));
    } else if (isPlaying && audioRef.current && !state.isAudioPlaying) {
      audioRef.current.play().catch(console.error);
      setState(prev => ({
        ...prev,
        isAudioPlaying: true
      }));
    }
  }, [isPlaying, state.isAudioPlaying]);
  
  return {
    currentSpeaker: state.currentSpeaker,
    currentMessage: state.currentMessage,
    audioElement: state.audioElement,
    isAudioPlaying: state.isAudioPlaying
  };
};
