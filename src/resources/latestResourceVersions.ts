/**
 * Latest known versions for runtime-loaded resources.
 *
 * @remarks
 * Increment a value to invalidate IndexedDB caches and force a refetch.
 */
export const LATEST_RESOURCE_VERSIONS = {
  priestSpellDescriptions: 8,
  priestSpells: 4,
  wizardSpellDescriptions: 10,
  wizardSpells: 4,
} as const;

export type LatestResourceVersions = typeof LATEST_RESOURCE_VERSIONS;
