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

// Agregar perfume
app.post('/api/perfumes', async (req, res) => {
  try {
    const { nombre, precio, stock, tipo } = req.body;

    if (!req.files || !req.files.imagen) {
      return res.status(400).send('No se ha subido ninguna imagen');
    }

    // crear carpetas si no existen
    const dataDir = path.join(__dirname, 'data');
    const imgDir = path.join(__dirname, 'public', 'uploads');

    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
    if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });

    // guardar imagen
    const imagenFile = req.files.imagen;
    const nombreImagen = Date.now() + '_' + imagenFile.name;
    const rutaImagen = path.join(imgDir, nombreImagen);

    await imagenFile.mv(rutaImagen);

    // leer perfumes
    const dataPath = path.join(dataDir, 'perfumes.json');
    const perfumes = fs.existsSync(dataPath)
      ? JSON.parse(fs.readFileSync(dataPath, 'utf8'))
      : [];

    perfumes.push({
      nombre,
      precio: Number(precio),
      stock: Number(stock),
      tipo,
      imagen: `/uploads/${nombreImagen}`
    });

    fs.writeFileSync(dataPath, JSON.stringify(perfumes, null, 2));

    res.send('Perfume agregado correctamente');

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