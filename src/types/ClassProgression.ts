export enum CharacterClass {
  /** Priest class. */
  PRIEST = "Priest",
  /** Wizard class. */
  WIZARD = "Wizard",
}

export interface ClassProgression {
  className: CharacterClass;
  level: number;
}

/** Merge-friendly prepared spell state (avoids per-slot arrays). */
export interface PreparedSpellCounts {
  /** Total prepared copies of this spell after resting. */
  total: number;
  /** How many of the prepared copies have been used (cast). */
  used: number;
}

/** Additional slots applied on top of base spell tables. */
export interface SpellSlotModifier {
  /** When true, add the base slots again (effectively doubling base for that level). */
  addBase: boolean;
  /** Flat bonus (can be negative) applied after base and optional extra base. */
  bonus: number;
  /** When true, only applies to spell levels the caster can actually cast. */
  requiresSpellLevelAccess: boolean;
  /** Target spell level; use "all" to apply to every spell level. */
  spellLevel: number | "all";
}

/** For caster classes with a certain number of prepared spell slots per level. */
export interface PreparedCasterProgression extends ClassProgression {
  /** Prepared spells by spell level, keyed by spell id. */
  preparedSpells: Record<number, Record<string, PreparedSpellCounts>>;
  /** Optional modifiers applied to base spell slot tables. */
  spellSlotModifiers?: SpellSlotModifier[];
}
