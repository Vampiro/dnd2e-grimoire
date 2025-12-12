import { CharacterView } from "@/components/custom/CharacterView";
import { useCharacterById } from "@/hooks/useCharacterById";
import { useParams } from "react-router-dom";

export function CharacterPage() {
  const { id } = useParams();
  const { character, isLoading } = useCharacterById(id);

  if (isLoading) {
    return <div>Loading character...</div>;
  }

  if (!character) {
    return <div>No Character with id {id}</div>;
  }

  return (
    <div>
      <CharacterView character={character} />
    </div>
  );
}
