import { Spell } from "@/types/Spell";

/**
 * Generates a unique spell ID from a spell object.
 * Format: "ClassName - Spell Name"
 * @example getSpellId({ class: "Wizard", name: "Magic Missile", ... }) => "Wizard - Magic Missile"
 */
export function getSpellId(spell: Spell): string {
  return `${spell.class} - ${spell.name}`;
}

/**
 * Parses a spell ID string to extract class and name
 * @example parseSpellId("Wizard - Magic Missile") => { class: "Wizard", name: "Magic Missile" }
 */
export function parseSpellId(
  spellId: string,
): { class: string; name: string } | null {
  const match = spellId.match(/^(.+?)\s-\s(.+)$/);
  if (!match) return null;
  return { class: match[1], name: match[2] };
}
