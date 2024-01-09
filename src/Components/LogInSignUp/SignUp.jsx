import { useState } from "react";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth, updateProfileInfo } from "../firebase";
import { useSignup } from "../Hooks/useSignUp.js";
import { set } from "firebase/database";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const { signup, isPending, error } = useSignup();

  const signUp = (e) => {
    e.preventDefault();
    signup(email, password, displayName);
    setEmail("");
    setPassword("");
    setDisplayName("");
  };

  return (
    <div>
      <form onSubmit={signUp}>
        <h2>Sign Up</h2>
        <input
          type="email"
          placeholder="Enter your Email here.."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password goes here.."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tell me your name.."
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />

        {!isPending && <button>Sign up</button>}
        {isPending && (
          <button disabled>
            <i className="fa fa-spinner fa-spin"></i>Loading...
          </button>
        )}
        {error && <p>{error}</p>}
      </form>
      <br />
    </div>
  );
}
