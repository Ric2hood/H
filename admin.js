console.log("🚀 admin.js CARGADO - VERSIÓN CORREGIDA");

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  console.log("✅ DOM listo");
  
  // Elementos del DOM
  const form = document.getElementById('formPerfume');
  const productosAdmin = document.getElementById('productosAdmin');
  
  if (!form) {
    console.error("❌ ERROR: No se encontró formPerfume");
    return;
  }
  
  if (!productosAdmin) {
    console.error("❌ ERROR: No se encontró productosAdmin");
  }
  
  // Cargar perfumes existentes
  let perfumes = JSON.parse(localStorage.getItem('perfumes')) || [];
  console.log(`📊 Perfumes cargados: ${perfumes.length}`);
  
  // ===== FUNCIÓN PARA MOSTRAR PERFUMES =====
  function mostrarPerfumes() {
    if (!productosAdmin) return;
    
    productosAdmin.innerHTML = '';
    
    if (perfumes.length === 0) {
      productosAdmin.innerHTML = '<p style="text-align:center;color:#666;">No hay perfumes agregados.</p>';
      return;
    }
    
    perfumes.forEach((perfume, index) => {
      const div = document.createElement('div');
      div.className = 'producto-card';
      div.innerHTML = `
        <img src="${perfume.imagen}" alt="${perfume.nombre}" style="width:100px;height:100px;object-fit:cover;">
        <h3>${perfume.nombre}</h3>
        <p>Precio: S/ ${perfume.precio}</p>
        <p>Stock: ${perfume.stock}</p>
        <p>Tipo: ${perfume.tipo}</p>
        <div>
          <button onclick="editarPerfume(${index})" style="background:#4CAF50;color:white;border:none;padding:5px 10px;margin:2px;">Editar</button>
          <button onclick="borrarPerfume(${index})" style="background:#f44336;color:white;border:none;padding:5px 10px;margin:2px;">Borrar</button>
        </div>
      `;
      productosAdmin.appendChild(div);
    });
  }
  
  // ===== EVENTO DEL FORMULARIO (CORREGIDO) =====
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log("🎯 Formulario enviado - Iniciando proceso...");
    
    // Obtener valores
    const nombre = document.getElementById('nombre').value.trim();
    const precio = parseFloat(document.getElementById('precio').value);
    const stock = parseInt(document.getElementById('stock').value);
    const tipo = document.getElementById('tipo').value;
    const fileInput = document.getElementById('imagen');
    const file = fileInput.files[0];
    
    console.log("📝 Datos capturados:", { nombre, precio, stock, tipo, file: file ? file.name : 'No file' });
    
    // Validaciones básicas
    if (!nombre) {
      mostrarMensaje('❌ Ingresa un nombre para el perfume', 'error');
      return;
    }
    
    if (!precio || precio <= 0) {
      mostrarMensaje('❌ Ingresa un precio válido', 'error');
      return;
    }
    
    if (!stock || stock < 0) {
      mostrarMensaje('❌ Ingresa un stock válido', 'error');
      return;
    }
    
    if (!tipo) {
      mostrarMensaje('❌ Selecciona un tipo', 'error');
      return;
    }
    
    if (!file) {
      mostrarMensaje('❌ Selecciona una imagen', 'error');
      return;
    }
    
    // Verificar que sea una imagen
    if (!file.type.startsWith('image/')) {
      mostrarMensaje('❌ El archivo debe ser una imagen', 'error');
      return;
    }
    
    // Leer la imagen
    console.log("🖼️ Leyendo imagen...");
    const reader = new FileReader();
    
    reader.onload = function(event) {
      console.log("✅ Imagen leída correctamente");
      
      const imagen = event.target.result;
      
      // Crear objeto perfume
      const nuevoPerfume = {
        id: Date.now(),
        nombre,
        precio,
        stock,
        tipo,
        imagen,
        fecha: new Date().toLocaleString()
      };
      
      // Agregar al array
      perfumes.push(nuevoPerfume);
      
      // Guardar en localStorage
      localStorage.setItem('perfumes', JSON.stringify(perfumes));
      console.log("💾 Guardado en localStorage. Total perfumes:", perfumes.length);
      
      // Mostrar mensaje de éxito
      mostrarMensaje(`✅ ¡Perfume "${nombre}" agregado correctamente!`, 'success');
      
      // Actualizar la vista
      mostrarPerfumes();
      
      // Limpiar formulario
      form.reset();
      
      // Mostrar en consola para verificar
      console.log("📦 Perfume agregado:", nuevoPerfume);
    };
    
    reader.onerror = function(error) {
      console.error("❌ Error al leer la imagen:", error);
      mostrarMensaje('❌ Error al cargar la imagen', 'error');
    };
    
    reader.onabort = function() {
      console.error("❌ Lectura de imagen abortada");
      mostrarMensaje('❌ Carga de imagen cancelada', 'error');
    };
    
    // Iniciar lectura
    reader.readAsDataURL(file);
  });
  
  // ===== FUNCIÓN PARA MOSTRAR MENSAJES =====
  function mostrarMensaje(texto, tipo = 'info') {
    // Eliminar mensaje anterior si existe
    const mensajeAnterior = document.querySelector('.mensaje-flotante');
    if (mensajeAnterior) {
      mensajeAnterior.remove();
    }
    
    // Crear nuevo mensaje
    const mensaje = document.createElement('div');
    mensaje.className = 'mensaje-flotante';
    mensaje.textContent = texto;
    
    // Estilos
    mensaje.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 25px;
      border-radius: 8px;
      color: white;
      font-weight: bold;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      animation: slideIn 0.3s ease-out;
      ${tipo === 'success' ? 'background: #2ecc71;' : ''}
      ${tipo === 'error' ? 'background: #e74c3c;' : ''}
      ${tipo === 'info' ? 'background: #3498db;' : ''}
    `;
    
    document.body.appendChild(mensaje);
    
    // Auto-eliminar después de 4 segundos
    setTimeout(() => {
      if (mensaje.parentNode) {
        mensaje.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => mensaje.remove(), 300);
      }
    }, 4000);
    
    console.log(`📢 Mensaje: ${texto}`);
  }
  
  // ===== FUNCIONES GLOBALES (para los botones) =====
  window.borrarPerfume = function(index) {
    if (confirm(`¿Eliminar "${perfumes[index].nombre}"?`)) {
      const eliminado = perfumes.splice(index, 1);
      localStorage.setItem('perfumes', JSON.stringify(perfumes));
      mostrarPerfumes();
      mostrarMensaje(`🗑️ Eliminado: ${eliminado[0].nombre}`, 'info');
    }
  };
  
  window.editarPerfume = function(index) {
    const perfume = perfumes[index];
    const nuevoPrecio = prompt(`Nuevo precio para "${perfume.nombre}":`, perfume.precio);
    
    if (nuevoPrecio !== null) {
      const precioNum = parseFloat(nuevoPrecio);
      if (!isNaN(precioNum) && precioNum > 0) {
        perfume.precio = precioNum;
      }
    }
    
    const nuevoStock = prompt(`Nuevo stock para "${perfume.nombre}":`, perfume.stock);
    
    if (nuevoStock !== null) {
      const stockNum = parseInt(nuevoStock);
      if (!isNaN(stockNum) && stockNum >= 0) {
        perfume.stock = stockNum;
      }
    }
    
    perfumes[index] = perfume;
    localStorage.setItem('perfumes', JSON.stringify(perfumes));
    mostrarPerfumes();
    mostrarMensaje('✅ Perfume actualizado', 'success');
  };
  
  // ===== ESTILOS PARA ANIMACIONES =====
  const estilos = document.createElement('style');
  estilos.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(estilos);
  
  // ===== MOSTRAR PERFUMES AL CARGAR =====
  mostrarPerfumes();
  
  // ===== BOTÓN DE LIMPIEZA (solo para pruebas) =====
  const botonLimpiar = document.createElement('button');
  botonLimpiar.textContent = '🧹 Limpiar localStorage (DEBUG)';
  botonLimpiar.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #e74c3c;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px;
    z-index: 9999;
    opacity: 0.7;
  `;
  botonLimpiar.onclick = function() {
    if (confirm('¿Limpiar TODOS los perfumes? (Solo pruebas)')) {
      localStorage.removeItem('perfumes');
      perfumes = [];
      mostrarPerfumes();
      mostrarMensaje('🧹 localStorage limpiado', 'info');
    }
  };
  document.body.appendChild(botonLimpiar);
  
  console.log("✅ Admin inicializado correctamente");
});