const contenedor = document.getElementById("productosStock");

const perfumes = JSON.parse(localStorage.getItem("perfumes")) || [];

contenedor.innerHTML = "";

perfumes.forEach(p => {
  if (p.stock <= 0) return;

  const card = document.createElement("div");
  card.className = "producto-card";

  card.innerHTML = `
    <img src="${p.imagen}">
    <h3>${p.nombre}</h3>
    <p class="precio">S/ ${p.precio}</p>
    <p class="stock">Stock: ${p.stock}</p>
    <button onclick="comprar('${p.nombre}', ${p.precio})">Agregar al carrito</button>
  `;

  contenedor.appendChild(card);
});

// ================= FUNCIONES DEL CARRITO =================
function comprar(nombre, precio) {
  // Agregar al carrito
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.push({
    nombre: nombre,
    precio: precio,
    cantidad: 1
  });
  localStorage.setItem("carrito", JSON.stringify(carrito));

  // Animación tipo toast
  mostrarToast("Añadido al carrito exitosamente");
}

// ================= ANIMACIÓN TOAST =================
function mostrarToast(mensaje) {
  const toast = document.createElement("div");
  toast.textContent = mensaje;
  toast.style.position = "fixed";
  toast.style.bottom = "30px";
  toast.style.right = "30px";
  toast.style.background = "#111";
  toast.style.color = "#fff";
  toast.style.padding = "12px 20px";
  toast.style.borderRadius = "8px";
  toast.style.boxShadow = "0 4px 6px rgba(0,0,0,0.2)";
  toast.style.opacity = "0";
  toast.style.transition = "all 0.3s ease";

  document.body.appendChild(toast);

  // Aparece
  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(-10px)";
  }, 50);

  // Desaparece
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(0)";
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}