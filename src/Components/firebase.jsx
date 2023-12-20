import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth, updateProfile } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_SOME_API_KEY,
  authDomain: import.meta.env.VITE_SOME_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_SOME_DATABASE_URL,
  projectId: import.meta.env.VITE_SOME_PROJECT_ID,
  storageBucket: import.meta.env.VITE_SOME_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_SOME_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_SOME_APP_ID,
};

// To decide on naming of variables again below:
const firebaseApp = initializeApp(firebaseConfig);
export const database = getDatabase(firebaseApp);
export const storage = getStorage(firebaseApp);
export const auth = getAuth(firebaseApp);
export const updateProfileInfo = (user, profile) => updateProfile(user, profile);
