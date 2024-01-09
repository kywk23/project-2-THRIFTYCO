import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (email, password, displayName) => {
    setError(null);
    setIsPending(true);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      if (!res) {
        throw new Error("Could not complete signup");
      }

      await updateProfile(auth.currentUser, { displayName });
      dispatch({ type: "LOGIN", payload: res.user });
      setIsPending(false);
      setError(null);
    } catch (err) {
      console.log(err.message);
      setError(`An Error has occured signing up. Please contact admin.`);
      setIsPending(false);
    }
  };

  return { signup, error, isPending };
};
