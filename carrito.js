const carritoItemsDiv = document.getElementById("carrito-items");
const carritoTotal = document.getElementById("carrito-total");
const formPago = document.getElementById("form-pago");
const cartCount = document.getElementById("cart-count");

// Tomamos los productos del localStorage
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Mostrar productos en el carrito
function mostrarCarrito() {
  carritoItemsDiv.innerHTML = "";
  let total = 0;

  if(carrito.length === 0){
    carritoItemsDiv.innerHTML = "<p>Tu carrito está vacío 😔</p>";
  }

  carrito.forEach((p, index) => {
    const item = document.createElement("div");
    item.className = "carrito-item-card";

    item.innerHTML = `
      <span class="item-numero">${index + 1}.</span>
      <div class="item-info">
        <img src="${p.imagen}" alt="${p.nombre}">
        <div>
          <h3>${p.nombre}</h3>
          <p class="precio">S/ ${p.precio}</p>
        </div>
      </div>
      <button class="btn-eliminar" onclick="eliminarDelCarrito(${index})">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;

    carritoItemsDiv.appendChild(item);
    total += Number(p.precio);
  });

  carritoTotal.textContent = `Total: S/ ${total}`;
  cartCount.textContent = carrito.length;
}

mostrarCarrito();

// Eliminar producto
function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
  mostrarAnimacion("Producto eliminado ❌");
}

// Función para animación de confirmación
function mostrarAnimacion(mensaje) {
  const alerta = document.createElement("div");
  alerta.className = "alerta-carrito";
  alerta.textContent = mensaje;
  document.body.appendChild(alerta);
  setTimeout(() => {
    alerta.remove();
  }, 2500);
}

// Simular pago (guardar datos en localStorage)
formPago.addEventListener("submit", (e) => {
  e.preventDefault();

  if(carrito.length === 0){
    mostrarAnimacion("Tu carrito está vacío ❌");
    return;
  }

  const datos = {
    nombre: document.getElementById("nombre").value,
    correo: document.getElementById("correo").value,
    telefono: document.getElementById("telefono").value,
    direccion: document.getElementById("direccion").value,
    productos: carrito
  };

  // Guardar pedido para admin
  let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
  pedidos.push(datos);
  localStorage.setItem("pedidos", JSON.stringify(pedidos));

  // Limpiar carrito
  carrito = [];
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();

  mostrarAnimacion("✅ Pedido enviado (prueba)");
  formPago.reset();
});