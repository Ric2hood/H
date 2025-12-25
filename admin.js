
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