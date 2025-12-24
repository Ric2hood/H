const formAgregar = document.getElementById("form-agregar");
const listaPerfumesDiv = document.getElementById("lista-perfumes");
const listaPedidosDiv = document.getElementById("lista-pedidos");

// Perfumes guardados en localStorage
let perfumes = JSON.parse(localStorage.getItem("perfumes")) || [];

// Pedidos guardados en localStorage
let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

// FUNCIONES PERFUMES
function mostrarPerfumes() {
  listaPerfumesDiv.innerHTML = "";
  if(perfumes.length === 0){
    listaPerfumesDiv.innerHTML = "<p>No hay perfumes agregados aún.</p>";
    return;
  }

  perfumes.forEach((p, index) => {
    const div = document.createElement("div");
    div.className = "admin-perfume-card";

    div.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}">
      <div class="info">
        <h3>${p.nombre}</h3>
        <p>Precio: S/ ${p.precio}</p>
        <p>Stock: ${p.stock}</p>
        <p>Tipo: ${p.tipo}</p>
      </div>
      <button class="btn-eliminar" onclick="eliminarPerfume(${index})">
        <i class="fa-solid fa-trash"></i> Eliminar
      </button>
    `;

    listaPerfumesDiv.appendChild(div);
  });
}

function eliminarPerfume(index) {
  perfumes.splice(index, 1);
  localStorage.setItem("perfumes", JSON.stringify(perfumes));
  mostrarPerfumes();
}

formAgregar.addEventListener("submit", (e) => {
  e.preventDefault();

  const nuevoPerfume = {
    nombre: document.getElementById("nombre").value,
    precio: document.getElementById("precio").value,
    stock: document.getElementById("stock").value,
    imagen: document.getElementById("imagen").value,
    tipo: document.getElementById("tipo").value
  };

  perfumes.push(nuevoPerfume);
  localStorage.setItem("perfumes", JSON.stringify(perfumes));
  mostrarPerfumes();
  formAgregar.reset();
  alert("✅ Perfume agregado correctamente");
});

// FUNCIONES PEDIDOS
function mostrarPedidos() {
  listaPedidosDiv.innerHTML = "";

  if(pedidos.length === 0){
    listaPedidosDiv.innerHTML = "<p>No hay pedidos aún.</p>";
    return;
  }

  pedidos.forEach((p, index) => {
    const div = document.createElement("div");
    div.className = "pedido-card";

    let productos = p.productos.map(prod => `<li>${prod.nombre} (S/ ${prod.precio})</li>`).join("");

    div.innerHTML = `
      <div class="info">
        <h3>Pedido #${index+1}</h3>
        <p><strong>Nombre:</strong> ${p.nombre}</p>
        <p><strong>Correo:</strong> ${p.correo}</p>
        <p><strong>Teléfono:</strong> ${p.telefono}</p>
        <p><strong>Dirección:</strong> ${p.direccion}</p>
        <p><strong>Productos:</strong></p>
        <ul>${productos}</ul>
      </div>
      <button class="btn-eliminar" onclick="eliminarPedido(${index})">
        <i class="fa-solid fa-trash"></i> Eliminar
      </button>
    `;

    listaPedidosDiv.appendChild(div);
  });
}

function eliminarPedido(index) {
  pedidos.splice(index, 1);
  localStorage.setItem("pedidos", JSON.stringify(pedidos));
  mostrarPedidos();
}

// Mostrar todo al cargar la página
mostrarPerfumes();
mostrarPedidos();