import { useAtomValue } from "jotai";
import "./App.css";
import CharacterList from "./CharacterList";
import Login from "./Login";
import { userAtom } from "./globalState";

function App() {
  const user = useAtomValue(userAtom);
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <Login />

      {user && (
        <div>
          Characters:
          <CharacterList />
        </div>
      )}
    </div>
  );
}

export default App;
