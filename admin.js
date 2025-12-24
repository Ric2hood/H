function agregarPerfume() {
  const nombre = document.getElementById("nombre").value;
  const precio = document.getElementById("precio").value;
  const stock = document.getElementById("stock").value;
  const imagen = document.getElementById("imagen").value;
  const mensaje = document.getElementById("mensaje");

  if (!nombre || !precio || !stock || !imagen) {
    mensaje.textContent = "Completa todos los campos";
    return;
  }

  let perfumes = JSON.parse(localStorage.getItem("perfumes")) || [];

  perfumes.push({
    id: Date.now(),
    nombre,
    precio,
    stock,
    imagen
  });

  localStorage.setItem("perfumes", JSON.stringify(perfumes));

  mensaje.textContent = "Perfume agregado correctamente ✔";

  document.getElementById("nombre").value = "";
  document.getElementById("precio").value = "";
  document.getElementById("stock").value = "";
  document.getElementById("imagen").value = "";
}