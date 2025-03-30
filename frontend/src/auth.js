import { auth, googleProvider } from "./firebase-config"; // ✅ Correct import
import { signInWithPopup, signOut } from "firebase/auth";

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider); // ✅ Use googleProvider
    return result.user; // Return user details
  } catch (error) {
    console.error("Error during sign-in:", error);
    return null;
  }
};

const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

export { signInWithGoogle, logOut };
