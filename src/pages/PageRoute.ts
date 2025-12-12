export const PageRoute = {
  HOME: "/",
  CHARACTERS: "/characters",
  CHARACTER_VIEW: (characterId: string) => `/characters/${characterId}`,
  CHARACTER_EDIT: (characterId: string) => `/characters/${characterId}/edit`,
  WIZARD: (characterId: string) => `/characters/${characterId}/wizard`,
  WIZARD_EDIT: (characterId: string) => `/characters/${characterId}/wizard/edit`,
};
