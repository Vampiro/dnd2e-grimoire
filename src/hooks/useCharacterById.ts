import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAtomValue } from "jotai/react";
import { toast } from "sonner";

import { charactersAtom, store } from "@/globalState";
import { refreshCharacters } from "@/firebase/characters";
import type { Character } from "@/types/Character";

interface UseCharacterByIdResult {
  character: Character | null;
  isLoading: boolean;
}

/**
 * Custom hook to load a character by ID.
 * First tries to find in atom, then refreshes from Firestore if not found.
 * Automatically redirects if character doesn't exist.
 *
 * @param characterId - The ID of the character to load
 * @returns Object with character and isLoading state
 */
export function useCharacterById(
  characterId: string | undefined,
): UseCharacterByIdResult {
  const navigate = useNavigate();
  const characters = useAtomValue(charactersAtom);
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // First, try to find in atom
  const characterFromAtom = characters.find((c) => c.id === characterId);

  useEffect(() => {
    if (!characterId) {
      setIsLoading(false);
      return;
    }

    if (characterFromAtom) {
      setCharacter(characterFromAtom);
      setIsLoading(false);
      return;
    }

    // If not in atom, refresh the character list to sync
    const syncCharacters = async () => {
      try {
        await refreshCharacters();
        // After refresh, try to find the character again
        const updatedCharacters = store.get(charactersAtom);
        const foundCharacter = updatedCharacters.find(
          (c) => c.id === characterId,
        );

        if (foundCharacter) {
          setCharacter(foundCharacter);
        } else {
          toast(`Character with ID ${characterId} not found.`, {
            duration: 2000,
          });
          navigate("/characters", { replace: true });
        }
      } catch (error) {
        console.error("Failed to sync characters:", error);
        toast("Failed to load character.", { duration: 2000 });
        navigate("/characters", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    syncCharacters();
  }, [characterId, characterFromAtom, navigate]);

  return { character, isLoading };
}
