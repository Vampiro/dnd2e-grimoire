import { useCharacterById } from "@/hooks/useCharacterById";
import { useParams } from "react-router-dom";

export function CharacterEditPage() {
  const { characterId } = useParams();
  const { character, isLoading } = useCharacterById(characterId);

  if (isLoading) {
    return <div>Loading character...</div>;
  }

  if (!character) {
    return <div>No Character with id {characterId}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit Character</h1>
      <p>Character: {character.name}</p>
      {/* TODO: Add form to edit character name and classes */}
    </div>
  );
}
