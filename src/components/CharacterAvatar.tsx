
import React from "react";
import { Character } from "@/types/podcast";
import { Headphones } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CharacterAvatarProps {
  character: Character;
  size?: "sm" | "md" | "lg" | "xl";
  isTalking?: boolean;
  withHeadphones?: boolean;
}

const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  character,
  size = "md",
  isTalking = false,
  withHeadphones = true,
}) => {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32",
  };

  const initials = character.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className={`relative ${isTalking ? "animate-talking" : ""}`}>
      <Avatar className={`${sizeClasses[size]} border-2`} style={{ borderColor: character.color }}>
        <AvatarImage src={character.image} alt={character.name} />
        <AvatarFallback
          className="text-podcast-text font-bold"
          style={{ backgroundColor: character.color }}
        >
          {initials}
        </AvatarFallback>
      </Avatar>
      {withHeadphones && (
        <div className="absolute -top-1 -right-1">
          <Headphones 
            className="text-podcast-accent" 
            size={size === "sm" ? 14 : size === "md" ? 18 : size === "lg" ? 24 : 28} 
          />
        </div>
      )}
      {isTalking && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
          <div className="flex gap-1 items-center">
            <div className="w-1 h-3 bg-podcast-accent animate-pulse rounded-full"></div>
            <div className="w-1 h-4 bg-podcast-accent animate-pulse delay-100 rounded-full"></div>
            <div className="w-1 h-2 bg-podcast-accent animate-pulse delay-200 rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterAvatar;
