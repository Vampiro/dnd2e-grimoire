/**
 * A Spell with general details and links to descriptions. Not linked to a player or spellbook.
 */
export interface Spell {
  /** Level of the spell. */
  level: number;
  /** Name of the spell. */
  name: string;
  /** MediaWiki page id for the spell description. */
  id: number;
  /** Stable wiki link (curid-based) to the source page. */
  wikiLink?: string;
  /** Spell class owning this entry. */
  spellClass: "wizard" | "priest";
}
