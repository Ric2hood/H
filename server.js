const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- MIDDLEWARE ----------
app.use(express.static('public'));
app.use(express.json());
app.use(fileUpload({
  useTempFiles: true
}));

// ---------- RUTAS API ----------

// Obtener perfumes
app.get('/api/perfumes', (req, res) => {
  const dataPath = path.join(__dirname, 'data', 'perfumes.json');
  if (!fs.existsSync(dataPath)) return res.json([]);
  const perfumes = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  res.json(perfumes);
});

// Agregar perfume (SIN CLOUDINARY)
app.post('/api/perfumes', async (req, res) => {
  try {
    const { nombre, precio, stock, tipo } = req.body;

    console.log('BODY:', req.body);
    console.log('FILES:', req.files);

    if (!req.files || !req.files.imagen) {
      return res.status(400).send('No se ha subido ninguna imagen');
    }

    // crear carpeta data si no existe
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    const dataPath = path.join(__dirname, 'data', 'perfumes.json');
    const perfumes = fs.existsSync(dataPath)
      ? JSON.parse(fs.readFileSync(dataPath, 'utf8'))
      : [];

    perfumes.push({
      nombre,
      precio: Number(precio),
      stock: Number(stock),
      tipo,
      imagen: 'https://via.placeholder.com/300'
    });

    fs.writeFileSync(dataPath, JSON.stringify(perfumes, null, 2));
    res.send('Perfume agregado correctamente (modo prueba)');

  } catch (err) {
    console.error('ERROR:', err);
    res.status(500).send('Error interno');
  }
});

// ---------- FRONT ----------
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ---------- START ----------
app.listen(PORT, () => {
  console.log('Servidor activo en puerto', PORT);
});