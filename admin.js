// admin.js - VERSIÓN CORREGIDA Y FUNCIONAL
// No usar DOMContentLoaded para las funciones globales

// ===== VARIABLES GLOBALES =====
let perfumes = [];
let perfumeManager = null;

// ===== CLASE PARA MANEJAR PERFUMES =====
class PerfumeManager {
  constructor() {
    this.form = document.getElementById('formPerfume');
    this.productosAdmin = document.getElementById('productosAdmin');
    this.contadorPerfumes = document.getElementById('contadorPerfumes');
    this.init();
  }

  init() {
    // Cargar perfumes desde localStorage
    perfumes = JSON.parse(localStorage.getItem('perfumes')) || [];
    
    // Configurar evento del formulario
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.agregarPerfume(e));
      console.log('✅ Formulario configurado correctamente');
    } else {
      console.error('❌ Formulario no encontrado');
    }
    
    // Mostrar perfumes iniciales
    this.mostrarPerfumes();
  }

  // Mostrar todos los perfumes
  mostrarPerfumes() {
    if (!this.productosAdmin) {
      console.error('❌ Contenedor de productos no encontrado');
      return;
    }

    this.productosAdmin.innerHTML = '';
    
    if (perfumes.length === 0) {
      this.productosAdmin.innerHTML = `
        <div class="empty-message">
          <h3>📭 No hay perfumes en el inventario</h3>
          <p>Agrega tu primer perfume usando el formulario superior.</p>
        </div>
      `;
      this.actualizarContador();
      return;
    }

    perfumes.forEach((perfume, index) => {
      const div = document.createElement('div');
      div.className = 'producto-card';
      div.innerHTML = this.crearHTMLPerfume(perfume, index);
      this.productosAdmin.appendChild(div);
    });

    this.actualizarContador();
    console.log(`✅ Mostrando ${perfumes.length} perfumes`);
  }

  // Crear HTML para cada perfume
  crearHTMLPerfume(perfume, index) {
    const estado = perfume.stock > 0 ? 'Disponible' : 'Agotado';
    const estadoClase = perfume.stock > 0 ? 'status-disponible' : 'status-agotado';
    const tipoTexto = perfume.tipo === 'stock' ? 'En Stock' : 'Por Pedido';
    
    return `
      <img src="${perfume.imagen}" alt="${perfume.nombre}" 
           onerror="this.src='https://via.placeholder.com/300x200/e0e0e0/969696?text=Imagen+no+disponible'">
      <h3>${perfume.nombre}</h3>
      <p><strong>Precio:</strong> S/ ${perfume.precio.toFixed(2)}</p>
      <p><strong>Stock:</strong> ${perfume.stock} unidades</p>
      <p><strong>Tipo:</strong> ${tipoTexto}</p>
      <p><strong>Estado:</strong> <span class="status-stock ${estadoClasse}">${estado}</span></p>
      <div class="acciones">
        <button onclick="editarPerfume(${index})" title="Editar perfume">
          ✏️ Editar
        </button>
        <button onclick="borrarPerfume(${index})" title="Eliminar perfume">
          🗑️ Eliminar
        </button>
      </div>
    `;
  }

  // Actualizar contador
  actualizarContador() {
    if (this.contadorPerfumes) {
      this.contadorPerfumes.textContent = perfumes.length;
    }
  }

  // Agregar nuevo perfume
  agregarPerfume(e) {
    e.preventDefault();
    console.log('🔔 Intentando agregar perfume...');

    // Obtener valores del formulario
    const nombre = document.getElementById('nombre').value.trim();
    const precio = parseFloat(document.getElementById('precio').value);
    const stock = parseInt(document.getElementById('stock').value);
    const tipo = document.getElementById('tipo').value;
    const fileInput = document.getElementById('imagen');
    const file = fileInput.files[0];

    // Validaciones
    if (!nombre) {
      this.mostrarAlerta('Por favor, ingresa un nombre para el perfume.', 'error');
      return;
    }

    if (isNaN(precio) || precio <= 0) {
      this.mostrarAlerta('Por favor, ingresa un precio válido mayor a 0.', 'error');
      return;
    }

    if (isNaN(stock) || stock < 0) {
      this.mostrarAlerta('Por favor, ingresa un stock válido (0 o más).', 'error');
      return;
    }

    if (!tipo) {
      this.mostrarAlerta('Por favor, selecciona un tipo de disponibilidad.', 'error');
      return;
    }

    if (!file) {
      this.mostrarAlerta('Por favor, selecciona una imagen para el perfume.', 'error');
      return;
    }

    // Leer la imagen
    const reader = new FileReader();
    
    reader.onload = () => {
      const imagen = reader.result;
      
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
      
      // Mostrar mensaje de éxito
      this.mostrarAlerta(`✅ ¡Perfume "${nombre}" agregado exitosamente!`, 'success');
      
      // Actualizar vista
      this.mostrarPerfumes();
      
      // Limpiar formulario
      this.form.reset();
      
      // Efecto visual
      this.efectoExito();
      
      console.log('✅ Perfume agregado:', nuevoPerfume);
    };

    reader.onerror = () => {
      this.mostrarAlerta('Error al leer la imagen. Intenta con otra.', 'error');
    };

    reader.readAsDataURL(file);
  }

  // Mostrar alerta
  mostrarAlerta(mensaje, tipo = 'info') {
    // Eliminar alerta anterior si existe
    const alertaAnterior = document.querySelector('.custom-alert');
    if (alertaAnterior) {
      alertaAnterior.remove();
    }

    const alerta = document.createElement('div');
    alerta.className = `custom-alert ${tipo}`;
    alerta.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease-out;
        min-width: 300px;
        ${tipo === 'success' ? 'background: #2ecc71;' : ''}
        ${tipo === 'error' ? 'background: #e74c3c;' : ''}
        ${tipo === 'info' ? 'background: #3498db;' : ''}
      ">
        ${mensaje}
      </div>
    `;

    document.body.appendChild(alerta);

    // Auto-eliminar después de 4 segundos
    setTimeout(() => {
      if (alerta.parentNode) {
        alerta.remove();
      }
    }, 4000);
  }

  // Efecto visual de éxito
  efectoExito() {
    const submitBtn = this.form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.classList.add('success-message');
      setTimeout(() => {
        submitBtn.classList.remove('success-message');
      }, 500);
    }
  }
}

// ===== FUNCIONES GLOBALES =====
// Estas funciones deben ser GLOBALES para que funcionen con onclick

function borrarPerfume(index) {
  if (confirm(`¿Estás seguro de eliminar "${perfumes[index].nombre}"?`)) {
    perfumes.splice(index, 1);
    localStorage.setItem('perfumes', JSON.stringify(perfumes));
    
    // Actualizar la vista usando el manager
    if (perfumeManager) {
      perfumeManager.mostrarPerfumes();
      perfumeManager.mostrarAlerta('🗑️ Perfume eliminado correctamente', 'success');
    }
  }
}

function editarPerfume(index) {
  const perfume = perfumes[index];
  
  const nuevoPrecio = prompt(`Nuevo precio para "${perfume.nombre}" (S/):`, perfume.precio);
  if (nuevoPrecio === null) return;
  
  const nuevoStock = prompt(`Nuevo stock para "${perfume.nombre}":`, perfume.stock);
  if (nuevoStock === null) return;
  
  const precioNum = parseFloat(nuevoPrecio);
  const stockNum = parseInt(nuevoStock);
  
  if (!isNaN(precioNum) && precioNum > 0) {
    perfume.precio = precioNum;
  }
  
  if (!isNaN(stockNum) && stockNum >= 0) {
    perfume.stock = stockNum;
  }
  
  // Actualizar en el array
  perfumes[index] = perfume;
  localStorage.setItem('perfumes', JSON.stringify(perfumes));
  
  // Actualizar vista
  if (perfumeManager) {
    perfumeManager.mostrarPerfumes();
    perfumeManager.mostrarAlerta('✅ Perfume actualizado correctamente', 'success');
  }
}

// ===== INICIALIZACIÓN CUANDO EL DOM ESTÁ LISTO =====
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Inicializando sistema de administración...');
  
  // Crear instancia del manager
  perfumeManager = new PerfumeManager();
  
  // Agregar estilos para alertas
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
    
    .custom-alert {
      animation: slideIn 0.3s ease-out;
    }
    
    .custom-alert.fade-out {
      animation: slideOut 0.3s ease-out;
    }
  `;
  document.head.appendChild(style);
  
  // Botón para limpiar localStorage (solo desarrollo)
  const clearBtn = document.createElement('button');
  clearBtn.textContent = '🧹 Limpiar Todo (Solo pruebas)';
  clearBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #e74c3c;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    z-index: 9999;
    opacity: 0.7;
    transition: opacity 0.3s;
  `;
  clearBtn.onmouseover = () => clearBtn.style.opacity = '1';
  clearBtn.onmouseout = () => clearBtn.style.opacity = '0.7';
  clearBtn.onclick = function() {
    if (confirm('⚠️ ¿Borrar TODOS los perfumes? Solo para pruebas.')) {
      localStorage.removeItem('perfumes');
      perfumes = [];
      if (perfumeManager) {
        perfumeManager.mostrarPerfumes();
        perfumeManager.mostrarAlerta('🧹 Inventario limpiado', 'info');
      }
    }
  };
  document.body.appendChild(clearBtn);
  
  console.log('✅ Sistema de administración listo');
});

// Hacer el manager global para debugging
window.perfumeManager = perfumeManager;
window.perfumes = perfumes;