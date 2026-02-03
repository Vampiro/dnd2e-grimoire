import {
  arrayRemove,
  arrayUnion,
  deleteField,
  doc,
  onSnapshot,
  setDoc,
  type FieldValue,
  type Unsubscribe,
} from "firebase/firestore";
import type { SerializedEditorState } from "lexical";
import { db } from "./index";

/**
 * User-configurable settings persisted in Firestore.
 */
export type UserSettings = {
  /**
   * UI scale multiplier.
   *
   * @remarks
   * This is clamped by the app to avoid breaking layouts.
   */
  uiScale?: number;
  /** Optional per-spell markdown notes keyed by spell id. */
  spellNotes?: Record<string, SerializedEditorState>;
  /** Optional list of favorited spell ids. */
  favoriteSpellIds?: string[];
};

type UserDoc = {
  settings?: UserSettings;
};

type UserSettingsUpdate = {
  uiScale?: number;
  spellNotes?: Record<string, SerializedEditorState | FieldValue>;
  favoriteSpellIds?: string[] | FieldValue;
};

type UserDocUpdate = {
  settings?: UserSettingsUpdate;
};

/**
 * Returns the Firestore document reference used to store per-user app settings.
 */
function userSettingsDoc(userId: string) {
  return doc(db, "users", userId, "settings", "app");
}

function clampUiScale(value: number): number {
  // Keep this tight so the UI doesn't break layouts.
  return Math.min(1.5, Math.max(0.75, value));
}

/**
 * Subscribes to the current user's settings in Firestore.
 *
 * @remarks
 * This is used to keep settings in sync across devices.
 */
export function subscribeToUserSettings(
  userId: string,
  onChange: (settings: UserSettings) => void,
): Unsubscribe {
  const ref = userSettingsDoc(userId);
  return onSnapshot(ref, (snap) => {
    const data = snap.data() as UserDoc | undefined;
    onChange(data?.settings ?? {});
  });
}

/**
 * Persists a user's UI scale setting.
 */
export async function setUserUiScale(
  userId: string,
  uiScale: number,
): Promise<void> {
  const ref = userSettingsDoc(userId);
  await setDoc(
    ref,
    {
      settings: {
        uiScale: clampUiScale(uiScale),
      },
    } satisfies UserDocUpdate,
    { merge: true },
  );
}

/**
 * Persist a single spell note for the user.
 */
export async function setUserSpellNote(
  userId: string,
  spellId: string,
  note: SerializedEditorState,
): Promise<void> {
  const ref = userSettingsDoc(userId);
  await setDoc(
    ref,
    {
      settings: {
        spellNotes: {
          [spellId]: note,
        },
      },
    } satisfies UserDocUpdate,
    { merge: true },
  );
}

/**
 * Remove a spell note for the user.
 */
export async function deleteUserSpellNote(
  userId: string,
  spellId: string,
): Promise<void> {
  const ref = userSettingsDoc(userId);
  await setDoc(
    ref,
    {
      settings: {
        spellNotes: {
          [spellId]: deleteField(),
        },
      },
    } satisfies UserDocUpdate,
    { merge: true },
  );
}

/**
 * Add a spell to the user's favorites list.
 */
export async function addUserFavoriteSpell(
  userId: string,
  spellId: string,
): Promise<void> {
  const ref = userSettingsDoc(userId);
  await setDoc(
    ref,
    {
      settings: {
        favoriteSpellIds: arrayUnion(spellId),
      },
    } satisfies UserDocUpdate,
    { merge: true },
  );
}

/**
 * Remove a spell from the user's favorites list.
 */
export async function removeUserFavoriteSpell(
  userId: string,
  spellId: string,
): Promise<void> {
  const ref = userSettingsDoc(userId);
  await setDoc(
    ref,
    {
      settings: {
        favoriteSpellIds: arrayRemove(spellId),
      },
    } satisfies UserDocUpdate,
    { merge: true },
  );
}
