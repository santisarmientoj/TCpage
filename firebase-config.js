// Importa las funciones que necesitas desde Firebase (CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Tu configuración de Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyCc6CMb9XEEkPyUJQsQRqpzqvJZelHgzhA",
    authDomain: "tclogin-5881d.firebaseapp.com",
    projectId: "tclogin-5881d",
    storageBucket: "tclogin-5881d.firebasestorage.app",
    messagingSenderId: "976782544606",
    appId: "1:976782544606:web:04746ba41689fd03d5fc4f",
    measurementId: "G-WWJ784H883"
  };

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };

