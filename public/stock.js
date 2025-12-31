const contenedor = document.getElementById("productosStock");

async function cargarStock() {
  contenedor.innerHTML = "";

  try {
    const res = await fetch("/api/perfumes");
    const perfumes = await res.json();

    perfumes.forEach(p => {
      // Solo mostrar perfumes en stock
      if (p.stock <= 0) return;
      if (p.tipo !== "stock") return;

      const card = document.createElement("div");
      card.className = "producto-card";

      card.innerHTML = `
        <img src="${p.imagen}" alt="${p.nombre}">
        <h3>${p.nombre}</h3>
        <p class="precio">S/ ${p.precio}</p>
        <p class="stock">Stock: ${p.stock}</p>
        <button onclick="comprar('${p.nombre}')">Comprar</button>
      `;

      contenedor.appendChild(card);
    });

    if (contenedor.innerHTML === "") {
      contenedor.innerHTML = "<p>No hay perfumes disponibles</p>";
    }

  } catch (error) {
    console.error("Error cargando stock:", error);
    contenedor.innerHTML = "<p>Error al cargar el stock</p>";
  }
}

function comprar(nombre) {
  const numero = "51910163936"; // WhatsApp
  const mensaje = `Hola, estoy interesado en el perfume ${nombre}`;
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}

// Cargar stock al abrir la página
cargarStock();