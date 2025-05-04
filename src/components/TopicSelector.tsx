
import React from "react";
import { topics } from "@/data/topics";
import { Topic } from "@/types/podcast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface TopicSelectorProps {
  selectedTopic: Topic | null;
  onSelectTopic: (topic: Topic) => void;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({
  selectedTopic,
  onSelectTopic,
}) => {
  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-3">Choose a Topic</h3>
      <p className="text-sm text-gray-400 mb-4">
        Select a topic for the characters to discuss
      </p>

      <ScrollArea className="h-[300px] rounded-md border border-podcast-accent/20 p-4">
        <div className="flex flex-col gap-3">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                selectedTopic?.id === topic.id
                  ? "bg-podcast-accent/20 border border-podcast-accent"
                  : "bg-podcast-studio border border-gray-700 hover:border-podcast-accent/50"
              }`}
              onClick={() => onSelectTopic(topic)}
            >
              <h4 className="font-medium">{topic.title}</h4>
              <p className="text-sm text-gray-400 mt-1">
                {topic.description}
              </p>
              <div className="flex gap-1 mt-2 flex-wrap">
                {topic.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TopicSelector;
