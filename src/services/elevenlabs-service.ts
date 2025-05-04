
import { getElevenlabsApiKey } from "@/lib/api-keys";
import { toast } from "@/components/ui/sonner";

// Constants
const API_URL = "https://api.elevenlabs.io/v1";
const DEFAULT_MODEL = "eleven_multilingual_v2";

// Cache for audio elements
const audioCache: Record<string, HTMLAudioElement> = {};

// Interface for TTS request
interface TTSRequest {
  text: string;
  voice_id: string;
  model_id?: string;
  voice_settings?: {
    stability: number;
    similarity_boost: number;
  };
}

// Interface for TTS response
interface TTSResponse {
  audio: Blob;
  audioUrl: string;
}

/**
 * Convert text to speech using Eleven Labs API
 */
export const textToSpeech = async (
  text: string,
  voiceId: string
): Promise<TTSResponse | null> => {
  const apiKey = getElevenlabsApiKey();
  
  if (!apiKey) {
    toast.error("ElevenLabs API key is not set");
    return null;
  }
  
  // Create cache key
  const cacheKey = `${voiceId}-${text}`;
  
  // Check if we have this audio in cache
  if (audioCache[cacheKey]) {
    return {
      audio: await fetch(audioCache[cacheKey].src).then(r => r.blob()),
      audioUrl: audioCache[cacheKey].src
    };
  }
  
  try {
    const requestBody: TTSRequest = {
      text,
      voice_id: voiceId,
      model_id: DEFAULT_MODEL,
      voice_settings: {
        stability: 0.7,
        similarity_boost: 0.7
      }
    };
    
    const response = await fetch(`${API_URL}/text-to-speech/${voiceId}/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("ElevenLabs API Error:", errorData);
      toast.error(`TTS Error: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // Cache the audio
    const audio = new Audio(audioUrl);
    audioCache[cacheKey] = audio;
    
    return {
      audio: audioBlob,
      audioUrl
    };
  } catch (error) {
    console.error("Error generating speech:", error);
    toast.error("Failed to generate speech");
    return null;
  }
};

/**
 * Verify if the ElevenLabs API key is valid by trying to fetch voices
 */
export const verifyElevenlabsApiKey = async (): Promise<boolean> => {
  const apiKey = getElevenlabsApiKey();
  
  if (!apiKey) {
    return false;
  }
  
  try {
    const response = await fetch(`${API_URL}/voices`, {
      headers: {
        "xi-api-key": apiKey
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error("Error verifying ElevenLabs API key:", error);
    return false;
  }
};

/**
 * Play audio for a character's message
 */
export const playCharacterAudio = async (
  text: string,
  voiceId: string
): Promise<HTMLAudioElement | null> => {
  try {
    const ttsResponse = await textToSpeech(text, voiceId);
    
    if (!ttsResponse) {
      return null;
    }
    
    const audio = new Audio(ttsResponse.audioUrl);
    
    // Return the audio element
    return audio;
  } catch (error) {
    console.error("Error playing character audio:", error);
    return null;
  }
};

/**
 * Clean up cached audio objects
 */
export const clearAudioCache = () => {
  Object.keys(audioCache).forEach(key => {
    URL.revokeObjectURL(audioCache[key].src);
    delete audioCache[key];
  });
};
