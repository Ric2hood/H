const form = document.getElementById('perfumeForm');
const perfumeList = document.getElementById('perfumeList');

let perfumes = JSON.parse(localStorage.getItem('perfumes')) || [];

// Función para renderizar perfumes
function renderPerfumes() {
  perfumeList.innerHTML = '';
  perfumes.forEach((perfume, index) => {
    const card = document.createElement('div');
    card.className = 'perfume-card';
    card.innerHTML = `
      <img src="${perfume.imagen}" alt="${perfume.nombre}">
      <div>
        <strong>${perfume.nombre}</strong><br>
        S/ ${perfume.precio}<br>
        Stock: ${perfume.stock}<br>
        Tipo: ${perfume.tipo}
      </div>
      <div>
        <button onclick="editarPerfume(${index})">Editar</button>
        <button onclick="borrarPerfume(${index})">Borrar</button>
      </div>
    `;
    perfumeList.appendChild(card);
  });
}

// Agregar perfume
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nuevo = {
    nombre: document.getElementById('nombre').value,
    precio: document.getElementById('precio').value,
    stock: document.getElementById('stock').value,
    imagen: document.getElementById('imagen').value,
    tipo: document.getElementById('tipo').value
  };
  perfumes.push(nuevo);
  localStorage.setItem('perfumes', JSON.stringify(perfumes));
  renderPerfumes();
  form.reset();
  alert('Perfume agregado con éxito 🙂');
});

// Borrar perfume
window.borrarPerfume = (index) => {
  if(confirm('¿Seguro quieres borrar este perfume?')) {
    perfumes.splice(index, 1);
    localStorage.setItem('perfumes', JSON.stringify(perfumes));
    renderPerfumes();
  }
};

// Editar perfume
window.editarPerfume = (index) => {
  const perfume = perfumes[index];
  const nombre = prompt('Nombre:', perfume.nombre);
  if(nombre === null) return;
  const precio = prompt('Precio:', perfume.precio);
  if(precio === null) return;
  const stock = prompt('Stock:', perfume.stock);
  if(stock === null) return;
  const imagen = prompt('URL Imagen:', perfume.imagen);
  if(imagen === null) return;
  const tipo = prompt('Tipo (stock/pedido):', perfume.tipo);
  if(tipo === null) return;

  perfumes[index] = { nombre, precio, stock, imagen, tipo };
  localStorage.setItem('perfumes', JSON.stringify(perfumes));
  renderPerfumes();
};

// Render inicial
renderPerfumes();