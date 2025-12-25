document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById('formPerfume');
  const productosAdmin = document.getElementById('productosAdmin');

  if (!form || !productosAdmin) {
    alert("Error: no se encontró el formulario o el contenedor");
    return;
  }

  // Cargar perfumes
  let perfumes = JSON.parse(localStorage.getItem('perfumes')) || [];

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

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const precio = parseFloat(document.getElementById('precio').value);
    const stock = parseInt(document.getElementById('stock').value);
    const tipo = document.getElementById('tipo').value;
    const fileInput = document.getElementById('imagen');

    if (!nombre || isNaN(precio) || isNaN(stock)) {
      alert("Completa todos los campos");
      return;
    }

    if (!fileInput.files || fileInput.files.length === 0) {
      alert("Selecciona una imagen");
      return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      perfumes.push({
        nombre,
        precio,
        stock,
        tipo,
        imagen: reader.result
      });

      localStorage.setItem('perfumes', JSON.stringify(perfumes));
      mostrarPerfumes();
      form.reset();

      alert("✅ Perfume agregado correctamente");
    };

    reader.readAsDataURL(file);
  });

  window.borrarPerfume = (index) => {
    if (confirm("¿Borrar este perfume?")) {
      perfumes.splice(index, 1);
      localStorage.setItem('perfumes', JSON.stringify(perfumes));
      mostrarPerfumes();
    }
  };

  window.editarPerfume = (index) => {
    const perfume = perfumes[index];
    const nuevoPrecio = prompt("Nuevo precio:", perfume.precio);
    const nuevoStock = prompt("Nuevo stock:", perfume.stock);

    if (nuevoPrecio !== null) perfume.precio = parseFloat(nuevoPrecio);
    if (nuevoStock !== null) perfume.stock = parseInt(nuevoStock);

    perfumes[index] = perfume;
    localStorage.setItem('perfumes', JSON.stringify(perfumes));
    mostrarPerfumes();
  };

  mostrarPerfumes();

});