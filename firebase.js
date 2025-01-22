import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBipEUdjIH6xZ6UUFh6COKKdhOGsPgawyQ",
  authDomain: "app-diario-be563.firebaseapp.com",
  projectId: "app-diario-be563",
  storageBucket: "app-diario-be563.firebasestorage.app",
  messagingSenderId: "811353985273",
  appId: "1:811353985273:android:5365ac2f42c10b2e875228",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };