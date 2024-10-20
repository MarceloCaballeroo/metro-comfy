import { auth } from "./firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error al registrar usuario:", error);
      throw new Error("Error al registrar usuario: " + error.message);
    } else {
      console.error("Error desconocido al registrar usuario:", error);
      throw new Error("Error desconocido al registrar usuario");
    }
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error al iniciar sesión:", error);
      throw new Error("Error al iniciar sesión: " + error.message);
    } else {
      console.error("Error desconocido al iniciar sesión:", error);
      throw new Error("Error desconocido al iniciar sesión");
    }
  }
};