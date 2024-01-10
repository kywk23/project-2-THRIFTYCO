//working. pulling out user ID

import { useState, useEffect } from "react";
import { auth } from "../firebase.jsx";

export default function useAuthUID() {
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        setUserID(user.uid); // Set the user ID
        console.log("User ID:", user.uid);
      } else {
        // No user
        setUserID(null);
      }
    });

    // Avoid memory leaks
    return () => unsubscribe();
  }, []);

  return userID; // Return the user ID
}
