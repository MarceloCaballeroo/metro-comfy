import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDX93HYj-AoSeJ8N_vk6w9x2nJxWKTh1wo",
    authDomain: "metrocomfy-f0dcb.firebaseapp.com",
    projectId: "metrocomfy-f0dcb",
    storageBucket: "metrocomfy-f0dcb.appspot.com",
    messagingSenderId: "147942347455",
    appId: "1:147942347455:web:3e89c62480628114e2ec0a",
  };

  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const db = getFirestore(app);
  export { app };