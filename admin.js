// admin.js - Script corregido para panel de administración
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM cargado - Inicializando admin...');
  
  // Referencias a elementos del DOM
  const form = document.getElementById('formPerfume');
  const productosAdmin = document.getElementById('productosAdmin');
  
  // Verificar que los elementos existen
  if (!form) {
    console.error('ERROR: No se encontró el formulario con id "formPerfume"');
    return;
  }
  
  if (!productosAdmin) {
    console.error('ERROR: No se encontró el contenedor con id "productosAdmin"');
    return;
  }
  
  // Cargar perfumes desde localStorage o inicializar array vacío
  let perfumes = JSON.parse(localStorage.getItem('perfumes')) || [];
  console.log(`Perfumes cargados: ${perfumes.length}`);
  
  // Mostrar perfumes en el panel de administración
  function mostrarPerfumes() {
    productosAdmin.innerHTML = '';
    
    if (perfumes.length === 0) {
      productosAdmin.innerHTML = `
        <div class="empty-message">
          <h3>📭 No hay perfumes en el inventario</h3>
          <p>Agrega tu primer perfume usando el formulario superior.</p>
        </div>
      `;
      return;
    }
    
    perfumes.forEach((perfume, index) => {
      const div = document.createElement('div');
      div.className = 'producto-card';
      div.innerHTML = `
        <img src="${perfume.imagen}" alt="${perfume.nombre}" onerror="this.src='https://via.placeholder.com/300x200/cccccc/969696?text=Imagen+no+disponible'">
        <h3>${perfume.nombre}</h3>
        <p><strong>Precio:</strong> S/ ${perfume.precio.toFixed(2)}</p>
        <p><strong>Stock:</strong> ${perfume.stock} unidades</p>
        <p><strong>Tipo:</strong> ${perfume.tipo === 'stock' ? 'En Stock' : 'Por Pedido'}</p>
        <p><strong>Estado:</strong> <span style="color: ${perfume.stock > 0 ? '#5cb85c' : '#d9534f'}">${perfume.stock > 0 ? 'Disponible' : 'Agotado'}</span></p>
        <div class="acciones">
          <button onclick="editarPerfume(${index})" title="Editar precio y stock">✏️ Editar</button>
          <button onclick="borrarPerfume(${index})" title="Eliminar producto">🗑️ Eliminar</button>
        </div>
      `;
      productosAdmin.appendChild(div);
    });
  }
  
  // Agregar nuevo perfume
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('Formulario enviado');
    
    // Obtener valores del formulario
    const nombre = document.getElementById('nombre').value.trim();
    const precio = parseFloat(document.getElementById('precio').value);
    const stock = parseInt(document.getElementById('stock').value);
    const tipo = document.getElementById('tipo').value;
    const fileInput = document.getElementById('imagen');
    const file = fileInput.files[0];
    
    // Validaciones
    if (!nombre) {
      alert('Por favor, ingresa un nombre para el perfume.');
      return;
    }
    
    if (isNaN(precio) || precio <= 0) {
      alert('Por favor, ingresa un precio válido mayor a 0.');
      return;
    }
    
    if (isNaN(stock) || stock < 0) {
      alert('Por favor, ingresa un stock válido (0 o más).');
      return;
    }
    
    if (!tipo) {
      alert('Por favor, selecciona un tipo de disponibilidad.');
      return;
    }
    
    if (!file) {
      alert('Por favor, selecciona una imagen para el perfume.');
      return;
    }
    
    // Validar tamaño de imagen (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen es demasiado grande. Máximo 2MB permitido.');
      return;
    }
    
    // Leer la imagen como Base64
    const reader = new FileReader();
    
    reader.onload = function() {
      const imagen = reader.result; // Imagen en Base64
      
      // Crear objeto perfume
      const nuevoPerfume = {
        nombre,
        precio,
        stock,
        tipo,
        imagen,
        fechaCreacion: new Date().toISOString(),
        id: Date.now() // ID único basado en timestamp
      };
      
      // Agregar al array y guardar en localStorage
      perfumes.push(nuevoPerfume);
      localStorage.setItem('perfumes', JSON.stringify(perfumes));
      
      // Actualizar la vista
      mostrarPerfumes();
      
      // Limpiar formulario
      form.reset();
      
      // Mostrar mensaje de éxito
      alert(`✅ Perfume "${nombre}" agregado exitosamente!`);
      console.log('Perfume agregado:', nuevoPerfume);
    };
    
    reader.onerror = function() {
      alert('Error al leer la imagen. Por favor, intenta con otra.');
      console.error('Error al leer archivo:', reader.error);
    };
    
    reader.readAsDataURL(file);
  });
  
  // Función para borrar perfume (disponible globalmente)
  window.borrarPerfume = function(index) {
    if (confirm(`¿Estás seguro de eliminar el perfume "${perfumes[index].nombre}"? Esta acción no se puede deshacer.`)) {
      const perfumeEliminado = perfumes[index];
      perfumes.splice(index, 1);
      localStorage.setItem('perfumes', JSON.stringify(perfumes));
      mostrarPerfumes();
      alert(`🗑️ Perfume "${perfumeEliminado.nombre}" eliminado exitosamente.`);
      console.log('Perfume eliminado:', perfumeEliminado);
    }
  };
  
  // Función para editar perfume (disponible globalmente)
  window.editarPerfume = function(index) {
    const perfume = perfumes[index];
    
    const nuevoPrecio = prompt(`Nuevo precio para "${perfume.nombre}" (S/):`, perfume.precio);
    if (nuevoPrecio === null) return; // Usuario canceló
    
    const nuevoStock = prompt(`Nuevo stock para "${perfume.nombre}":`, perfume.stock);
    if (nuevoStock === null) return; // Usuario canceló
    
    // Validar y actualizar
    const precioNum = parseFloat(nuevoPrecio);
    const stockNum = parseInt(nuevoStock);
    
    if (!isNaN(precioNum) && precioNum > 0) {
      perfume.precio = precioNum;
    } else {
      alert('Precio inválido. No se actualizó.');
    }
    
    if (!isNaN(stockNum) && stockNum >= 0) {
      perfume.stock = stockNum;
    } else {
      alert('Stock inválido. No se actualizó.');
    }
    
    // Guardar cambios
    perfumes[index] = perfume;
    localStorage.setItem('perfumes', JSON.stringify(perfumes));
    mostrarPerfumes();
    
    alert('✅ Datos actualizados correctamente.');
    console.log('Perfume actualizado:', perfume);
  };
  
  // Inicializar: mostrar perfumes al cargar
  mostrarPerfumes();
  
  // Agregar botón de limpiar inventario (para desarrollo/testing)
  const clearButton = document.createElement('button');
  clearButton.textContent = '🧹 Limpiar Todo (Testing)';
  clearButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #ff6b6b;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px;
    z-index: 1000;
    opacity: 0.7;
  `;
  clearButton.onclick = function() {
    if (confirm('⚠️ ¿ESTÁS SEGURO? Esto eliminará TODOS los perfumes. Solo para testing.')) {
      localStorage.removeItem('perfumes');
      perfumes = [];
      mostrarPerfumes();
      alert('Inventario limpiado.');
    }
  };
  document.body.appendChild(clearButton);
  
  console.log('Admin inicializado correctamente.');
});