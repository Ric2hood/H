// server.js
const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public')); // Servir archivos estáticos (HTML, CSS, JS)
app.use(express.json());
app.use(fileUpload());

// ------------------- RUTAS API -------------------

// Obtener todos los perfumes
app.get('/api/perfumes', (req, res) => {
  const dataPath = path.join(__dirname, 'data', 'perfumes.json');
  if (!fs.existsSync(dataPath)) return res.json([]);
  const perfumes = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  res.json(perfumes);
});

// Agregar un nuevo perfume
app.post('/api/perfumes', (req, res) => {
  const { nombre, precio, stock, tipo } = req.body;

  // Verificar que se haya enviado una imagen
  if (!req.files || !req.files.imagen) {
    return res.status(400).send('No se ha subido ninguna imagen');
  }

  const imagen = req.files.imagen;
  const uploadDir = path.join(__dirname, 'uploads');

  // Crear carpeta uploads si no existe
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

  const uploadPath = path.join(uploadDir, imagen.name);

  // Guardar imagen
  imagen.mv(uploadPath, (err) => {
    if (err) return res.status(500).send(err);

    // Guardar los datos del perfume
    const dataPath = path.join(__dirname, 'data', 'perfumes.json');
    const perfumes = fs.existsSync(dataPath)
      ? JSON.parse(fs.readFileSync(dataPath, 'utf8'))
      : [];

    perfumes.push({
      nombre,
      precio: parseFloat(precio),
      stock: parseInt(stock),
      tipo,
      imagen: `/uploads/${imagen.name}`
    });

    fs.writeFileSync(dataPath, JSON.stringify(perfumes, null, 2));
    res.send('Perfume agregado correctamente');
  });
});

// Ruta para servir index.html en cualquier otra ruta (no API)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ------------------- INICIAR SERVIDOR -------------------
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});