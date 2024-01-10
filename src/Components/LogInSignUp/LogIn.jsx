import { useState } from "react";
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
    <div className="container-signup">
      <form onSubmit={logIn}>
        <h2>Log In</h2>
        <label>
          <input
            type="email"
            placeholder="Enter email.."
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </label>
        <br />
        <label>
          <input
            type="password"
            placeholder="Password ..? "
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </label>
        <br />
        {!isPending && <button>Log In</button>}
        {isPending && (
          <button disabled>
            <i className="fa fa-spinner fa-spin"></i>Loading...
          </button>
        )}
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}
