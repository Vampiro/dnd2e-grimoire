import { charactersAtom } from "@/globalState";
import { useAtomValue } from "jotai/react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export function CharacterEditPage() {
  const { characterId } = useParams();
  const navigate = useNavigate();
  const characters = useAtomValue(charactersAtom);

  // Find the character by id
  const character = characters.find((c) => c.id === characterId);

  // Redirect if not found
  useEffect(() => {
    if (!character) {
      toast(`Character with ID ${characterId} not found.`, {
        duration: 2000,
      });
      navigate("/characters", { replace: true });
    }
  }, [character, navigate, characterId]);

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
