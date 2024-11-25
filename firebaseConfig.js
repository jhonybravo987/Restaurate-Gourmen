import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyByLfMiNltUxEHL4CyYNGhpb2vkNB2OwKQ",
  authDomain: "rest-7d4b3.firebaseapp.com",
  projectId: "rest-7d4b3",
  storageBucket: "rest-7d4b3.firebasestorage.app",
  messagingSenderId: "1030204413631",
  appId: "1:1030204413631:web:06d3ed48db2ba9ab01980a"
};

// Inicializar la app de Firebase
const app = initializeApp(firebaseConfig);

// Obtener las instancias necesarias de Firebase
const auth = getAuth(app);
const db = getFirestore(app);  // Firestore
const storage = getStorage(app); // Firebase Storage

export { auth, db, storage };
