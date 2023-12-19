import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const signUp = () => {
    createUserWithEmailAndPassword(auth, email, password, username)
      .then((userCrendtial) => {
        setUsername(userCrendtial.displayName);
        console.log(userCrendtial);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <label>Sign Up</label>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <button onClick={signUp}>Sign Up</button>
    </div>
  );
}
// test@test.com
// testtest
// test1
// https://firebase.google.com/docs/auth/web/manage-users
