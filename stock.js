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
    <button onclick="alert('Pedido enviado')">Comprar</button>
  `;

  contenedor.appendChild(card);
});