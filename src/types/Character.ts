/** Class that a character can be. e.g. wizard, priest. */
export const CharacterClass = {
  /** Priest class. */
  PRIEST: "Priest",
  /** Wizard class. */
  WIZARD: "Wizard",
} as const;

/** Class that a character can be. e.g. wizard, priest. */
export type CharacterClass =
  (typeof CharacterClass)[keyof typeof CharacterClass];

/**
 * Represents a single D&D character.
 */
export interface Character {
  id: string; // Firestore doc ID
  name: string; // Character name
  classes: CharacterClass[]; // e.g., ["Wizard"]
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
}
