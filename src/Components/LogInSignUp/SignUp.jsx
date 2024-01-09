import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, updateProfileInfo } from "../firebase";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const signUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Sign up success", userCredential);
        const currentUser = userCredential.user;
        setEmail("");
        setPassword("");
        setDisplayName("");
        return updateProfileInfo(currentUser, {
          displayName: displayName,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <form onSubmit={signUp}>
        <label>Sign Up</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Input your name here"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <button type="submit"> Sign Up </button>
      </form>
      <br />
    </div>
  );
}
