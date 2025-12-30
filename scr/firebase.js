import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

/**
 * CONFIGURACIÓN DE FIREBASE
 * Reemplaza estos valores con tus credenciales reales de la consola de Firebase.
 */
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "rumbocasa-7187f.firebaseapp.com",
  projectId: "rumbocasa-7187f",
  storageBucket: "rumbocasa-7187f.firebasestorage.app",
  messagingSenderId: "614700920624",
  appId: "1:614700920624:web:31f82a7a8721665efb22f5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const appId = 'rumbo-casa-portal';
export const ADMIN_EMAIL = "cardosoreinier@gmail.com";