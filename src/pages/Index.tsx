
import React, { useState } from "react";
import { Character, Topic } from "@/types/podcast";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CharacterSelector from "@/components/CharacterSelector";
import TopicSelector from "@/components/TopicSelector";
import PodcastStudio from "@/components/PodcastStudio";
import { toast } from "@/components/ui/sonner";

const Index = () => {
  const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [setupComplete, setSetupComplete] = useState(false);
  const [activeTab, setActiveTab] = useState("characters");

  const handleCharacterSelect = (character: Character) => {
    if (selectedCharacters.find(c => c.id === character.id)) {
      setSelectedCharacters(selectedCharacters.filter(c => c.id !== character.id));
    } else {
      setSelectedCharacters([...selectedCharacters, character]);
    }
  };

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
  };

  const handleStartPodcast = () => {
    if (selectedCharacters.length < 2) {
      toast.error("Please select at least 2 characters");
      return;
    }

    if (!selectedTopic) {
      toast.error("Please select a topic");
      return;
    }

    toast.success("Setting up your podcast studio", {
      description: "Preparing the studio with your selected characters"
    });
    
    setSetupComplete(true);
  };

  const handleBackToSetup = () => {
    setSetupComplete(false);
  };

  if (setupComplete) {
    return (
      <div className="min-h-screen max-w-5xl mx-auto py-6 px-4">
        <PodcastStudio 
          characters={selectedCharacters} 
          topic={selectedTopic!} 
          onBackToSetup={handleBackToSetup} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 text-podcast-accent">TimePod</h1>
        <p className="text-xl">
          AI-powered historical, political, religious, and fictional characters in podcast conversations
        </p>
      </div>

      <Card className="max-w-3xl mx-auto bg-podcast-studio border-podcast-accent/40">
        <CardHeader>
          <CardTitle className="text-podcast-text text-2xl">Create Your Podcast</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="characters">1. Select Characters</TabsTrigger>
              <TabsTrigger value="topic" disabled={selectedCharacters.length < 2}>
                2. Choose Topic
              </TabsTrigger>
            </TabsList>
            <TabsContent value="characters">
              <CharacterSelector
                selectedCharacters={selectedCharacters}
                onSelectCharacter={handleCharacterSelect}
                maxCharacters={3}
              />
              
              <div className="mt-4 text-center">
                <Button
                  onClick={() => {
                    if (selectedCharacters.length < 2) {
                      toast.error("Please select at least 2 characters");
                      return;
                    }
                    setActiveTab("topic");
                  }}
                  disabled={selectedCharacters.length < 2}
                >
                  Continue to Topic Selection
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="topic">
              <TopicSelector
                selectedTopic={selectedTopic}
                onSelectTopic={handleTopicSelect}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          {activeTab === "topic" && (
            <Button variant="outline" onClick={() => setActiveTab("characters")}>
              Back to Characters
            </Button>
          )}
          <div className={activeTab === "characters" ? "w-full text-center" : ""}>
            <Button
              onClick={handleStartPodcast}
              disabled={selectedCharacters.length < 2 || !selectedTopic}
              className={activeTab === "topic" ? "" : "hidden"}
            >
              Start Podcast
            </Button>
          </div>
        </CardFooter>
      </Card>

      <div className="max-w-3xl mx-auto mt-8 text-center">
        <p className="text-sm text-gray-400">
          Note: This is a simulation. Integration with real AI-generated conversations coming soon!
        </p>
        <p className="text-sm text-gray-400 mt-2">
          You'll be able to use your own AI API keys to generate real conversations between these characters.
        </p>
      </div>
    </div>
  );
};

export default Index;
