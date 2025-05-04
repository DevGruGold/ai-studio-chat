
import React, { useState, useEffect } from "react";
import { Character, Message, Topic, PodcastState } from "@/types/podcast";
import CharacterAvatar from "@/components/CharacterAvatar";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Mic, Play, Pause, Speaker, SkipForward, SkipBack } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface PodcastStudioProps {
  characters: Character[];
  topic: Topic;
  onBackToSetup: () => void;
}

const PodcastStudio: React.FC<PodcastStudioProps> = ({
  characters,
  topic,
  onBackToSetup,
}) => {
  const [podcastState, setPodcastState] = useState<PodcastState>({
    isPlaying: false,
    currentTime: 0,
    duration: 180, // 3 minutes
    activeCharacters: [],
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSpeaker, setCurrentSpeaker] = useState<string | null>(null);
  
  // Generate placeholder messages
  useEffect(() => {
    const sampleMessages: Message[] = characters.flatMap((character) => [
      {
        id: `${character.id}-1`,
        characterId: character.id,
        text: `Hello and welcome to the podcast! I'm ${character.name}, and I'm excited to discuss "${topic.title}" today.`,
        timestamp: Math.floor(Math.random() * 60),
      },
      {
        id: `${character.id}-2`,
        characterId: character.id,
        text: `From my perspective, ${topic.description} involves thinking about how we interact with the world and each other.`,
        timestamp: Math.floor(60 + Math.random() * 60),
      },
    ]);
    
    // Sort messages by timestamp
    sampleMessages.sort((a, b) => a.timestamp - b.timestamp);
    
    setMessages(sampleMessages);
  }, [characters, topic]);
  
  // Simulated playback
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (podcastState.isPlaying) {
      interval = setInterval(() => {
        setPodcastState((prev) => {
          const newTime = Math.min(prev.currentTime + 1, prev.duration);
          
          // If we've reached the end, stop playback
          if (newTime >= prev.duration) {
            clearInterval(interval);
            return { ...prev, isPlaying: false, currentTime: prev.duration };
          }
          
          return { ...prev, currentTime: newTime };
        });
        
        // Determine who should be speaking
        const currentTimeSeconds = podcastState.currentTime;
        const speakingMessage = messages.find(
          (msg) => 
            Math.abs(msg.timestamp - currentTimeSeconds) < 10
        );
        
        if (speakingMessage) {
          setCurrentSpeaker(speakingMessage.characterId);
        } else {
          setCurrentSpeaker(null);
        }
        
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [podcastState.isPlaying, messages]);

  const togglePlayback = () => {
    if (!podcastState.isPlaying && podcastState.currentTime >= podcastState.duration) {
      // If at the end, restart
      setPodcastState({ ...podcastState, isPlaying: true, currentTime: 0 });
    } else {
      setPodcastState({ ...podcastState, isPlaying: !podcastState.isPlaying });
    }
    
    if (!podcastState.isPlaying) {
      toast("Starting podcast simulation", {
        description: "This is a simulation using placeholder content"
      });
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const handleSeek = (value: number[]) => {
    setPodcastState({ ...podcastState, currentTime: value[0] });
  };
  
  // Find current message based on timestamp
  const currentMessage = messages.find(
    (msg) => Math.abs(msg.timestamp - podcastState.currentTime) < 10
  );

  return (
    <div className="flex flex-col h-full">
      <div className="bg-podcast-wood p-3 rounded-t-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">TimePod Studio</h2>
          <div className="podcast-studio-light w-3 h-3 rounded-full bg-podcast-accent"></div>
        </div>
      </div>
      
      <div className="flex-1 bg-podcast-studio p-4 flex flex-col">
        {/* Studio setup with characters */}
        <div className="flex-1 flex flex-col md:flex-row gap-6 items-center justify-center p-4 border-2 border-gray-800 rounded-lg bg-gray-900/50">
          <div className="flex gap-4 md:gap-10 items-center">
            {characters.map((character) => (
              <div key={character.id} className="flex flex-col items-center gap-2">
                <CharacterAvatar 
                  character={character} 
                  size="xl" 
                  isTalking={currentSpeaker === character.id}
                />
                <div className="text-center">
                  <p className="font-medium text-sm">{character.name}</p>
                  <div 
                    className="w-2 h-2 rounded-full mx-auto mt-1"
                    style={{ 
                      backgroundColor: currentSpeaker === character.id ? character.color : 'transparent',
                      boxShadow: currentSpeaker === character.id ? `0 0 8px ${character.color}` : 'none'
                    }}
                  ></div>
                </div>
                <div className="microphone-stand w-1 h-10 rounded-full mx-auto"></div>
                <Mic
                  size={20}
                  className={`${
                    currentSpeaker === character.id ? "text-podcast-accent animate-pulse" : "text-gray-600"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Current message display */}
        <div className="h-24 mt-4 p-4 border border-gray-800 rounded-lg flex items-center overflow-hidden">
          {currentMessage ? (
            <div className="w-full">
              <div className="flex items-center gap-3 mb-2">
                <CharacterAvatar 
                  character={characters.find(c => c.id === currentMessage.characterId)!} 
                  size="sm" 
                  isTalking={true} 
                />
                <p className="font-medium">
                  {characters.find(c => c.id === currentMessage.characterId)?.name}
                </p>
              </div>
              <p className="text-sm">{currentMessage.text}</p>
            </div>
          ) : (
            <div className="text-gray-500 italic w-full text-center">
              {podcastState.isPlaying ? "..." : "Start the podcast to hear the conversation"}
            </div>
          )}
        </div>
        
        {/* Playback controls */}
        <div className="mt-4 p-4 border border-gray-800 rounded-lg bg-gray-900/30">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm font-mono">{formatTime(podcastState.currentTime)}</p>
            <Slider
              value={[podcastState.currentTime]}
              max={podcastState.duration}
              step={1}
              className="flex-1"
              onValueChange={handleSeek}
            />
            <p className="text-sm font-mono">{formatTime(podcastState.duration)}</p>
          </div>
          
          <div className="flex justify-center gap-3">
            <Button variant="outline" size="icon" disabled>
              <SkipBack size={18} />
            </Button>
            <Button
              variant="default"
              size="icon"
              className="bg-podcast-accent hover:bg-podcast-accent/80"
              onClick={togglePlayback}
            >
              {podcastState.isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </Button>
            <Button variant="outline" size="icon" disabled>
              <SkipForward size={18} />
            </Button>
            <Button variant="outline" size="icon" className="ml-4">
              <Speaker size={18} />
            </Button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-400">Topic: {topic.title}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-podcast-wood p-3 rounded-b-lg flex justify-between">
        <Button variant="outline" onClick={onBackToSetup}>
          Back to Setup
        </Button>
        <Button variant="secondary" onClick={() => {
          toast.info("Feature coming soon!", {
            description: "The ability to create new AI-generated conversations will be available soon!"
          });
        }}>
          New Conversation
        </Button>
      </div>
    </div>
  );
};

export default PodcastStudio;
