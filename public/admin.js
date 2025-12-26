
const form = document.getElementById('formPerfume');
const productosAdmin = document.getElementById('productosAdmin');

// Mostrar perfumes desde backend
async function mostrarPerfumes() {
  try {
    const res = await fetch('/api/perfumes');
    const perfumes = await res.json();

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
  } catch (err) {
    console.error('Error al cargar perfumes:', err);
  }
}

// Agregar nuevo perfume al backend
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  try {
    const res = await fetch('/api/perfumes', {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      const text = await res.text();
      alert('Error: ' + text);
      return;
    }

    alert('Perfume agregado correctamente ✅');
    form.reset();
    mostrarPerfumes();

  } catch (err) {
    alert('Error de conexión con el servidor');
    console.error(err);
  }
});

// Borrar perfume desde backend
window.borrarPerfume = async (index) => {
  try {
    const res = await fetch('/api/perfumes');
    const perfumes = await res.json();
    const perfume = perfumes[index];
    if (!perfume) return;

    if (!confirm(`¿Deseas borrar ${perfume.nombre}?`)) return;

    // Nota: aquí necesitas una ruta DELETE en tu backend, por ahora solo alertamos
    alert('Función de borrar pendiente de implementar en backend');
  } catch (err) {
    console.error(err);
  }
};

// Editar perfume desde backend
window.editarPerfume = async (index) => {
  try {
    const res = await fetch('/api/perfumes');
    const perfumes = await res.json();
    const perfume = perfumes[index];
    if (!perfume) return;

    const nuevoPrecio = prompt('Nuevo precio (S/):', perfume.precio);
    const nuevoStock = prompt('Nuevo stock:', perfume.stock);

    // Nota: aquí necesitas una ruta PUT en tu backend, por ahora solo alertamos
    alert('Función de editar pendiente de implementar en backend');
  } catch (err) {
    console.error(err);
  }
};

// Cargar al iniciar
mostrarPerfumes();