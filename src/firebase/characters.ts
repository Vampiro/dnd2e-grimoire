/**
 * Character-related Firestore helpers
 */

import { db } from "./index";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
  CollectionReference,
  DocumentReference,
  getDoc,
} from "firebase/firestore";
import type { Character } from "../types/Character";
import { getCurrentUserId } from "./auth";
import { charactersAtom, store } from "../globalState";

/**
 * Returns the collection reference for a user's characters
 */
function charactersCollection(uid: string) {
  return collection(
    db,
    "users",
    uid,
    "characters",
  ) as CollectionReference<Character>;
}

/**
 * Get reference to a specific character document.
 * @param characterId - Character document ID
 */
function characterDoc(uid: string, characterId: string) {
  return doc(
    db,
    `users/${uid}/characters/${characterId}`,
  ) as DocumentReference<Character>;
}

/**
 * Creates a new character for the user
 */
export async function createCharacter(
  data: Omit<Character, "id" | "createdAt" | "updatedAt">,
) {
  const uid = getCurrentUserId();
  if (!uid) {
    throw new Error("Not logged in");
  }

  const col = charactersCollection(uid);
  const id = shortId();

  const char: Character = {
    ...data,
    id,
    revision: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  await setDoc(doc(col, id), char);

  const chars = store.get(charactersAtom);
  store.set(charactersAtom, [...chars, char]);
}

/**
 * Gets all characters.
 * @returns All characters.
 */
async function getCharacters(): Promise<Character[]> {
  const uid = getCurrentUserId();
  if (!uid) {
    throw new Error("Not logged in");
  }

  const col = charactersCollection(uid);
  const q = query(col, orderBy("createdAt", "asc"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => d.data());
}

/** Refreshes the global state list of characters. */
export async function refreshCharacters(): Promise<void> {
  const chars = await getCharacters();
  store.set(charactersAtom, chars);
}

/**
 * Updates a character in the Firestore database.
 * @param id ID of the character.
 * @param data Attributes to update.
 */
export async function updateCharacter(
  id: string,
  data: Partial<Character> & { revision: number },
) {
  updateCharacterWithRevisionCheck(id, data);
  // const uid = getCurrentUserId();
  // if (!uid) {
  //   throw new Error("Not logged in");
  // }

  // const ref = doc(db, "users", uid, "characters", id);
  // const updatedAt = Date.now();
  // await updateDoc(ref, {
  //   ...data,
  //   updatedAt,
  // });

  // const chars = store.get(charactersAtom);
  // const char = chars.find((c) => c.id === id);
  // if (char) {
  //   const newChars = chars.filter((c) => c.id !== id);
  //   const updatedChar: Character = {
  //     ...char,
  //     ...data,
  //     updatedAt,
  //   };
  //   newChars.push(updatedChar);
  //   store.set(
  //     charactersAtom,
  //     chars.filter((c) => c.id !== id),
  //   );
  // }
}

async function updateCharacterWithRevisionCheck(
  id: string,
  update: Partial<Character> & { revision: number },
) {
  const uid = getCurrentUserId();
  if (!uid) throw new Error("Not logged in");

  const ref = characterDoc(uid, id);

  try {
    await updateDoc(ref, update);
    return { ok: true };
  } catch (err: any) {
    if (err.code === "permission-denied") {
      // Fetch server state to see WHY it was denied
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        return { ok: false, deleted: true };
      }

      const serverRevision = snap.data().revision;

      if (update.revision !== serverRevision + 1) {
        return {
          ok: false,
          conflict: true,
          serverRevision,
          expectedRevision: serverRevision + 1,
        };
      }
    }

    // Unknown or network error
    return { ok: false, error: err };
  }
}

/**
 * Delete a character document for a given user.
 *
 * @param id - The ID of the character to delete
 */
export async function deleteCharacter(id: string): Promise<void> {
  const uid = getCurrentUserId();
  if (!uid) {
    throw new Error("Not logged in");
  }

  const ref = characterDoc(uid, id);
  await deleteDoc(ref);

  const chars = store.get(charactersAtom);
  store.set(
    charactersAtom,
    chars.filter((c) => c.id !== id),
  );
}

function shortId(length = 6): string {
  return Array.from({ length }, () =>
    Math.floor(Math.random() * 36).toString(36),
  ).join("");
}
