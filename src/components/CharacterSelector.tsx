
import React from "react";
import { characters } from "@/data/characters";
import { Character } from "@/types/podcast";
import { ScrollArea } from "@/components/ui/scroll-area";
import CharacterAvatar from "@/components/CharacterAvatar";
import { Badge } from "@/components/ui/badge";

interface CharacterSelectorProps {
  selectedCharacters: Character[];
  onSelectCharacter: (character: Character) => void;
  maxCharacters?: number;
}

const CharacterSelector: React.FC<CharacterSelectorProps> = ({
  selectedCharacters,
  onSelectCharacter,
  maxCharacters = 3,
}) => {
  const isSelected = (id: string) => selectedCharacters.some((c) => c.id === id);
  const isMaxReached = selectedCharacters.length >= maxCharacters;

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-3">Choose Characters</h3>
      <p className="text-sm text-gray-400 mb-4">
        Select up to {maxCharacters} characters to join the podcast
      </p>

      <ScrollArea className="h-[300px] rounded-md border border-podcast-accent/20 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {characters.map((character) => {
            const selected = isSelected(character.id);
            
            return (
              <div
                key={character.id}
                className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer transition-all ${
                  selected
                    ? "bg-podcast-accent/20 border border-podcast-accent"
                    : "bg-podcast-studio border border-gray-700 hover:border-podcast-accent/50"
                } ${!selected && isMaxReached ? "opacity-50" : "opacity-100"}`}
                onClick={() => {
                  if (!selected && isMaxReached) return;
                  onSelectCharacter(character);
                }}
              >
                <CharacterAvatar character={character} size="md" withHeadphones={selected} />
                <div className="flex-1">
                  <h4 className="font-medium">{character.name}</h4>
                  <p className="text-sm text-gray-400 line-clamp-1">
                    {character.description}
                  </p>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {character.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CharacterSelector;
