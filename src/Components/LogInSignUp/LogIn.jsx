import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useLogIn } from "../Hooks/useLogIn.js";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isPending } = useLogIn();

  const logIn = (e) => {
    e.preventDefault();
    login(email, password);
    setEmail("");
    setPassword("");
  };

  return (
    <form onSubmit={logIn}>
      <h2>Log In</h2>
      <label>
        <span>Email:</span>
        <input
          type="email"
          placeholder="Existing email here.."
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </label>
      <label>
        <span>Password:</span>
        <input
          type="password"
          placeholder="Password ..? "
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </label>
      {!isPending && <button>Log In</button>}
      {isPending && (
        <button disabled>
          <i className="fa fa-spinner fa-spin"></i>Loading...
        </button>
      )}
      {error && <p>{error}</p>}
    </form>
  );
}
