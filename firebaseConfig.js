import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";  
import { getStorage } from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyA67Z9nsqgNOyeA1O-CcLruGxC5Doxuue0",
  authDomain: "grind-10132.firebaseapp.com",
  projectId: "grind-10132",
   storageBucket: "grind-10132.appspot.com",
  //storageBucket: "grind-10132.firebasestorage.app",
  messagingSenderId: "273886229789",
  appId: "1:273886229789:web:06b10a30e3fd497446ddf4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app);   
export const storage = getStorage(app);

