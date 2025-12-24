import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore, collection, addDoc } from 
  "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

console.log("✅ admin.js cargado");

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCmFlJ158GJOlRaF1kdmdGirTXl_SRhO_4",
  authDomain: "henris-40e93.firebaseapp.com",
  projectId: "henris-40e93",
  storageBucket: "henris-40e93.firebasestorage.app",
  messagingSenderId: "18141344120",
  appId: "1:18141344120:web:a4bd31020ed4298a9c188d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById("form-stock");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("🟡 Submit detectado");

  try {
    await addDoc(collection(db, "perfumes"), {
      nombre: document.getElementById("nombre").value,
      precio: Number(document.getElementById("precio").value),
      stock: Number(document.getElementById("stock").value),
      imagen: document.getElementById("imagen").value,
      tipo: "stock",
      fecha: new Date()
    });

    mensaje.textContent = "✅ Perfume subido con éxito";
    mensaje.style.color = "green";
    form.reset();

    console.log("🟢 Subido a Firebase");

  } catch (error) {
    mensaje.textContent = "❌ Error al subir";
    mensaje.style.color = "red";
    console.error("🔥 ERROR:", error);
  }
});