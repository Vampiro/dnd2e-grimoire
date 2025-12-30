import { CharacterClass, PreparedCasterProgression } from "./ClassProgression";

/** A wizard's spellbook containing learned spells. */
export interface WizardSpellbook {
  id: string;
  name: string;
  numberOfPages: number;
  /**
   * Map of spell IDs in format "SpellId - true".
   * Stored as a set-like map to reduce cross-device conflicts.
   */
  spellsById: Record<string, true>;
}

export interface WizardClassProgression extends PreparedCasterProgression {
  /** The wizard class. */
  className: CharacterClass.WIZARD;
  /** Spellbook for wizard spells. */
  spellbooksById: Record<string, WizardSpellbook>;
}
