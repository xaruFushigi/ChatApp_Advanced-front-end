import "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDuOUTZP3DlCq8D_z8PZT0AS8rxgHgcKPI",
  authDomain: "chatapp-353d9.firebaseapp.com",
  projectId: "chatapp-353d9",
  storageBucket: "chatapp-353d9.appspot.com",
  messagingSenderId: "886558053739",
  appId: "1:886558053739:web:55e573c89605744ab7282e",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // Get the auth instance from the Firebase app.
export const googleProvider = new GoogleAuthProvider();
export const gitHubProvider = new GithubAuthProvider();
