import { useState } from "react";
import Join from "./Components/Join";
import Chat from "./Components/Chat";

function App() {
  const [user, setUser] = useState("");

  return (
    <>
      {!user ? <Join setUser={setUser} /> : <Chat user={user} />}
    </>
  );
}

export default App;