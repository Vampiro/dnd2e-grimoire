import { doc, onSnapshot, setDoc, type Unsubscribe } from "firebase/firestore";
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
};

type UserDoc = {
  settings?: UserSettings;
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
    } satisfies UserDoc,
    { merge: true },
  );
}
