import { CharacterClass, PreparedCasterProgression } from "./ClassProgression";

export interface PriestClassProgression extends PreparedCasterProgression {
  /** The priest class. */
  className: CharacterClass.PRIEST;
  /** Major access spheres (all spell levels). */
  majorSpheres?: string[];
  /** Minor access spheres (levels 1-3 only). */
  minorSpheres?: string[];
}
