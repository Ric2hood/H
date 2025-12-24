const form = document.getElementById('formPerfume');
const productosAdmin = document.getElementById('productosAdmin');
const pedidosAdmin = document.getElementById('pedidosAdmin');

// Cargar perfumes y pedidos desde localStorage
let perfumes = JSON.parse(localStorage.getItem('perfumes')) || [];
let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

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
        <button onclick="editarPerfume(${index})">Editar</button>
        <button onclick="borrarPerfume(${index})">Borrar</button>
      </div>
    `;
    productosAdmin.appendChild(div);
  });
}

// Mostrar pedidos recibidos
function mostrarPedidos() {
  pedidosAdmin.innerHTML = '';
  if (pedidos.length === 0) {
    pedidosAdmin.innerHTML = '<p>No hay pedidos aún.</p>';
    return;
  }

  pedidos.forEach((pedido, index) => {
    const div = document.createElement('div');
    div.className = 'pedido-card';
    div.innerHTML = `
      <h4>Pedido #${index + 1}</h4>
      <p><strong>Nombre:</strong> ${pedido.nombre}</p>
      <p><strong>Teléfono:</strong> ${pedido.telefono}</p>
      <p><strong>Correo:</strong> ${pedido.correo}</p>
      <p><strong>Dirección:</strong> ${pedido.direccion}</p>
      <p><strong>Productos:</strong> ${pedido.items.map(i => i.nombre).join(', ')}</p>
      <p><strong>Total:</strong> S/ ${pedido.total}</p>
      <p><strong>Estado:</strong> ${pedido.estado || 'Pendiente'}</p>
      <button onclick="marcarEntregado(${index})">Marcar como entregado</button>
    `;
    pedidosAdmin.appendChild(div);
  });
}

// Marcar pedido como entregado
window.marcarEntregado = (index) => {
  pedidos[index].estado = 'Entregado';
  localStorage.setItem('pedidos', JSON.stringify(pedidos));
  mostrarPedidos();
};

// Agregar nuevo perfume con imagen subida desde PC
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const precio = parseFloat(document.getElementById('precio').value);
  const stock = parseInt(document.getElementById('stock').value);
  const tipo = document.getElementById('tipo').value;
  const file = document.getElementById('imagen').files[0];

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
mostrarPedidos();