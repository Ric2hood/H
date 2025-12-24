// 🔥 Firebase v9 (MODULAR)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// ⚠️ TU CONFIG DE FIREBASE (NO CAMBIAR)
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_ID",
  appId: "TU_APP_ID"
};

// INIT
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// FORM
const form = document.getElementById("form-stock");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const precio = Number(document.getElementById("precio").value);
  const stock = Number(document.getElementById("stock").value);
  const imagen = document.getElementById("imagen").value.trim();

  try {
    await addDoc(collection(db, "stock"), {
      nombre,
      precio,
      stock,
      imagen,
      fecha: new Date()
    });

    mensaje.textContent = "✅ Perfume subido con éxito";
    mensaje.style.color = "green";
    form.reset();

  } catch (error) {
    mensaje.textContent = "❌ Error al subir el perfume";
    mensaje.style.color = "red";
    console.error("Error:", error);
  }
});