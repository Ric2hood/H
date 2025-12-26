// server.js
const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public')); // Servir todo lo de public/
app.use(express.json());
app.use(fileUpload());

// ------------------- RUTAS API -------------------

// 1. Obtener perfumes
app.get('/api/perfumes', (req, res) => {
  const dataPath = path.join(__dirname, 'data', 'perfumes.json');
  if (!fs.existsSync(dataPath)) return res.json([]);
  const perfumes = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  res.json(perfumes);
});

// 2. Agregar perfume
app.post('/api/perfumes', (req, res) => {
  const { nombre, precio, stock, tipo } = req.body;

  if (!req.files || !req.files.imagen) {
    return res.status(400).send('No se ha subido ninguna imagen');
  }

  const imagen = req.files.imagen;
  const uploadDir = path.join(__dirname, 'uploads');

  // Crear carpeta uploads si no existe
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

  const uploadPath = path.join(uploadDir, imagen.name);

  imagen.mv(uploadPath, (err) => {
    if (err) return res.status(500).send(err);

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

    // Guardar perfumes
    fs.writeFileSync(dataPath, JSON.stringify(perfumes, null, 2));
    res.send('Perfume agregado correctamente');
  });
});

// ------------------- RUTA RAÍZ -------------------
// Para mostrar index.html en cualquier ruta no API
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ------------------- INICIAR SERVIDOR -------------------
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
