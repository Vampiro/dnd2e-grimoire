export const PageRoute = {
  HOME: "/",
  CHARACTERS: "/characters",
  SETTINGS: "/settings",
  CHARACTER_VIEW: (characterId: string) => `/characters/${characterId}`,
  CHARACTER_EDIT: (characterId: string) => `/characters/${characterId}/edit`,
  WIZARD_CAST: (characterId: string) =>
    `/characters/${characterId}/wizard/cast`,
  WIZARD_SPELL_SLOTS: (characterId: string) =>
    `/characters/${characterId}/wizard/edit`,
  WIZARD_SPELLBOOKS: (characterId: string) =>
    `/characters/${characterId}/wizard/spellbooks`,
};
