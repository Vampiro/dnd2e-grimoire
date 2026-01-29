import { CharacterClass, PreparedCasterProgression } from "./ClassProgression";

/** A wizard's spellbook containing copied spells (some may be unlearned). */
export interface WizardSpellbook {
  id: string;
  name: string;
  numberOfPages: number;
  /** When true, this spellbook is disabled. Defaults to false. */
  disabled?: boolean;
  /**
   * Set-like map of spell ids (MediaWiki page ids) copied into this spellbook.
   * Stored as a set-like map to reduce cross-device conflicts.
   */
  spellsById: Record<string, true>;
}

export interface WizardClassProgression extends PreparedCasterProgression {
  /** The wizard class. */
  className: CharacterClass.WIZARD;
  /**
   * Set-like map of known/learned spell ids (MediaWiki page ids).
   * Stored as a set-like map to reduce cross-device conflicts.
   */
  knownSpellsById?: Record<string, true>;
  /** Spellbook for wizard spells. */
  spellbooksById: Record<string, WizardSpellbook>;
}
