import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// ==============================================================================
// ⚠️ IMPORTANTE PARA EL DÍA DEL EVENTO ⚠️
// 1. Entra a https://console.firebase.google.com/
// 2. Crea un proyecto nuevo.
// 3. Agrega una app web (icono </>) y copia la constante 'firebaseConfig'.
// 4. Reemplaza el objeto de abajo con TUS datos reales.
// 5. En Firestore Database, ve a 'Reglas' y pon 'allow read, write: if true;'
// ==============================================================================

const firebaseConfig = {
  apiKey: "PON_AQUI_TU_API_KEY",
  authDomain: "expotecmi-demo.firebaseapp.com",
  projectId: "expotecmi-demo",
  storageBucket: "expotecmi-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Inicializamos la app, si falla (porque no has puesto las claves), 
// la app seguirá funcionando visualmente pero no guardará datos.
let app;
let firestoreDb;

try {
  app = initializeApp(firebaseConfig);
  firestoreDb = getFirestore(app);
} catch (e) {
  console.warn("Firebase no está configurado correctamente. La app funcionará en modo visualización, pero los datos no se guardarán en la nube.", e);
}

export const firestore = firestoreDb;