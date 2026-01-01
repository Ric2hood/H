const form = document.getElementById('formPerfume');
const productosAdmin = document.getElementById('productosAdmin');

// ✅ URL REAL DEL BACKEND (RENDER)
const API_URL = 'https://h-t4wc.onrender.com/api/perfumes';

// ------------------ MOSTRAR PERFUMES ------------------
async function mostrarPerfumes() {
  productosAdmin.innerHTML = '';

  try {
    const res = await fetch(API_URL);
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

        <input class="nombre" value="${perfume.nombre}">
        <input class="precio" type="number" value="${perfume.precio}">
        <input class="stock" type="number" value="${perfume.stock}">
        <input class="tipo" value="${perfume.tipo}">

        <button class="guardar">💾 Guardar</button>
        <button class="eliminar">🗑️ Eliminar</button>
      `;

      // -------- GUARDAR (EDITAR) --------
      div.querySelector('.guardar').addEventListener('click', async () => {
        const body = {
          nombre: div.querySelector('.nombre').value,
          precio: div.querySelector('.precio').value,
          stock: div.querySelector('.stock').value,
          tipo: div.querySelector('.tipo').value
        };

        try {
          const res = await fetch(`${API_URL}/${perfume._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });

          if (!res.ok) throw new Error('Error al actualizar');

          alert('✅ Perfume actualizado');
          mostrarPerfumes();

        } catch (err) {
          alert('❌ Error al actualizar');
          console.error(err);
        }
      });

      // -------- ELIMINAR --------
      div.querySelector('.eliminar').addEventListener('click', async () => {
        if (!confirm('¿Seguro que deseas eliminar este perfume?')) return;

        try {
          const res = await fetch(`${API_URL}/${perfume._id}`, {
            method: 'DELETE'
          });

          if (!res.ok) throw new Error('Error al eliminar');

          alert('🗑️ Perfume eliminado');
          mostrarPerfumes();

        } catch (err) {
          alert('❌ Error al eliminar');
          console.error(err);
        }
      });

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
    const res = await fetch(API_URL, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }

    alert('✅ Perfume agregado correctamente');
    form.reset();
    mostrarPerfumes();

  } catch (err) {
    alert('❌ ' + err.message);
    console.error(err);
  }
});

// ------------------ INICIAR ------------------
mostrarPerfumes();