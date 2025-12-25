// ================= ELEMENTOS =================
const form = document.getElementById('formPerfume');
const productosAdmin = document.getElementById('productosAdmin');
const pedidosAdmin = document.getElementById('pedidosAdmin');

// ================= PERFUMES =================
let perfumes = JSON.parse(localStorage.getItem('perfumes')) || [];

// Mostrar perfumes
function mostrarPerfumes() {
  productosAdmin.innerHTML = '';

  perfumes.forEach((perfume, index) => {
    const div = document.createElement('div');
    div.className = 'producto-card';
    div.innerHTML = `
      <img src="${perfume.imagen}">
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

// Agregar perfume
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
    const imagen = reader.result;

    perfumes.push({ nombre, precio, stock, tipo, imagen });
    localStorage.setItem('perfumes', JSON.stringify(perfumes));
    mostrarPerfumes();
    form.reset();

    alert('Perfume agregado correctamente');
    mostrarMensajeExito();
  };

  reader.readAsDataURL(file);
});

// Borrar
window.borrarPerfume = (index) => {
  if (confirm('¿Deseas borrar este perfume?')) {
    perfumes.splice(index, 1);
    localStorage.setItem('perfumes', JSON.stringify(perfumes));
    mostrarPerfumes();
  }
};

// Editar
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

// ================= MENSAJE VISUAL =================
function mostrarMensajeExito() {
  let msg = document.getElementById('mensajeExito');

  if (!msg) {
    msg = document.createElement('div');
    msg.id = 'mensajeExito';
    msg.textContent = '✔ Perfume añadido correctamente';
    msg.style.position = 'fixed';
    msg.style.top = '20px';
    msg.style.right = '20px';
    msg.style.background = '#00bfff';
    msg.style.color = '#000';
    msg.style.padding = '12px 18px';
    msg.style.borderRadius = '10px';
    msg.style.fontWeight = 'bold';
    msg.style.boxShadow = '0 0 20px rgba(0,191,255,0.6)';
    msg.style.zIndex = '9999';
    document.body.appendChild(msg);
  }

  msg.style.display = 'block';
  setTimeout(() => msg.style.display = 'none', 2500);
}

// ================= PEDIDOS =================
function mostrarPedidos() {
  if (!pedidosAdmin) return;

  const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
  pedidosAdmin.innerHTML = '';

  if (pedidos.length === 0) {
    pedidosAdmin.innerHTML = `<p style="text-align:center;color:#aaa">No hay pedidos aún</p>`;
    return;
  }

  pedidos.forEach((pedido, i) => {
    const div = document.createElement('div');
    div.className = 'pedido-card';
    div.innerHTML = `
      <p><strong>Pedido #${i + 1}</strong></p>
      <p>Cliente: ${pedido.cliente || 'No especificado'}</p>
      <p>Total: S/ ${pedido.total}</p>
      <p>Fecha: ${pedido.fecha}</p>
    `;
    pedidosAdmin.appendChild(div);
  });
}

// ================= INICIO =================
mostrarPerfumes();
mostrarPedidos();