import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔐 Configuración Firebase (TU PROYECTO)
const firebaseConfig = {
  apiKey: "AIzaSyCmFlJ158GJOlRaF1kdmdGirTXl_SRhO_4",
  authDomain: "henris-40e93.firebaseapp.com",
  projectId: "henris-40e93",
  storageBucket: "henris-40e93.firebasestorage.app",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 📦 Cargar perfumes en STOCK
async function cargarStock() {
  const contenedor = document.getElementById("stock-container");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  const snapshot = await getDocs(collection(db, "perfumes"));

  snapshot.forEach((doc) => {
    const p = doc.data();

    contenedor.innerHTML += `
      <div class="producto">
        <img src="${p.imagen}" alt="${p.nombre}">
        <h3>${p.nombre}</h3>
        <p class="precio">S/ ${p.precio}</p>
        <p class="stock">Stock: ${p.stock}</p>
        <button ${p.stock === 0 ? "disabled" : ""}>
          ${p.stock === 0 ? "Agotado" : "Agregar al carrito"}
        </button>
      </div>
    `;
  });
}

cargarStock();