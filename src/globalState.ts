import { onAuthStateChanged, type User } from "firebase/auth";
import { atom, getDefaultStore } from "jotai";
import { auth } from "./firebase";

/**
 * Holds the currently authenticated Firebase user.
 *
 * - `null` if no user is logged in.
 * - `User` object from Firebase Auth if logged in.
 */
export const userAtom = atom<User | null>(null);
// keep user atom in sync with auth state changes
onAuthStateChanged(auth, (u) => getDefaultStore().set(userAtom, u));
