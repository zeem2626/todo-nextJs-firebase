import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAvcrGlSAU6pK1lhYIgSDd2iVL2Iwn3Qi8",
  authDomain: "zeemtodo.firebaseapp.com",
  projectId: "zeemtodo",
  storageBucket: "zeemtodo.appspot.com",
  messagingSenderId: "467849853983",
  appId: "1:467849853983:web:5755c8f921d74a12a7e92a",
  measurementId: "G-3FW7WLX84P"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);