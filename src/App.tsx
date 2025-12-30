import { useAtomValue } from "jotai";
import "./App.css";
import { store, userAtom } from "./globalState";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import {
  refreshCharacters,
  startCharactersRealtimeSync,
  stopCharactersRealtimeSync,
} from "./firebase/characters";
import { Route, Routes } from "react-router-dom";
import { CharactersPage } from "./pages/CharactersPage";
import { CharacterPage } from "./pages/CharacterPage";
import { CharacterEditPage } from "./pages/CharacterEditPage";
import { WizardPage } from "./pages/WizardPage";
import { WizardEditPage } from "./pages/WizardEditPage";
import { WizardSpellbooksPage } from "./pages/WizardSpellbooksPage";
import { Navbar } from "./components/custom/Navbar";
import { Toaster } from "sonner";
import { charactersAtom } from "./globalState";

function App() {
  const user = useAtomValue(userAtom);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      // update user atom with new user (or no user)
      store.set(userAtom, u);

      if (!u) {
        stopCharactersRealtimeSync();
        store.set(charactersAtom, []);
        return;
      }

      try {
        startCharactersRealtimeSync();
      } catch {
        // Fall back to one-shot refresh if the realtime listener can't start.
        refreshCharacters();
      }
    });

    return () => {
      unsub();
      stopCharactersRealtimeSync();
    };
  }, []);

  return (
    <div>
      <Toaster />
      <Navbar />

      {user && (
        <main className="mx-auto w-full max-w-6xl px-4">
          <Routes>
            <Route path="/characters/:id" element={<CharacterPage />} />
            <Route
              path="/characters/:characterId/edit"
              element={<CharacterEditPage />}
            />
            <Route
              path="/characters/:characterId/wizard"
              element={<WizardPage />}
            />
            <Route
              path="/characters/:characterId/wizard/edit"
              element={<WizardEditPage />}
            />
            <Route
              path="/characters/:characterId/wizard/spellbooks"
              element={<WizardSpellbooksPage />}
            />
            <Route path="/characters" element={<CharactersPage />} />
          </Routes>
        </main>
      )}
    </div>
  );
}

export default App;
