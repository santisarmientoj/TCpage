import { auth } from "./firebase-config.js";
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("error-msg");

  try {
    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Guardar nombre en el perfil del usuario
    await updateProfile(userCredential.user, { displayName: name });

    console.log("Usuario registrado:", userCredential.user);

    // Redirigir al dashboard
    window.location.href = "dashboard.html";
  } catch (error) {
    console.error("Error en registro:", error.code, error.message);
    errorMsg.textContent = "Error: " + error.message;
  }
});
