import { Spell } from "@/types/Spell";
import { wizardSpells } from "@/data/wizardSpells";
import { priestSpells } from "@/data/priestSpells";
import { parseSpellId } from "./spellId";
import { CharacterClass } from "@/types/ClassProgressionBase";

/** All available spells indexed by class */
const allSpells: Record<string, Spell[]> = {
  [CharacterClass.WIZARD]: wizardSpells,
  [CharacterClass.PRIEST]: priestSpells,
};

/**
 * Finds a spell by its ID string (format: "ClassName - Spell Name")
 * @param spellId The spell ID to look up
 * @returns The spell object, or null if not found
 */
export function findSpellById(spellId: string): Spell | null {
  const parsed = parseSpellId(spellId);
  if (!parsed) return null;

  const spells = allSpells[parsed.class];
  if (!spells) return null;

  return spells.find((s) => s.name === parsed.name) || null;
}

/**
 * Gets all spells of a specific level from a character class
 * @param characterClass The class to get spells for
 * @param level The spell level
 * @returns Array of spells matching the criteria
 */
export function getSpellsByLevel(
  characterClass: CharacterClass,
  level: number,
): Spell[] {
  const spells = allSpells[characterClass];
  if (!spells) return [];
  return spells.filter((s) => s.level === level);
}
