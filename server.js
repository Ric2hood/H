const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- CLOUDINARY CONFIG ----------
console.log('Cloudinary ENV:', {
  name: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY ? 'OK' : 'MISSING',
  secret: process.env.CLOUDINARY_API_SECRET ? 'OK' : 'MISSING'
}); 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

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

    // ⬇️ CREAR CARPETA DATA SI NO EXISTE
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    // Subir imagen a Cloudinary
    const resultado = await cloudinary.uploader.upload(
      req.files.imagen.tempFilePath,
      { folder: 'henris-perfumes' }
    );

    const dataPath = path.join(__dirname, 'data', 'perfumes.json');
    const perfumes = fs.existsSync(dataPath)
      ? JSON.parse(fs.readFileSync(dataPath, 'utf8'))
      : [];

    perfumes.push({
      nombre,
      precio: Number(precio),
      stock: Number(stock),
      tipo,
      imagen: resultado.secure_url
    });

    fs.writeFileSync(dataPath, JSON.stringify(perfumes, null, 2));
    res.send('Perfume agregado correctamente');

  } catch (err) {
  console.error('🔥 ERROR CLOUDINARY:', err);
  res.status(500).json({
    error: err.message,
    name: err.name
  });
}
});

// ---------- RUTA FRONT ----------
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ---------- START ----------
app.listen(PORT, () => {
  console.log('Servidor activo');
});