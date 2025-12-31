const form = document.getElementById('formPerfume');
const productosAdmin = document.getElementById('productosAdmin');

// ------------------ MOSTRAR PERFUMES ------------------
async function mostrarPerfumes() {
  productosAdmin.innerHTML = '';

  try {
    const res = await fetch('/api/perfumes');
    const perfumes = await res.json();

    if (!Array.isArray(perfumes)) {
      console.error('La respuesta no es un array');
      return;
    }

    perfumes.forEach((perfume) => {
      const div = document.createElement('div');
      div.className = 'producto-card';

      div.innerHTML = `
        <img 
          src="${perfume.imagen}" 
          alt="${perfume.nombre}" 
          onerror="this.src='https://via.placeholder.com/300x300?text=Sin+Imagen'"
        >
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

// ------------------ SUBIR PERFUME ------------------
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  try {
    const res = await fetch('/api/perfumes', {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Error al subir perfume');
    }

    alert('Perfume agregado correctamente ✅');
    form.reset();
    mostrarPerfumes();

  } catch (err) {
    alert('❌ ' + err.message);
    console.error(err);
  }
});

// ------------------ INICIAR ------------------
mostrarPerfumes();