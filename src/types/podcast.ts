
export type Character = {
  id: string;
  name: string;
  description: string;
  image: string;
  voiceId?: string;
  color: string;
  tags: string[];
};

export type Topic = {
  id: string;
  title: string;
  description: string;
  tags: string[];
};

export type Message = {
  id: string;
  characterId: string;
  text: string;
  audioUrl?: string;
  timestamp: number;
};

export type Conversation = {
  id: string;
  title: string;
  characters: Character[];
  topic: Topic;
  messages: Message[];
  createdAt: number;
};

export type PodcastState = {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  activeCharacters: string[];
};
