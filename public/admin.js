const form = document.getElementById('formPerfume');
const productosAdmin = document.getElementById('productosAdmin');

// Función para mostrar perfumes desde el backend
async function mostrarPerfumes() {
  productosAdmin.innerHTML = '';
  try {
    const res = await fetch('/api/perfumes');
    const perfumes = await res.json();

    perfumes.forEach((perfume, index) => {
      const div = document.createElement('div');
      div.className = 'producto-card';
      div.innerHTML = `
        <img src="${perfume.imagen}" alt="${perfume.nombre}">
        <h3>${perfume.nombre}</h3>
        <p>Precio: S/ ${perfume.precio}</p>
        <p>Stock: ${perfume.stock}</p>
        <p>Tipo: ${perfume.tipo}</p>
      `;
      productosAdmin.appendChild(div);
    });
  } catch (err) {
    console.error('Error al cargar perfumes:', err);
  }
}

// Enviar nuevo perfume al backend
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  try {
    const res = await fetch('/api/perfumes', {
      method: 'POST',
      body: formData
    });

    if (!res.ok) throw new Error('Error al subir perfume');

    alert('Perfume agregado correctamente');
    form.reset();
    mostrarPerfumes();
  } catch (err) {
    alert(err.message);
  }
});

// Cargar perfumes al iniciar
mostrarPerfumes();