/**
 * Latest known versions for runtime-loaded resources.
 *
 * @remarks
 * Increment a value to invalidate IndexedDB caches and force a refetch.
 */
export const LATEST_RESOURCE_VERSIONS = {
  priestSpellDescriptions: 16,
  priestSpells: 4,
  wizardSpellDescriptions: 13,
  wizardSpells: 5,
} as const;

export type LatestResourceVersions = typeof LATEST_RESOURCE_VERSIONS;
