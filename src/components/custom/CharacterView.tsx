import { Character } from "@/types/Character";

interface CharacterViewProps {
  character: Character;
}

export function CharacterView({ character }: CharacterViewProps) {
  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold">{character.name}</h1>
        <p className="text-muted-foreground">
          {character.classes
            .map((cls) => `${cls.className} (Level ${cls.level})`)
            .join(" / ")}
        </p>
      </div>
    </div>
  );
}
