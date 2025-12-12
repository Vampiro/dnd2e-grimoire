import { useAtomValue } from "jotai";
import "./App.css";
import { store, userAtom } from "./globalState";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { refreshCharacters } from "./firebase/characters";
import { Route, Routes } from "react-router-dom";
import { CharactersPage } from "./pages/CharactersPage";
import { CharacterPage } from "./pages/CharacterPage";
import { CharacterEditPage } from "./pages/CharacterEditPage";
import { WizardPage } from "./pages/WizardPage";
import { WizardEditPage } from "./pages/WizardEditPage";
import { Navbar } from "./components/custom/Navbar";
import { Toaster } from "sonner";

function App() {
  const user = useAtomValue(userAtom);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      // update user atom with new user (or no user)
      store.set(userAtom, u);
      // refresh characters
      refreshCharacters();
    });
  }, []);

  return (
    <div>
      <Toaster />
      <Navbar />

      {user && (
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
          <Route path="/characters" element={<CharactersPage />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
