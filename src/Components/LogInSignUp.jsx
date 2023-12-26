import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import { auth, updateProfileInfo } from "./firebase.jsx";

export default function LogInSignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  const logIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        setIsLoggedIn(true);
      })
      .catch((err) => {
        console.log(err);
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
      <button onClick={logIn}>Log In</button>
    </div>
  );
}
// test@test.com
// testtest
// test1
// https://firebase.google.com/docs/auth/web/manage-users
