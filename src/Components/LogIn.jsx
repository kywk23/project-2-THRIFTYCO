// import { signInWithEmailAndPassword } from "firebase/auth";
// import { useState } from "react";
// import { auth } from "../firebase";

// export default function LogIn() {

//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const logIn = () => {
//     signInWithEmailAndPassword(auth, email, password)
//       .then((userCredential) => {
//         setIsLoggedIn(true);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   return (
//     <div>
//       <label>Log In</label>
//       <input type="email" placeholder="Email" />
//       <input type="password" placeholder="Password" />
//       <button onClick={logIn}>Log In</button>
//     </div>
//   );
// }
