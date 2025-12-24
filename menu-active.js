// Selecciona todos los enlaces del menú
const links = document.querySelectorAll('nav a');

// Obtiene el nombre del archivo actual
const current = location.pathname.split("/").pop();

// Recorre todos los enlaces y asigna clase 'active' al que coincida
links.forEach(link => {
  if(link.getAttribute('href') === current) {
    link.classList.add('active');
  }
});