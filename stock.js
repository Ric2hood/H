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

  // Animación de éxito al agregar
  const alerta = document.createElement("div");
  alerta.textContent = "Añadido al carrito exitosamente ✅";
  alerta.style.position = "fixed";
  alerta.style.bottom = "20px";
  alerta.style.right = "20px";
  alerta.style.padding = "12px 20px";
  alerta.style.background = "#111";
  alerta.style.color = "#fff";
  alerta.style.borderRadius = "8px";
  alerta.style.zIndex = "9999";
  document.body.appendChild(alerta);

  setTimeout(() => alerta.remove(), 2500);
}