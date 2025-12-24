const contenedor = document.getElementById("productosStock");

// Obtener perfumes desde localStorage (tu lista de perfumes)
const perfumes = JSON.parse(localStorage.getItem("perfumes")) || [];

contenedor.innerHTML = "";

// Mostrar cada perfume en la página
perfumes.forEach(p => {
  if (p.stock <= 0) return;

  const card = document.createElement("div");
  card.className = "producto-card";

  card.innerHTML = `
    <img src="${p.imagen}">
    <h3>${p.nombre}</h3>
    <p class="precio">S/ ${p.precio}</p>
    <p class="stock">Stock: ${p.stock}</p>
    <button onclick="agregarAlCarrito('${p.nombre}')">Agregar al carrito</button>
  `;

  contenedor.appendChild(card);
});

// ================= FUNCIONES DEL CARRITO =================
function agregarAlCarrito(nombre) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const producto = perfumes.find(p => p.nombre === nombre);
  if (!producto) return;

  carrito.push(producto);
  localStorage.setItem("carrito", JSON.stringify(carrito));

  // Animación de éxito mejorada
  const alerta = document.createElement("div");
  alerta.textContent = "✅ Añadido al carrito";
  alerta.style.position = "fixed";
  alerta.style.bottom = "20px";
  alerta.style.right = "20px";
  alerta.style.padding = "14px 22px";
  alerta.style.background = "#111";
  alerta.style.color = "#fff";
  alerta.style.fontWeight = "bold";
  alerta.style.borderRadius = "12px";
  alerta.style.zIndex = "9999";
  alerta.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";
  alerta.style.transform = "translateY(40px) scale(0.8)";
  alerta.style.opacity = "0";
  alerta.style.transition = "all 0.5s ease-out";

  document.body.appendChild(alerta);

  // Animación de entrada
  requestAnimationFrame(() => {
    alerta.style.transform = "translateY(0) scale(1)";
    alerta.style.opacity = "1";
  });

  // Animación de salida
  setTimeout(() => {
    alerta.style.transform = "translateY(-40px) scale(0.8)";
    alerta.style.opacity = "0";
  }, 1800);

  // Borrar del DOM
  setTimeout(() => alerta.remove(), 2300);
}