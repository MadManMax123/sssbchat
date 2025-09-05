import { useState } from "react";
import Login from "./Login";
import Chat from "./Chat";

export default function App() {
  const [user, setUser] = useState(null);

  return user ? <Chat username={user} /> : <Login onLogin={setUser} />;
}
