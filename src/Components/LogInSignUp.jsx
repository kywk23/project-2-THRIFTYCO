import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";

export default function LogInSignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const signUp = (e) => {
    e.preventDefault();

    createUserWithEmailAndPassword(auth, email, password, username)
      .then((userCrendtial) => {
        console.log("Sign up success", userCrendtial);
        setEmail("");
        setPassword("");
        setUsername("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const LogIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <form onSubmit={signUp}>
        <label>Sign Up</label>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <button type="submit"> Sign Up </button>
      </form>
      <br />
      <button onClick={LogIn}>Log In</button>
    </div>
  );
}
// test@test.com
// testtest
// test1
// https://firebase.google.com/docs/auth/web/manage-users
