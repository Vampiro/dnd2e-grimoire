import { CharacterView } from "@/components/custom/CharacterView";
import { charactersAtom } from "@/globalState";
import { useAtomValue } from "jotai/react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export function CharacterPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const characters = useAtomValue(charactersAtom);

  // Find the character by id
  const character = characters.find((c) => c.id === id);

  // Redirect if not found
  useEffect(() => {
    if (!character) {
      toast(`Character with ID ${id} not found.`, {
        duration: 2000,
      });
      navigate("/characters", { replace: true }); // replace so user can't go back to invalid URL
    }
  }, [character, navigate]);

  if (!character) {
    return <div>No Character with id {id}</div>;
  }

  return (
    <div>
      <CharacterView character={character} />
    </div>
  );
}
