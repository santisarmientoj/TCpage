// dashboard.js
import { auth, db } from "./firebase-config.js";
import { 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { 
  setDoc, 
  doc, 
  getDoc, 
  updateDoc, 
  arrayUnion 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Referencias a elementos del DOM
const logoutBtn = document.getElementById("logout");
const cursosSection = document.getElementById("cursos");

// Lista de cursos disponibles en la plataforma
const cursosDisponibles = [
  { id: "armonia", titulo: "Curso de Armonía", url: "curso-armonia.html" },
  { id: "tecnica", titulo: "Curso de Técnica Vocal", url: "curso-tecnica.html" },
  { id: "ritmo", titulo: "Curso de Ritmo", url: "curso-ritmo.html" }
];

// Verificar autenticación
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    console.log("Usuario logueado:", user.uid);

    // Cargar cursos desde Firestore
    await cargarCursos(user.uid);
  }
});

// Cargar cursos comprados
async function cargarCursos(uid) {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    let coursesPurchased = [];

    if (userDoc.exists()) {
      coursesPurchased = userDoc.data().coursesPurchased || [];
    }

    mostrarCursos(coursesPurchased);
  } catch (error) {
    console.error("Error cargando cursos:", error);
  }
}

// Mostrar cursos en pantalla
function mostrarCursos(coursesPurchased) {
  if (!cursosSection) {
    console.error("⚠️ No se encontró el contenedor de cursos en el HTML.");
    return;
  }

  cursosSection.innerHTML = "";
  cursosDisponibles.forEach(curso => {
    const div = document.createElement("div");
    div.classList.add("curso-card");

    const titulo = document.createElement("h3");
    titulo.textContent = curso.titulo;

    const btn = document.createElement("button");

    if (coursesPurchased.includes(curso.id)) {
      btn.textContent = "Entrar";
      btn.classList.add("txt-btn-entrar");
      btn.classList.add("btn-entrar");
      btn.onclick = () => window.location.href = curso.url;
    } else {
      btn.textContent = "Comprar";
      btn.classList.add("txt-btn-comprar");
      btn.classList.add("btn-comprar");
      btn.onclick = async () => {
        const user = auth.currentUser;
        if (!user) return alert("Debes iniciar sesión para comprar un curso.");

        try {
          // Guardar compra en Firestore
          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, {
            coursesPurchased: arrayUnion(curso.id)
          });

          alert(`🎉 Has comprado el curso: ${curso.titulo}`);
          await cargarCursos(user.uid);

        } catch (error) {
          console.error("Error comprando curso:", error);
          alert("Hubo un error al comprar el curso.");
        }
      };
    }

    div.appendChild(titulo);
    div.appendChild(btn);
    cursosSection.appendChild(div);
  });
}

// Logout
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
  });
}

