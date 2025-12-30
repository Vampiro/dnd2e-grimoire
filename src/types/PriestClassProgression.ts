import { CharacterClass, PreparedCasterProgression } from "./ClassProgression";

export interface PriestClassProgression extends PreparedCasterProgression {
  /** The priest class. */
  className: CharacterClass.PRIEST;
}
