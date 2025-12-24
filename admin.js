// ================= PERFUMES =================
const form = document.getElementById('formPerfume');
const productosAdmin = document.getElementById('productosAdmin');

// Cargar perfumes desde localStorage
let perfumes = JSON.parse(localStorage.getItem('perfumes')) || [];

// Mostrar perfumes en admin
function mostrarPerfumes() {
  productosAdmin.innerHTML = '';
  perfumes.forEach((perfume, index) => {
    const div = document.createElement('div');
    div.className = 'producto-card';
    div.innerHTML = `
      <img src="${perfume.imagen}" alt="${perfume.nombre}">
      <h3>${perfume.nombre}</h3>
      <p>Precio: S/ ${perfume.precio}</p>
      <p>Stock: ${perfume.stock}</p>
      <p>Tipo: ${perfume.tipo}</p>
      <div class="acciones">
        <button class="editar" onclick="editarPerfume(${index})">Editar</button>
        <button class="borrar" onclick="borrarPerfume(${index})">Borrar</button>
      </div>
    `;
    productosAdmin.appendChild(div);
  });
}

// Agregar nuevo perfume
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const precio = parseFloat(document.getElementById('precio').value);
  const stock = parseInt(document.getElementById('stock').value);
  const tipo = document.getElementById('tipo').value;
  const file = document.getElementById('imagen').files[0];

  if (!nombre || isNaN(precio) || isNaN(stock) || !tipo) {
    return alert('Completa todos los campos correctamente');
  }

  if (!file) return alert('Selecciona una imagen');

  const reader = new FileReader();
  reader.onload = () => {
    const imagen = reader.result; // Base64

    perfumes.push({ nombre, precio, stock, tipo, imagen });
    localStorage.setItem('perfumes', JSON.stringify(perfumes));
    mostrarPerfumes();
    form.reset();
    alert('Perfume agregado con éxito');
  };
  reader.readAsDataURL(file);
});

// Borrar perfume
window.borrarPerfume = (index) => {
  if (confirm('¿Deseas borrar este perfume?')) {
    perfumes.splice(index, 1);
    localStorage.setItem('perfumes', JSON.stringify(perfumes));
    mostrarPerfumes();
  }
};

// Editar perfume (precio y stock)
window.editarPerfume = (index) => {
  const perfume = perfumes[index];
  const nuevoPrecio = prompt('Nuevo precio (S/):', perfume.precio);
  const nuevoStock = prompt('Nuevo stock:', perfume.stock);

  if (nuevoPrecio !== null) perfume.precio = parseFloat(nuevoPrecio);
  if (nuevoStock !== null) perfume.stock = parseInt(nuevoStock);

  perfumes[index] = perfume;
  localStorage.setItem('perfumes', JSON.stringify(perfumes));
  mostrarPerfumes();
};

// Mostrar al cargar
mostrarPerfumes();

// ================= PEDIDOS =================
const pedidosAdmin = document.getElementById('pedidosAdmin');

// Cargar pedidos desde localStorage
let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

// Mostrar pedidos
function mostrarPedidos() {
  pedidosAdmin.innerHTML = '';
  pedidos.forEach((pedido, index) => {
    const div = document.createElement('div');
    div.className = 'pedido-card';
    div.innerHTML = `
      <p><strong>#${index + 1} - Pedido de:</strong> ${pedido.nombreCliente}</p>
      <p><strong>Teléfono:</strong> ${pedido.telefono}</p>
      <p><strong>Correo:</strong> ${pedido.correo}</p>
      <p><strong>Dirección:</strong> ${pedido.direccion}</p>
      <p><strong>Productos:</strong></p>
      <ul>
        ${pedido.productos.map(p => `<li>${p.nombre} x${p.cantidad}</li>`).join('')}
      </ul>
      <p><strong>Total:</strong> S/ ${pedido.total}</p>
      <div class="acciones">
        <button class="entregado" onclick="marcarEntregado(${index})">Entregado</button>
        <button class="borrar" onclick="borrarPedido(${index})">Borrar</button>
      </div>
    `;
    pedidosAdmin.appendChild(div);
  });
}

// Marcar pedido como entregado
window.marcarEntregado = (index) => {
  pedidos[index].entregado = true;
  localStorage.setItem('pedidos', JSON.stringify(pedidos));
  alert(`Pedido #${index + 1} marcado como entregado`);
  mostrarPedidos();
}

// Borrar pedido
window.borrarPedido = (index) => {
  if (confirm('¿Deseas borrar este pedido?')) {
    pedidos.splice(index, 1);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    mostrarPedidos();
  }
}

// Mostrar pedidos al cargar
mostrarPedidos();