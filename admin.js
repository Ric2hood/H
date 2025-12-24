// admin.js
const form = document.getElementById('formPerfume');
const productosAdmin = document.getElementById('productosAdmin');

// Cargar perfumes desde localStorage
let perfumes = JSON.parse(localStorage.getItem('perfumes')) || [];

// Función para mostrar los perfumes
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

// Subir nuevo perfume
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
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

// Editar perfume (solo básico: cambiar stock y precio)
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