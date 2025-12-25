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
        <button onclick="editarPerfume(${index})">Editar</button>
        <button onclick="borrarPerfume(${index})">Borrar</button>
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
  const fileInput = document.getElementById('imagen');

  if (!fileInput.files || fileInput.files.length === 0) {
    alert('Selecciona una imagen');
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    const imagen = reader.result; // Base64
    perfumes.push({ nombre, precio, stock, tipo, imagen });
    localStorage.setItem('perfumes', JSON.stringify(perfumes));
    mostrarPerfumes();
    form.reset();
    alert('Perfume agregado correctamente');

    // ===== AGREGADO: mensaje visual =====
    mostrarMensajeExito();
  };

  reader.onerror = () => {
    alert('Error al leer la imagen');
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

/* =====================================================
   ======== TODO LO DE ABAJO ES AGREGADO =========
   ===================================================== */

// Mensaje visual de éxito
function mostrarMensajeExito() {
  let mensaje = document.getElementById('mensajeExito');

  if (!mensaje) {
    mensaje = document.createElement('div');
    mensaje.id = 'mensajeExito';
    mensaje.textContent = '✔ Perfume añadido correctamente';
    mensaje.style.position = 'fixed';
    mensaje.style.top = '20px';
    mensaje.style.right = '20px';
    mensaje.style.background = '#1dd1a1';
    mensaje.style.color = '#000';
    mensaje.style.padding = '12px 18px';
    mensaje.style.borderRadius = '10px';
    mensaje.style.fontWeight = 'bold';
    mensaje.style.zIndex = '9999';
    mensaje.style.boxShadow = '0 0 15px rgba(29,209,161,0.6)';
    document.body.appendChild(mensaje);
  }

  mensaje.style.display = 'block';

  setTimeout(() => {
    mensaje.style.display = 'none';
  }, 2500);
}

// ================= PEDIDOS REALIZADOS =================
const listaPedidos = document.getElementById('listaPedidos');

function mostrarPedidos() {
  if (!listaPedidos) return;

  const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
  listaPedidos.innerHTML = '';

  if (pedidos.length === 0) {
    listaPedidos.innerHTML = '<p style="color:#aaa">No hay pedidos aún</p>';
    return;
  }

  pedidos.forEach((pedido, i) => {
    const div = document.createElement('div');
    div.className = 'pedido-card';
    div.innerHTML = `
      <p><strong>Pedido #${i + 1}</strong></p>
      <p>Cliente: ${pedido.cliente || 'Sin nombre'}</p>
      <p>Total: S/ ${pedido.total}</p>
      <p>Fecha: ${pedido.fecha}</p>
    `;
    listaPedidos.appendChild(div);
  });
}

mostrarPedidos();