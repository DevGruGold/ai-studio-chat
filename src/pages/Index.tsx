
import React, { useState } from "react";
import { Character, Topic } from "@/types/podcast";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CharacterSelector from "@/components/CharacterSelector";
import TopicSelector from "@/components/TopicSelector";
import PodcastStudio from "@/components/PodcastStudio";
import { toast } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [setupComplete, setSetupComplete] = useState(false);
  const [activeTab, setActiveTab] = useState("characters");
  const isMobile = useIsMobile();

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
      <div className="min-h-screen p-0 sm:p-4 md:py-6 md:px-4">
        <div className="max-w-5xl mx-auto h-[calc(100vh-2rem)] sm:h-auto">
          <PodcastStudio 
            characters={selectedCharacters} 
            topic={selectedTopic!} 
            onBackToSetup={handleBackToSetup} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 px-4 sm:py-6 bg-gradient-to-b from-white to-purple-50 fade-in">
      <div className="max-w-4xl mx-auto text-center mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">TimePod</h1>
        <p className="text-lg sm:text-xl text-gray-700">
          AI-powered historical, political, religious, and fictional characters in podcast conversations
        </p>
      </div>

      <Card className="max-w-3xl mx-auto bg-white border-gray-200 shadow-md">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-2xl text-gray-800">Create Your Podcast</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-2">
              <TabsTrigger value="characters">1. Select Characters</TabsTrigger>
              <TabsTrigger value="topic" disabled={selectedCharacters.length < 2}>
                2. Choose Topic
              </TabsTrigger>
            </TabsList>
            <TabsContent value="characters" className="mt-2 sm:mt-4">
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
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Continue to Topic Selection
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="topic" className="mt-2 sm:mt-4">
              <TopicSelector
                selectedTopic={selectedTopic}
                onSelectTopic={handleTopicSelect}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t border-gray-100 p-3 sm:p-6">
          {activeTab === "topic" && (
            <Button variant="outline" onClick={() => setActiveTab("characters")}>
              Back to Characters
            </Button>
          )}
          <div className={activeTab === "characters" ? "w-full text-center" : ""}>
            <Button
              onClick={handleStartPodcast}
              disabled={selectedCharacters.length < 2 || !selectedTopic}
              className={`bg-purple-600 hover:bg-purple-700 ${activeTab === "topic" ? "" : "hidden"}`}
            >
              Start Podcast
            </Button>
          </div>
        </CardFooter>
      </Card>

      <div className="max-w-3xl mx-auto mt-6 sm:mt-8 text-center">
        <p className="text-sm text-gray-500">
          Note: This is a simulation. Integration with real AI-generated conversations coming soon!
        </p>
        <p className="text-sm text-gray-500 mt-2">
          You'll be able to use your own AI API keys to generate real conversations between these characters.
        </p>
      </div>
    </div>
  );
};

export default Index;
