console.log("🚀 admin.js CARGADO");

// 1. Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  console.log("✅ DOM listo");
  
  // 2. Obtener el formulario
  const form = document.getElementById('formPerfume');
  
  if (!form) {
    console.error("❌ ERROR: No se encontró el formulario con id='formPerfume'");
    return;
  }
  
  console.log("✅ Formulario encontrado");
  
  // 3. Agregar evento SUPER SIMPLE
  form.addEventListener('submit', function(event) {
    // EVITAR que se recargue la página
    event.preventDefault();
    
    console.log("🎯 ¡BOTÓN PRESIONADO! Formulario enviado");
    
    // Obtener valores básicos
    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    
    console.log("Datos capturados:", { nombre, precio });
    
    // MOSTRAR ALERTA INMEDIATA (para ver que funciona)
    alert(`✅ ¡Funciona! Nombre: ${nombre}, Precio: ${precio}`);
    
    // Aquí iría el código para guardar en localStorage...
  });
  
  console.log("✅ Evento 'submit' configurado correctamente");
});